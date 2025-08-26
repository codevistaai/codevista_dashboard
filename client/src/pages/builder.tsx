import { useEffect, useState } from "react";
import { useBuilderStore } from "@/store/builder-store";
import { Header } from "@/components/builder/header";
import { LeftSidebar } from "@/components/builder/left-sidebar";
import { CentralCanvas } from "@/components/builder/central-canvas";
import { RightSidebar } from "@/components/builder/right-sidebar";
import { AIAssistantModal } from "@/components/builder/ai-assistant-modal";
import { ExportModal } from "@/components/builder/export-modal";
import { Button } from "@/components/ui/button";
import { WebsiteSettings, WebsiteSection } from "@/types/builder";
import { Menu, Palette, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultSettings: WebsiteSettings = {
  colors: {
    primary: "#6366F1",
    secondary: "#8B5CF6", 
    accent: "#10B981"
  },
  typography: {
    fontFamily: "inter",
    headingSize: 48,
    bodySize: 16
  },
  layout: {
    spacing: 16,
    containerWidth: "6xl"
  },
  animations: {
    scrollAnimations: true,
    hoverEffects: false,
    speed: "normal"
  }
};

const defaultSections: WebsiteSection[] = [
  {
    id: "header",
    type: "header",
    order: 1,
    config: {
      title: "John Doe",
      navigation: ["Home", "About", "Portfolio", "Contact"],
      ctaButton: "Get in Touch",
      backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c"
    }
  },
  {
    id: "hero",
    type: "hero", 
    order: 2,
    config: {
      title: "Full-Stack Developer & Design Enthusiast",
      subtitle: "I create beautiful, functional websites and applications that solve real-world problems. Let's build something amazing together.",
      ctaButtons: ["View My Work", "Download Resume"],
      backgroundGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
  },
  {
    id: "about",
    type: "about",
    order: 3,
    config: {
      title: "About Me",
      description: "With over 5 years of experience in web development, I specialize in creating modern, responsive websites using the latest technologies. My passion lies in combining technical expertise with creative design to deliver exceptional user experiences.",
      skills: ["React", "Node.js", "TypeScript", "Python"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    }
  },
  {
    id: "services",
    type: "services",
    order: 4,
    config: {
      title: "What I Do",
      subtitle: "I offer a full range of web development services, from initial concept to final deployment and ongoing maintenance.",
      services: [
        {
          title: "Frontend Development",
          description: "Creating responsive, interactive user interfaces using React, Vue.js, and modern CSS frameworks.",
          icon: "fas fa-code"
        },
        {
          title: "Backend Development", 
          description: "Building robust APIs and server-side applications with Node.js, Python, and cloud technologies.",
          icon: "fas fa-server"
        },
        {
          title: "Mobile Development",
          description: "Developing cross-platform mobile applications using React Native and Flutter frameworks.",
          icon: "fas fa-mobile-alt"
        }
      ]
    }
  },
  {
    id: "footer",
    type: "footer",
    order: 5,
    config: {
      title: "Let's Work Together",
      description: "Ready to bring your ideas to life? I'm here to help you create something amazing.",
      socialLinks: ["twitter", "linkedin", "github", "dribbble"],
      copyright: "© 2024 John Doe. All rights reserved."
    }
  }
];

type MobilePanel = 'templates' | 'canvas' | 'design';

export default function Builder() {
  const { setCurrentProject } = useBuilderStore();
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('canvas');
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Initialize with a default project for MVP
    const defaultProject = {
      id: "default-project",
      name: "My Portfolio Website",
      sections: defaultSections,
      settings: defaultSettings,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCurrentProject(defaultProject);
  }, [setCurrentProject]);

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col" data-testid="builder-container">
      <Header />
      
      {/* Desktop Layout (3 panels side by side) */}
      <div className="hidden lg:flex h-full">
        <LeftSidebar />
        <CentralCanvas />
        <RightSidebar />
      </div>

      {/* Mobile/Tablet Layout (single panel with navigation) */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Mobile Navigation */}
        <div className="bg-white border-b border-gray-200 flex">
          <Button
            variant={mobilePanel === 'templates' ? 'default' : 'ghost'}
            onClick={() => setMobilePanel('templates')}
            className={cn(
              "flex-1 rounded-none border-b-2 transition-colors",
              mobilePanel === 'templates' 
                ? "border-primary text-primary" 
                : "border-transparent"
            )}
            data-testid="mobile-tab-templates"
          >
            <Menu className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button
            variant={mobilePanel === 'canvas' ? 'default' : 'ghost'}
            onClick={() => setMobilePanel('canvas')}
            className={cn(
              "flex-1 rounded-none border-b-2 transition-colors",
              mobilePanel === 'canvas' 
                ? "border-primary text-primary" 
                : "border-transparent"
            )}
            data-testid="mobile-tab-canvas"
          >
            <Palette className="h-4 w-4 mr-2" />
            Canvas
          </Button>
          <Button
            variant={mobilePanel === 'design' ? 'default' : 'ghost'}
            onClick={() => setMobilePanel('design')}
            className={cn(
              "flex-1 rounded-none border-b-2 transition-colors",
              mobilePanel === 'design' 
                ? "border-primary text-primary" 
                : "border-transparent"
            )}
            data-testid="mobile-tab-design"
          >
            <Settings className="h-4 w-4 mr-2" />
            Design
          </Button>
        </div>

        {/* Mobile Panel Content */}
        <div className="flex-1 overflow-hidden">
          {mobilePanel === 'templates' && <LeftSidebar />}
          {mobilePanel === 'canvas' && <CentralCanvas />}
          {mobilePanel === 'design' && <RightSidebar />}
        </div>
      </div>

      <AIAssistantModal />
      <ExportModal />
    </div>
  );
}
