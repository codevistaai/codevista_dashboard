import { useState } from "react";
import { useBuilderStore } from "@/store/builder-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { AIContentRequest, AIContentResponse } from "@/types/builder";

export function AIAssistantModal() {
  const { aiModalOpen, closeAiModal, isGeneratingContent, setGeneratingContent } = useBuilderStore();
  const [contentType, setContentType] = useState<"headline" | "description" | "services" | "cta">("headline");
  const [businessContext, setBusinessContext] = useState("");
  const [tone, setTone] = useState<"professional" | "friendly" | "creative" | "authoritative">("professional");
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);

  const generateContentMutation = useMutation({
    mutationFn: async (request: AIContentRequest): Promise<AIContentResponse> => {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });
      if (!response.ok) throw new Error("Failed to generate content");
      return response.json();
    },
    onMutate: () => {
      setGeneratingContent(true);
    },
    onSuccess: (data) => {
      setGeneratedContent(data.suggestions);
      setGeneratingContent(false);
    },
    onError: (error) => {
      console.error("AI generation error:", error);
      setGeneratingContent(false);
    }
  });

  const handleGenerate = () => {
    if (!businessContext.trim()) return;
    
    generateContentMutation.mutate({
      contentType,
      businessContext,
      tone,
      additionalContext: ""
    });
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleUseContent = (content: string) => {
    // TODO: Apply selected content to the current section
    console.log("Using content:", content);
    closeAiModal();
  };

  const contentTypes = [
    { id: "headline", label: "Headlines", description: "Catchy titles and taglines", icon: "fas fa-heading" },
    { id: "description", label: "Descriptions", description: "About sections and content", icon: "fas fa-paragraph" },
    { id: "services", label: "Services", description: "Service offerings and features", icon: "fas fa-list" },
    { id: "cta", label: "Call-to-Actions", description: "Buttons and action text", icon: "fas fa-bullhorn" }
  ];

  const tones = [
    { id: "professional", label: "Professional" },
    { id: "friendly", label: "Friendly" },
    { id: "creative", label: "Creative" },
    { id: "authoritative", label: "Authoritative" }
  ];

  return (
    <Dialog open={aiModalOpen} onOpenChange={closeAiModal}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden" data-testid="ai-assistant-modal">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-magic text-white"></i>
            </div>
            <div>
              <DialogTitle>AI Content Assistant</DialogTitle>
              <p className="text-sm text-gray-500">Generate compelling content for your website</p>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto space-y-6">
          {/* Content Type Selector */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">What would you like to generate?</Label>
            <div className="grid grid-cols-2 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id as any)}
                  className={`p-3 border-2 rounded-lg text-left transition-colors ${
                    contentType === type.id
                      ? "border-primary bg-primary bg-opacity-10"
                      : "border-gray-300 hover:border-primary hover:bg-primary hover:bg-opacity-5"
                  }`}
                  data-testid={`content-type-${type.id}`}
                >
                  <i className={`${type.icon} ${contentType === type.id ? "text-primary" : "text-gray-400"} mb-2`}></i>
                  <div className="text-sm font-medium text-gray-900">{type.label}</div>
                  <div className="text-xs text-gray-500">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Business Context */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Tell us about your business</Label>
            <Textarea
              value={businessContext}
              onChange={(e) => setBusinessContext(e.target.value)}
              placeholder="e.g., I'm a freelance web developer specializing in React and Node.js. I help startups build modern web applications..."
              rows={3}
              className="w-full"
              data-testid="textarea-business-context"
            />
          </div>

          {/* Tone Selector */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Tone of voice</Label>
            <div className="flex flex-wrap gap-2">
              {tones.map((toneOption) => (
                <button
                  key={toneOption.id}
                  onClick={() => setTone(toneOption.id as any)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    tone === toneOption.id
                      ? "bg-primary text-white"
                      : "border border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                  }`}
                  data-testid={`tone-${toneOption.id}`}
                >
                  {toneOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Content */}
          {(generatedContent.length > 0 || isGeneratingContent) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">
                  Generated {contentTypes.find(t => t.id === contentType)?.label}
                </h3>
                {generatedContent.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isGeneratingContent}
                    className="text-xs text-primary hover:text-primary-dark"
                    data-testid="button-regenerate"
                  >
                    <i className="fas fa-redo mr-1"></i>Regenerate
                  </Button>
                )}
              </div>
              
              {isGeneratingContent ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mr-3"></div>
                  <span className="text-gray-600">Generating content...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedContent.map((content, index) => (
                    <div
                      key={index}
                      className="ai-suggestion"
                      onClick={() => handleUseContent(content)}
                      data-testid={`ai-suggestion-${index}`}
                    >
                      <p className="text-sm text-gray-900">{content}</p>
                      <div className="use-button mt-2">
                        <Button size="sm" variant="ghost" className="text-xs text-primary">
                          Use this {contentType}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between border-t pt-4">
          <Button variant="ghost" onClick={closeAiModal} data-testid="button-cancel">
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!businessContext.trim() || isGeneratingContent}
            className="bg-gradient-to-r from-secondary to-primary text-white hover:opacity-90"
            data-testid="button-generate-content"
          >
            <i className="fas fa-magic mr-2"></i>Generate Content
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
