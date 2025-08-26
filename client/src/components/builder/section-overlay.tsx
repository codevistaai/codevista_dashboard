import { useBuilderStore } from "@/store/builder-store";
import { Button } from "@/components/ui/button";

interface SectionOverlayProps {
  sectionId: string;
}

export function SectionOverlay({ sectionId }: SectionOverlayProps) {
  const { 
    setSelectedSection, 
    duplicateSection, 
    removeSection, 
    openAiModal 
  } = useBuilderStore();

  const handleEdit = () => {
    setSelectedSection(sectionId);
  };

  const handleDuplicate = () => {
    duplicateSection(sectionId);
  };

  const handleDelete = () => {
    removeSection(sectionId);
  };

  const handleAiGenerate = () => {
    setSelectedSection(sectionId);
    openAiModal();
  };

  return (
    <div className="section-overlay">
      <div className="bg-white rounded-lg shadow-lg p-2 flex space-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleAiGenerate}
          className="p-2 hover:bg-gray-100 rounded"
          data-testid={`button-ai-generate-${sectionId}`}
        >
          <i className="fas fa-magic text-secondary"></i>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          className="p-2 hover:bg-gray-100 rounded"
          data-testid={`button-edit-${sectionId}`}
        >
          <i className="fas fa-edit text-gray-600"></i>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDuplicate}
          className="p-2 hover:bg-gray-100 rounded"
          data-testid={`button-duplicate-${sectionId}`}
        >
          <i className="fas fa-copy text-gray-600"></i>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          className="p-2 hover:bg-gray-100 rounded text-red-600"
          data-testid={`button-delete-${sectionId}`}
        >
          <i className="fas fa-trash"></i>
        </Button>
      </div>
    </div>
  );
}
