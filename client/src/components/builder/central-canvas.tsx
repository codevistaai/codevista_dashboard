import { useBuilderStore } from "@/store/builder-store";
import { WebsitePreview } from "./website-preview";
import { Button } from "@/components/ui/button";

export function CentralCanvas() {
  const { 
    selectedDevice, 
    setSelectedDevice, 
    zoom, 
    setZoom,
    addSection 
  } = useBuilderStore();

  const zoomIn = () => setZoom(Math.min(zoom + 10, 200));
  const zoomOut = () => setZoom(Math.max(zoom - 10, 50));

  const handleAddSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      type: "custom" as const,
      order: 999,
      config: {
        title: "New Section",
        content: "Add your content here"
      }
    };
    addSection(newSection);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100" data-testid="central-canvas">
      {/* Canvas Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomOut}
              className="p-2 hover:bg-gray-100 rounded-lg"
              data-testid="button-zoom-out"
            >
              <i className="fas fa-search-minus text-gray-600"></i>
            </Button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center" data-testid="text-zoom">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomIn}
              className="p-2 hover:bg-gray-100 rounded-lg"
              data-testid="button-zoom-in"
            >
              <i className="fas fa-search-plus text-gray-600"></i>
            </Button>
          </div>

          {/* Device Preview */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDevice("desktop")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                selectedDevice === "desktop"
                  ? "bg-white shadow-sm text-gray-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              data-testid="device-desktop"
            >
              <i className="fas fa-desktop mr-1"></i>Desktop
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDevice("tablet")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                selectedDevice === "tablet"
                  ? "bg-white shadow-sm text-gray-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              data-testid="device-tablet"
            >
              <i className="fas fa-tablet-alt mr-1"></i>Tablet
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDevice("mobile")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                selectedDevice === "mobile"
                  ? "bg-white shadow-sm text-gray-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              data-testid="device-mobile"
            >
              <i className="fas fa-mobile-alt mr-1"></i>Mobile
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-lg"
            data-testid="button-toggle-grid"
          >
            <i className="fas fa-th text-gray-600"></i>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-lg"
            data-testid="button-toggle-ruler"
          >
            <i className="fas fa-ruler text-gray-600"></i>
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-8" data-testid="canvas-area">
        <div className="flex flex-col items-center">
          <WebsitePreview />

          {/* Add Section Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleAddSection}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              data-testid="button-add-section"
            >
              <i className="fas fa-plus"></i>
              <span>Add Section</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}