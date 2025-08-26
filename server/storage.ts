import {
  type User,
  type InsertUser,
  type UpsertUser,
  type Template,
  type InsertTemplate,
  type Project,
  type InsertProject,
  type AiGeneratedContent,
  type InsertAiContent,
  type Component,
  type InsertComponent
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from './db'; // Use our configured Neon database connection
import { eq } from 'drizzle-orm';
import { users } from '@shared/schema';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Template operations
  getTemplates(): Promise<Template[]>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;

  // Project operations
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | null>;
  deleteProject(id: string): Promise<void>;

  // AI Content operations
  saveAiContent(content: InsertAiContent): Promise<AiGeneratedContent>;
  getAiContentByProject(projectId: string): Promise<AiGeneratedContent[]>;

  // Component operations
  getComponents(): Promise<Component[]>;
  getComponentsByType(type: string): Promise<Component[]>;
  createComponent(component: InsertComponent): Promise<Component>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private templates: Map<string, Template> = new Map();
  private projects: Map<string, Project> = new Map();
  private aiContent: Map<string, AiGeneratedContent> = new Map();
  private components: Map<string, Component> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed templates
    const businessTemplate: Template = {
      id: "business-1",
      name: "Corporate",
      description: "Professional business template",
      category: "business",
      thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
      sections: [
        {
          id: "header",
          type: "header",
          config: {
            title: "Your Company Name",
            navigation: ["Home", "About", "Services", "Contact"],
            ctaButton: "Get Started"
          }
        },
        {
          id: "hero",
          type: "hero",
          config: {
            title: "Professional Business Solutions",
            subtitle: "We help businesses grow with our expert services and innovative solutions.",
            ctaButtons: ["Learn More", "Contact Us"],
            backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c"
          }
        },
        {
          id: "about",
          type: "about",
          config: {
            title: "About Our Company",
            description: "With years of experience in the industry, we provide top-notch services to help your business succeed.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
          }
        },
        {
          id: "services",
          type: "services",
          config: {
            title: "Our Services",
            services: [
              { title: "Consulting", description: "Expert business consulting", icon: "fas fa-chart-line" },
              { title: "Development", description: "Custom software development", icon: "fas fa-code" },
              { title: "Support", description: "24/7 customer support", icon: "fas fa-headset" }
            ]
          }
        },
        {
          id: "footer",
          type: "footer",
          config: {
            title: "Get In Touch",
            description: "Ready to work together? Contact us today.",
            socialLinks: ["twitter", "linkedin", "facebook"]
          }
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const portfolioTemplate: Template = {
      id: "portfolio-3",
      name: "Developer",
      description: "Minimal developer portfolio",
      category: "portfolio",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
      sections: [
        {
          id: "header",
          type: "header",
          config: {
            title: "John Doe",
            navigation: ["Home", "About", "Portfolio", "Contact"],
            ctaButton: "Get in Touch"
          }
        },
        {
          id: "hero",
          type: "hero",
          config: {
            title: "Full-Stack Developer & Design Enthusiast",
            subtitle: "I create beautiful, functional websites and applications that solve real-world problems.",
            ctaButtons: ["View My Work", "Download Resume"],
            backgroundGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          }
        },
        {
          id: "about",
          type: "about",
          config: {
            title: "About Me",
            description: "With over 5 years of experience in web development, I specialize in creating modern, responsive websites using the latest technologies.",
            skills: ["React", "Node.js", "TypeScript", "Python"],
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
          }
        },
        {
          id: "services",
          type: "services",
          config: {
            title: "What I Do",
            services: [
              { title: "Frontend Development", description: "Creating responsive, interactive user interfaces", icon: "fas fa-code" },
              { title: "Backend Development", description: "Building robust APIs and server-side applications", icon: "fas fa-server" },
              { title: "Mobile Development", description: "Developing cross-platform mobile applications", icon: "fas fa-mobile-alt" }
            ]
          }
        },
        {
          id: "footer",
          type: "footer",
          config: {
            title: "Let's Work Together",
            description: "Ready to bring your ideas to life? I'm here to help you create something amazing.",
            socialLinks: ["twitter", "linkedin", "github", "dribbble"]
          }
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.templates.set(businessTemplate.id, businessTemplate);
    this.templates.set(portfolioTemplate.id, portfolioTemplate);

    // Seed more templates - Bootstrap inspired
    const templates = [
      // Business Templates
      { id: "business-2", name: "Bootstrap Corporate", category: "business", thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984", description: "Professional Bootstrap-based corporate website" },
      { id: "business-3", name: "SaaS Landing", category: "business", thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", description: "Modern SaaS product landing page" },
      { id: "business-4", name: "Digital Agency", category: "business", thumbnail: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0", description: "Creative agency portfolio with services" },
      { id: "business-5", name: "Startup MVP", category: "business", thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd", description: "Clean startup landing with call-to-action" },
      { id: "business-6", name: "Professional Services", category: "business", thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab", description: "Law firm, consulting, professional services" },

      // Portfolio Templates
      { id: "portfolio-1", name: "Creative Portfolio", category: "portfolio", thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c", description: "Designer and artist portfolio showcase" },
      { id: "portfolio-2", name: "Photography Studio", category: "portfolio", thumbnail: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e", description: "Professional photography portfolio" },
      { id: "portfolio-4", name: "Architecture Firm", category: "portfolio", thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e", description: "Architectural projects showcase" },
      { id: "portfolio-5", name: "Personal Blog", category: "portfolio", thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68e2c6c725", description: "Personal brand and blog template" },
      { id: "portfolio-6", name: "Music Artist", category: "portfolio", thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f", description: "Musician and artist portfolio" },

      // E-commerce Templates
      { id: "ecommerce-1", name: "Fashion Store", category: "ecommerce", thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8", description: "Modern fashion e-commerce with React components" },
      { id: "ecommerce-2", name: "Tech Electronics", category: "ecommerce", thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43", description: "Electronics store with product catalog" },
      { id: "ecommerce-3", name: "Handmade Crafts", category: "ecommerce", thumbnail: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b", description: "Artisan crafts and handmade products" },
      { id: "ecommerce-4", name: "Beauty & Wellness", category: "ecommerce", thumbnail: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6", description: "Beauty products and wellness store" },
      { id: "ecommerce-5", name: "Food & Restaurant", category: "ecommerce", thumbnail: "https://images.unsplash.com/photo-1414235077428-838989a212a2d", description: "Restaurant menu and online ordering" }
    ];

    // Create detailed templates with Bootstrap/React patterns
    templates.forEach(t => {
      let sections = [];

      // Bootstrap Corporate Template
      if (t.id === "business-2") {
        sections = [
          {
            id: "navbar",
            type: "header",
            config: {
              title: "BootCorp",
              navigation: ["Home", "About", "Services", "Portfolio", "Contact"],
              ctaButton: "Get Quote",
              style: "bootstrap-navbar",
              fixed: true
            }
          },
          {
            id: "hero-jumbotron",
            type: "hero",
            config: {
              title: "Professional Business Solutions",
              subtitle: "Bootstrap-powered corporate website with modern components and responsive design for your business growth.",
              ctaButtons: ["Learn More", "Contact Sales"],
              backgroundImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
              layout: "jumbotron",
              overlay: true
            }
          },
          {
            id: "features-cards",
            type: "services",
            config: {
              title: "Why Choose Us",
              subtitle: "Professional services with Bootstrap card components",
              layout: "card-deck",
              services: [
                { title: "Strategic Planning", description: "Comprehensive business strategy development", icon: "fas fa-chart-line", badge: "Popular" },
                { title: "Digital Transformation", description: "Modern technology implementation", icon: "fas fa-digital-tachograph", badge: "New" },
                { title: "24/7 Support", description: "Round-the-clock customer assistance", icon: "fas fa-headset", badge: "Premium" }
              ]
            }
          },
          {
            id: "testimonials-carousel",
            type: "testimonials",
            config: {
              title: "Client Success Stories",
              layout: "carousel",
              testimonials: [
                { name: "Sarah Johnson", company: "Tech Startup", text: "Amazing results with their Bootstrap implementation", rating: 5 },
                { name: "Mike Chen", company: "E-commerce", text: "Professional service and great communication", rating: 5 }
              ]
            }
          }
        ];
      }

      // SaaS Landing Template
      else if (t.id === "business-3") {
        sections = [
          {
            id: "saas-header",
            type: "header",
            config: {
              title: "SaaSPro",
              navigation: ["Features", "Pricing", "About", "Blog"],
              ctaButton: "Start Free Trial",
              style: "minimal",
              transparent: true
            }
          },
          {
            id: "hero-gradient",
            type: "hero",
            config: {
              title: "Scale Your Business with AI-Powered SaaS",
              subtitle: "Join 10,000+ companies using our platform to streamline operations and boost productivity.",
              ctaButtons: ["Start Free Trial", "Watch Demo"],
              backgroundGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              features: ["✓ 14-day free trial", "✓ No credit card required", "✓ Cancel anytime"]
            }
          },
          {
            id: "feature-grid",
            type: "services",
            config: {
              title: "Powerful Features",
              subtitle: "Everything you need to manage and grow your business",
              layout: "grid-3",
              services: [
                { title: "Analytics Dashboard", description: "Real-time insights and reporting", icon: "fas fa-chart-bar" },
                { title: "Team Collaboration", description: "Work together seamlessly", icon: "fas fa-users" },
                { title: "API Integration", description: "Connect with your favorite tools", icon: "fas fa-plug" },
                { title: "Advanced Security", description: "Enterprise-grade protection", icon: "fas fa-shield-alt" },
                { title: "Custom Workflows", description: "Automate your processes", icon: "fas fa-cogs" },
                { title: "24/7 Support", description: "Get help when you need it", icon: "fas fa-life-ring" }
              ]
            }
          }
        ];
      }

      // Fashion E-commerce Template
      else if (t.id === "ecommerce-1") {
        sections = [
          {
            id: "fashion-nav",
            type: "header",
            config: {
              title: "StyleHub",
              navigation: ["Women", "Men", "Kids", "Sale", "Brands"],
              ctaButton: "Search",
              style: "ecommerce",
              searchBar: true,
              cartIcon: true
            }
          },
          {
            id: "fashion-hero",
            type: "hero",
            config: {
              title: "New Spring Collection",
              subtitle: "Discover the latest trends and timeless pieces for your wardrobe.",
              ctaButtons: ["Shop Women", "Shop Men"],
              backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
              layout: "split",
              productHighlight: true
            }
          },
          {
            id: "product-grid",
            type: "products",
            config: {
              title: "Featured Products",
              layout: "grid-4",
              products: [
                { name: "Designer Dress", price: "$299", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8", badge: "New" },
                { name: "Casual Sneakers", price: "$129", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772", badge: "Sale" },
                { name: "Classic Handbag", price: "$199", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62" },
                { name: "Summer Jacket", price: "$159", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5" }
              ]
            }
          }
        ];
      }

      const template: Template = {
        ...t,
        sections: sections.length > 0 ? sections : [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.templates.set(t.id, template);
    });
  }

  // User operations
  async getUser(userId: string): Promise<User | null> {
    try {
      const result = await db.select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }).from(users).where(eq(users.id, userId)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // This method would also need to be updated to query the SQL database
    // For now, it remains as a placeholder, assuming it will be handled separately.
    // If it needs to be implemented using SQL, it would look similar to getUser but filtering by email.
    try {
      const result = await db.select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }).from(users).where(eq(users.email, username)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // This method would also need to be updated to insert into the SQL database
    // For now, it remains as a placeholder, assuming it will be handled separately.
    const id = randomUUID(); // This might be generated by the DB or provided
    const user: User = {
      ...insertUser,
      id,
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    // Example of SQL insertion (requires actual DB interaction logic)
    // await db.insert(users).values(user);
    this.users.set(id, user); // Keep in memory for now, until DB logic is fully implemented
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // This method would also need to be updated to upsert into the SQL database
    // For now, it remains as a placeholder, assuming it will be handled separately.
    const existingUser = Array.from(this.users.values()).find(user => user.id === userData.id);

    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date()
      };
      this.users.set(userData.id!, updatedUser);
      return updatedUser;
    } else {
      const newUser: User = {
        ...userData,
        id: userData.id || randomUUID(),
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(newUser.id, newUser);
      return newUser;
    }
  }

  // Template operations
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(t => t.category === category);
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = {
      ...insertTemplate,
      id,
      description: insertTemplate.description || null,
      thumbnail: insertTemplate.thumbnail || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.templates.set(id, template);
    return template;
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.userId === userId);
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      templateId: insertProject.templateId || null,
      isPublished: insertProject.isPublished || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | null> {
    const project = this.projects.get(id); // Changed from find to get for Map
    if (!project) return null;

    // Handle backward compatibility - convert sections to pages if needed
    if (updates.sections && !updates.pages) {
      const homePage = {
        id: 'home',
        name: 'Home',
        slug: 'home',
        sections: updates.sections,
        isHomePage: true
      };
      updates.pages = [homePage];
      // Clean up the old 'sections' property if it's being replaced by 'pages'
      delete (updates as any).sections;
    }

    const updatedProject: Project = {
      ...project,
      ...updates,
      updatedAt: new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    this.projects.delete(id);
  }

  // AI Content operations
  async saveAiContent(insertContent: InsertAiContent): Promise<AiGeneratedContent> {
    const id = randomUUID();
    const content: AiGeneratedContent = {
      ...insertContent,
      id,
      tone: insertContent.tone || null,
      createdAt: new Date()
    };
    this.aiContent.set(id, content);
    return content;
  }

  async getAiContentByProject(projectId: string): Promise<AiGeneratedContent[]> {
    return Array.from(this.aiContent.values()).filter(c => c.projectId === projectId);
  }

  // Component operations
  async getComponents(): Promise<Component[]> {
    return Array.from(this.components.values());
  }

  async getComponentsByType(type: string): Promise<Component[]> {
    return Array.from(this.components.values()).filter(c => c.type === type);
  }

  async createComponent(insertComponent: InsertComponent): Promise<Component> {
    const id = randomUUID();
    const component: Component = {
      ...insertComponent,
      id,
      createdAt: new Date()
    };
    this.components.set(id, component);
    return component;
  }
}

export const storage = new MemStorage();