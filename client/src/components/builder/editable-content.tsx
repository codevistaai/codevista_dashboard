
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Edit3 } from "lucide-react";
import { useBuilderStore } from "@/store/builder-store";

interface EditableContentProps {
  content: string;
  onSave: (newContent: string) => void;
  type?: "text" | "heading" | "paragraph";
  className?: string;
}

export function EditableContent({ 
  content, 
  onSave, 
  type = "text", 
  className = "" 
}: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { selectedSectionId } = useBuilderStore();

  useEffect(() => {
    setEditContent(content);
  }, [content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full bg-white border-2 border-primary rounded p-2 resize-none ${className}`}
          rows={type === 'heading' ? 1 : 3}
        />
        <div className="flex space-x-2 mt-2">
          <Button size="sm" onClick={handleSave}>
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group cursor-pointer" onClick={() => setIsEditing(true)}>
      {type === 'heading' ? (
        <h1 className={`${className} group-hover:bg-blue-50 rounded p-1 transition-colors`}>
          {content}
        </h1>
      ) : type === 'paragraph' ? (
        <p className={`${className} group-hover:bg-blue-50 rounded p-1 transition-colors`}>
          {content}
        </p>
      ) : (
        <span className={`${className} group-hover:bg-blue-50 rounded p-1 transition-colors`}>
          {content}
        </span>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm border"
      >
        <Edit3 className="h-3 w-3" />
      </Button>
    </div>
  );
}
