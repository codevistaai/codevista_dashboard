import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateContent, generateColorScheme, type AIContentRequest } from "./openai";
import { insertProjectSchema, insertAiContentSchema } from "@shared/schema";
import { AuthService } from "./auth";
import { authenticateToken, type AuthenticatedRequest } from "./authMiddleware";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/register', async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().optional(),
        lastName: z.string().optional()
      });

      const { email, password, firstName, lastName } = schema.parse(req.body);

      const user = await AuthService.createUser({
        email,
        password,
        firstName,
        lastName
      });

      const { user: authUser, token } = await AuthService.loginUser(email, password) || {};

      if (!authUser || !token) {
        throw new Error('Failed to create session');
      }

      res.json({ user: authUser, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      }

      const message = error instanceof Error ? error.message : 'Registration failed';
      console.error("Registration error:", error);
      res.status(400).json({ message });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        password: z.string()
      });

      const { email, password } = schema.parse(req.body);

      const result = await AuthService.loginUser(email, password);

      if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }

      console.error("Login error:", error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.post('/api/logout', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (token) {
        await AuthService.logoutUser(token);
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: 'Logout failed' });
    }
  });

  app.get('/api/auth/user', authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });


  // Template routes
  app.get("/api/templates", async (_req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const templates = await storage.getTemplatesByCategory(category);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates by category:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Project routes
  app.get("/api/projects", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const projects = await storage.getProjects(req.user!.id);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const project = await storage.updateProject(id, updates);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProject(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // AI Content Generation routes
  app.post("/api/ai/generate-content", async (req, res) => {
    try {
      const requestSchema = z.object({
        contentType: z.enum(["headline", "description", "services", "cta"]),
        businessContext: z.string().min(1),
        tone: z.enum(["professional", "friendly", "creative", "authoritative"]),
        additionalContext: z.string().optional(),
        projectId: z.string().optional()
      });

      const requestData = requestSchema.parse(req.body);
      const aiRequest: AIContentRequest = {
        contentType: requestData.contentType,
        businessContext: requestData.businessContext,
        tone: requestData.tone,
        additionalContext: requestData.additionalContext
      };

      const result = await generateContent(aiRequest);

      // Save AI content if projectId is provided
      if (requestData.projectId) {
        const aiContentData = insertAiContentSchema.parse({
          projectId: requestData.projectId,
          contentType: requestData.contentType,
          prompt: requestData.businessContext,
          generatedText: result.suggestions.join(", "),
          tone: requestData.tone
        });
        await storage.saveAiContent(aiContentData);
      }

      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error generating AI content:", error);
      res.status(500).json({ message: "Failed to generate AI content" });
    }
  });

  app.post("/api/ai/generate-colors", async (req, res) => {
    try {
      const { businessContext } = req.body;
      if (!businessContext) {
        return res.status(400).json({ message: "Business context is required" });
      }

      const colors = await generateColorScheme(businessContext);
      res.json(colors);
    } catch (error) {
      console.error("Error generating color scheme:", error);
      res.status(500).json({ message: "Failed to generate color scheme" });
    }
  });

  // Export routes
  app.post("/api/export", async (req, res) => {
    try {
      const { projectId, format } = req.body;

      if (!projectId || !format) {
        return res.status(400).json({ message: "Project ID and format are required" });
      }

      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // For MVP, return a mock export URL
      const exportUrl = `https://exports.codevista.ai/${projectId}/${format}`;

      res.json({ 
        success: true, 
        downloadUrl: exportUrl,
        format: format,
        message: "Export prepared successfully"
      });
    } catch (error) {
      console.error("Error exporting project:", error);
      res.status(500).json({ message: "Failed to export project" });
    }
  });

  // Component library routes
  app.get("/api/components", async (_req, res) => {
    try {
      const components = await storage.getComponents();
      res.json(components);
    } catch (error) {
      console.error("Error fetching components:", error);
      res.status(500).json({ message: "Failed to fetch components" });
    }
  });

  app.get("/api/components/type/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const components = await storage.getComponentsByType(type);
      res.json(components);
    } catch (error) {
      console.error("Error fetching components by type:", error);
      res.status(500).json({ message: "Failed to fetch components" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}