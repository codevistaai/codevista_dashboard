import { useQuery } from "@tanstack/react-query";
import { useBuilderStore } from "@/store/builder-store";
import { TemplateData } from "@/types/builder";
import { useState } from "react";

interface TemplateLibraryProps {
  searchQuery: string;
}

export function TemplateLibrary({ searchQuery }: TemplateLibraryProps) {
  const { setCurrentProject } = useBuilderStore();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("portfolio-3");

  const { data: templates, isLoading } = useQuery<TemplateData[]>({
    queryKey: ["/api/templates"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredTemplates = templates?.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTemplates = filteredTemplates?.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, TemplateData[]>);

  const handleTemplateSelect = async (template: TemplateData) => {
    setSelectedTemplateId(template.id);
    
    // Fetch full template data
    try {
      const response = await fetch(`/api/templates/${template.id}`);
      const fullTemplate = await response.json();
      
      // Create new project from template
      const newProject = {
        id: `project-${Date.now()}`,
        name: `${template.name} Website`,
        templateId: template.id,
        sections: fullTemplate.sections || [],
        settings: {
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
            speed: "normal" as const
          }
        },
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setCurrentProject(newProject);
    } catch (error) {
      console.error("Error loading template:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4" data-testid="templates-loading">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-300 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categoryTitles: Record<string, string> = {
    business: "Business",
    portfolio: "Portfolio", 
    ecommerce: "E-commerce"
  };

  return (
    <div className="space-y-4" data-testid="template-library">
      {groupedTemplates && Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-gray-700 mb-3" data-testid={`category-${category}`}>
            {categoryTitles[category] || category}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {categoryTemplates.map((template) => (
              <div
                key={template.id}
                className="group cursor-pointer template-card"
                onClick={() => handleTemplateSelect(template)}
                data-testid={`template-${template.id}`}
              >
                <div className={`bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedTemplateId === template.id 
                    ? "border-primary bg-primary bg-opacity-5" 
                    : "border-transparent group-hover:border-primary"
                }`}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={template.thumbnail} 
                      alt={`${template.name} template`} 
                      className="w-full h-24 object-cover template-thumbnail transition-transform duration-200"
                    />
                    {selectedTemplateId === template.id && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" data-testid="template-selected-indicator"></div>
                    )}
                  </div>
                  <div className="p-2">
                    <h4 className="text-xs font-medium text-gray-900" data-testid={`template-name-${template.id}`}>
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-500" data-testid={`template-description-${template.id}`}>
                      {template.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {(!groupedTemplates || Object.keys(groupedTemplates).length === 0) && !isLoading && (
        <div className="text-center py-8 text-gray-500" data-testid="no-templates">
          {searchQuery ? "No templates found matching your search." : "No templates available."}
        </div>
      )}
    </div>
  );
}
