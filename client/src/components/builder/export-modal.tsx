import { useState } from "react";
import { useBuilderStore } from "@/store/builder-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { ExportFormat } from "@/types/builder";

export function ExportModal() {
  const { 
    exportModalOpen, 
    closeExportModal, 
    currentProject, 
    isExporting, 
    setExporting 
  } = useBuilderStore();

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("static");
  const [exportOptions, setExportOptions] = useState({
    includeImages: true,
    minifyCode: true,
    includeDocumentation: false
  });

  const exportMutation = useMutation({
    mutationFn: async ({ projectId, format }: { projectId: string; format: ExportFormat }) => {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, format })
      });
      if (!response.ok) throw new Error("Failed to export project");
      return response.json();
    },
    onMutate: () => {
      setExporting(true);
    },
    onSuccess: (data) => {
      setExporting(false);
      // Open download URL in new tab
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
      closeExportModal();
    },
    onError: (error) => {
      console.error("Export error:", error);
      setExporting(false);
    }
  });

  const handleExport = () => {
    if (!currentProject) return;
    
    exportMutation.mutate({
      projectId: currentProject.id,
      format: selectedFormat
    });
  };

  const exportFormats = [
    {
      id: "static" as ExportFormat,
      title: "Static HTML/CSS",
      description: "Perfect for hosting on Netlify, Vercel, or GitHub Pages",
      recommended: true,
      isPro: false
    },
    {
      id: "wordpress" as ExportFormat,
      title: "WordPress Theme",
      description: "Complete WordPress theme package",
      recommended: false,
      isPro: false
    },
    {
      id: "react" as ExportFormat,
      title: "React/Next.js",
      description: "Modern React application",
      recommended: false,
      isPro: true
    }
  ];

  return (
    <Dialog open={exportModalOpen} onOpenChange={closeExportModal}>
      <DialogContent className="max-w-lg" data-testid="export-modal">
        <DialogHeader>
          <DialogTitle>Export Your Website</DialogTitle>
          <p className="text-sm text-gray-500">Choose how you want to export your website</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format Selection */}
          <div className="space-y-4">
            {exportFormats.map((format) => (
              <div
                key={format.id}
                className={`export-option ${selectedFormat === format.id ? "selected" : ""}`}
                onClick={() => setSelectedFormat(format.id)}
                data-testid={`export-format-${format.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{format.title}</h3>
                      {format.recommended && (
                        <span className="inline-block px-2 py-1 bg-primary text-white text-xs rounded-full">
                          Recommended
                        </span>
                      )}
                      {format.isPro && (
                        <span className="inline-block px-2 py-1 bg-warning text-white text-xs rounded-full">
                          Pro
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{format.description}</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="exportType"
                      value={format.id}
                      checked={selectedFormat === format.id}
                      onChange={() => setSelectedFormat(format.id)}
                      className="text-primary focus:ring-primary"
                      data-testid={`radio-${format.id}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Export Options */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Export Options</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeImages"
                  checked={exportOptions.includeImages}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeImages: !!checked }))
                  }
                  data-testid="checkbox-include-images"
                />
                <Label htmlFor="includeImages" className="text-sm text-gray-700">
                  Include all images
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="minifyCode"
                  checked={exportOptions.minifyCode}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, minifyCode: !!checked }))
                  }
                  data-testid="checkbox-minify-code"
                />
                <Label htmlFor="minifyCode" className="text-sm text-gray-700">
                  Minify CSS/JS
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeDocumentation"
                  checked={exportOptions.includeDocumentation}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeDocumentation: !!checked }))
                  }
                  data-testid="checkbox-include-docs"
                />
                <Label htmlFor="includeDocumentation" className="text-sm text-gray-700">
                  Include documentation
                </Label>
              </div>
            </div>
          </div>

          {/* Format-specific info */}
          {selectedFormat === "static" && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Static HTML Export</p>
                  <p>Your website will be exported as optimized HTML, CSS, and JavaScript files ready for hosting on any static hosting platform.</p>
                </div>
              </div>
            </div>
          )}

          {selectedFormat === "wordpress" && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <i className="fas fa-info-circle text-purple-500 mt-0.5"></i>
                <div className="text-sm text-purple-700">
                  <p className="font-medium mb-1">WordPress Theme</p>
                  <p>Your design will be converted to a complete WordPress theme with all necessary template files and functions.</p>
                </div>
              </div>
            </div>
          )}

          {selectedFormat === "react" && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <i className="fas fa-crown text-orange-500 mt-0.5"></i>
                <div className="text-sm text-orange-700">
                  <p className="font-medium mb-1">React/Next.js Export</p>
                  <p>Available with Pro plan. Your website will be exported as a modern React application with Next.js framework.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between border-t pt-4">
          <Button 
            variant="ghost" 
            onClick={closeExportModal}
            disabled={isExporting}
            data-testid="button-cancel-export"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={!currentProject || isExporting || (selectedFormat === "react")}
            className="bg-primary text-white hover:bg-primary-dark"
            data-testid="button-download-export"
          >
            <i className="fas fa-download mr-2"></i>
            {isExporting ? "Preparing..." : "Download ZIP"}
          </Button>
        </div>

        {/* Loading Overlay */}
        {isExporting && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mb-4 mx-auto"></div>
              <p className="text-gray-700 font-medium">Preparing your export...</p>
              <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
