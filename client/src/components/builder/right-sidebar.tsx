import { useBuilderStore } from "@/store/builder-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export function RightSidebar() {
  const { 
    rightSidebarTab, 
    setRightSidebarTab, 
    currentProject, 
    updateProjectSettings 
  } = useBuilderStore();

  const [businessContext, setBusinessContext] = useState("");

  const generateColorsMutation = useMutation({
    mutationFn: async (context: string) => {
      const response = await fetch("/api/ai/generate-colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessContext: context })
      });
      if (!response.ok) throw new Error("Failed to generate colors");
      return response.json();
    },
    onSuccess: (colors) => {
      updateProjectSettings({ colors });
    }
  });

  const handleGenerateColors = () => {
    if (!businessContext.trim()) return;
    generateColorsMutation.mutate(businessContext);
  };

  const colorSchemes = [
    { primary: "#6366F1", secondary: "#8B5CF6", accent: "#10B981" },
    { primary: "#10B981", secondary: "#059669", accent: "#34D399" },
    { primary: "#F59E0B", secondary: "#D97706", accent: "#FBBF24" },
    { primary: "#EF4444", secondary: "#DC2626", accent: "#F87171" }
  ];

  return (
    <div className="w-full lg:w-80 bg-white border-l border-gray-200 flex flex-col h-full" data-testid="right-sidebar">
      {/* Property Tabs */}
      <div className="flex border-b border-gray-200">
        <Button
          variant="ghost"
          onClick={() => setRightSidebarTab("design")}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-none ${
            rightSidebarTab === "design"
              ? "text-primary border-b-2 border-primary bg-blue-50"
              : "text-gray-500 hover:text-gray-700"
          }`}
          data-testid="tab-design"
        >
          <i className="fas fa-palette mr-2"></i>Design
        </Button>
        <Button
          variant="ghost"
          onClick={() => setRightSidebarTab("content")}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-none ${
            rightSidebarTab === "content"
              ? "text-primary border-b-2 border-primary bg-blue-50"
              : "text-gray-500 hover:text-gray-700"
          }`}
          data-testid="tab-content"
        >
          <i className="fas fa-edit mr-2"></i>Content
        </Button>
        <Button
          variant="ghost"
          onClick={() => setRightSidebarTab("settings")}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-none ${
            rightSidebarTab === "settings"
              ? "text-primary border-b-2 border-primary bg-blue-50"
              : "text-gray-500 hover:text-gray-700"
          }`}
          data-testid="tab-settings"
        >
          <i className="fas fa-cog mr-2"></i>Settings
        </Button>
      </div>

      {/* Property Panel */}
      <div className="flex-1 overflow-y-auto p-4">
        {rightSidebarTab === "design" && (
          <div className="space-y-6">
            {/* Color Scheme */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Color Scheme</h3>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {colorSchemes.map((scheme, index) => (
                  <button
                    key={index}
                    onClick={() => updateProjectSettings({ colors: scheme })}
                    className={`aspect-square rounded-lg border-2 ${
                      currentProject?.settings.colors.primary === scheme.primary
                        ? "border-primary"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ 
                      background: `linear-gradient(45deg, ${scheme.primary}, ${scheme.secondary})` 
                    }}
                    data-testid={`color-scheme-${index}`}
                  />
                ))}
              </div>
              
              {/* AI Color Suggestion */}
              <div className="space-y-2">
                <Input
                  placeholder="Describe your business..."
                  value={businessContext}
                  onChange={(e) => setBusinessContext(e.target.value)}
                  className="text-sm"
                  data-testid="input-business-context"
                />
                <Button
                  onClick={handleGenerateColors}
                  disabled={generateColorsMutation.isPending || !businessContext.trim()}
                  className="w-full text-sm border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  data-testid="button-generate-colors"
                >
                  <i className="fas fa-magic mr-2 text-secondary"></i>
                  {generateColorsMutation.isPending ? "Generating..." : "AI Color Suggestions"}
                </Button>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Typography</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-1">Font Family</Label>
                  <Select
                    value={currentProject?.settings.typography.fontFamily}
                    onValueChange={(value) => updateProjectSettings({
                      typography: { ...currentProject?.settings.typography!, fontFamily: value }
                    })}
                  >
                    <SelectTrigger data-testid="select-font-family">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="playfair">Playfair Display</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500 mb-1">Heading Size</Label>
                  <Slider
                    value={[currentProject?.settings.typography.headingSize || 48]}
                    onValueChange={([value]) => updateProjectSettings({
                      typography: { ...currentProject?.settings.typography!, headingSize: value }
                    })}
                    min={24}
                    max={72}
                    step={2}
                    className="w-full"
                    data-testid="slider-heading-size"
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500 mb-1">Body Size</Label>
                  <Slider
                    value={[currentProject?.settings.typography.bodySize || 16]}
                    onValueChange={([value]) => updateProjectSettings({
                      typography: { ...currentProject?.settings.typography!, bodySize: value }
                    })}
                    min={14}
                    max={24}
                    step={1}
                    className="w-full"
                    data-testid="slider-body-size"
                  />
                </div>
              </div>
            </div>

            {/* Layout */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Layout</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-1">Section Spacing</Label>
                  <Slider
                    value={[currentProject?.settings.layout.spacing || 16]}
                    onValueChange={([value]) => updateProjectSettings({
                      layout: { ...currentProject?.settings.layout!, spacing: value }
                    })}
                    min={8}
                    max={32}
                    step={2}
                    className="w-full"
                    data-testid="slider-spacing"
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500 mb-1">Container Width</Label>
                  <Select
                    value={currentProject?.settings.layout.containerWidth}
                    onValueChange={(value) => updateProjectSettings({
                      layout: { ...currentProject?.settings.layout!, containerWidth: value }
                    })}
                  >
                    <SelectTrigger data-testid="select-container-width">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Width</SelectItem>
                      <SelectItem value="6xl">Large (1200px)</SelectItem>
                      <SelectItem value="4xl">Medium (896px)</SelectItem>
                      <SelectItem value="2xl">Small (672px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Animations */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Animations</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-700">Scroll Animations</Label>
                  <Switch
                    checked={currentProject?.settings.animations.scrollAnimations}
                    onCheckedChange={(checked) => updateProjectSettings({
                      animations: { ...currentProject?.settings.animations!, scrollAnimations: checked }
                    })}
                    data-testid="switch-scroll-animations"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-700">Hover Effects</Label>
                  <Switch
                    checked={currentProject?.settings.animations.hoverEffects}
                    onCheckedChange={(checked) => updateProjectSettings({
                      animations: { ...currentProject?.settings.animations!, hoverEffects: checked }
                    })}
                    data-testid="switch-hover-effects"
                  />
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500 mb-1">Animation Speed</Label>
                  <Select
                    value={currentProject?.settings.animations.speed}
                    onValueChange={(value: "slow" | "normal" | "fast") => updateProjectSettings({
                      animations: { ...currentProject?.settings.animations!, speed: value }
                    })}
                  >
                    <SelectTrigger data-testid="select-animation-speed">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {rightSidebarTab === "content" && (
          <div className="space-y-4" data-testid="content-panel">
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-edit text-2xl mb-2"></i>
              <p>Select a section to edit its content</p>
            </div>
          </div>
        )}

        {rightSidebarTab === "settings" && (
          <div className="space-y-4" data-testid="settings-panel">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Project Settings</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1">Project Name</Label>
                  <Input
                    value={currentProject?.name || ""}
                    className="text-sm"
                    data-testid="input-project-name"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-700">Published</Label>
                  <Switch
                    checked={currentProject?.isPublished}
                    data-testid="switch-published"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
