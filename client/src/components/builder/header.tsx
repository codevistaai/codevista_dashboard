import { useBuilderStore } from "@/store/builder-store";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Plus, Home } from "lucide-react";

export function Header() {
  const { user } = useAuth();
  const { 
    currentProject,
    currentPage,
    pages,
    setCurrentPage,
    addPage,
    openAiModal, 
    openExportModal,
    isGeneratingContent,
    isExporting 
  } = useBuilderStore();

  const handleAddPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      name: `Page ${pages.length + 1}`,
      slug: `page-${pages.length + 1}`,
      sections: [],
      isHomePage: false
    };
    addPage(newPage);
  };

  const handlePageChange = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setCurrentPage(page);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 relative z-50 fixed top-0 left-0 right-0" data-testid="header">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <i className="fas fa-code text-white text-sm"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Code Vista AI</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
          <span>The Canva for Websites</span>
          <div className="w-1 h-1 bg-gray-400 rounded-full mx-2"></div>
          <span data-testid="project-name">{currentProject?.name || "New Project"}</span>
          
          {/* Page Management */}
          {pages.length > 0 && (
            <div className="flex items-center space-x-2">
              <Select value={currentPage?.id || ""} onValueChange={handlePageChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      <div className="flex items-center space-x-2">
                        {page.isHomePage && <Home className="h-3 w-3" />}
                        <span>{page.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={handleAddPage}>
                <Plus className="h-3 w-3 mr-1" />
                Page
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-3">
        {/* AI Assistant */}
        <Button
          onClick={openAiModal}
          disabled={isGeneratingContent}
          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-secondary to-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          data-testid="button-ai-assistant"
        >
          <i className="fas fa-magic text-sm"></i>
          <span className="hidden md:inline">
            {isGeneratingContent ? "Generating..." : "AI Assistant"}
          </span>
        </Button>

        {/* Preview */}
        <Button
          variant="outline"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          data-testid="button-preview"
          onClick={() => {
            // Scroll to top of canvas for preview
            const canvas = document.querySelector('[data-testid="central-canvas"]');
            if (canvas) {
              canvas.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <i className="fas fa-eye mr-2"></i>Preview
        </Button>

        {/* Export */}
        <Button
          onClick={openExportModal}
          disabled={isExporting}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          data-testid="button-export"
        >
          <i className="fas fa-download mr-2"></i>
          {isExporting ? "Exporting..." : "Export"}
        </Button>
        
        {/* User Profile */}
        <div className="flex items-center space-x-2 ml-2 lg:ml-4 lg:pl-4 lg:border-l border-gray-200">
          <Avatar className="w-8 h-8" data-testid="user-avatar">
            <AvatarImage src={(user as any)?.profileImageUrl || undefined} alt="User avatar" />
            <AvatarFallback>
              {(user as any)?.firstName?.[0] || (user as any)?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline text-sm font-medium text-gray-700" data-testid="text-username">
            {(user as any)?.firstName || (user as any)?.email || 'User'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/api/logout'}
            className="hidden lg:flex items-center space-x-1 text-gray-500 hover:text-gray-700"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
