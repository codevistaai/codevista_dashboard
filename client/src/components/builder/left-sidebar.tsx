import { useBuilderStore } from "@/store/builder-store";
import { TemplateLibrary } from "./template-library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function LeftSidebar() {
  const { leftSidebarTab, setLeftSidebarTab } = useBuilderStore();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col h-full" data-testid="left-sidebar">
      {/* Sidebar Tabs */}
      <div className="flex border-b border-gray-200">
        <Button
          variant="ghost"
          onClick={() => setLeftSidebarTab("templates")}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-none ${
            leftSidebarTab === "templates"
              ? "text-primary border-b-2 border-primary bg-blue-50"
              : "text-gray-500 hover:text-gray-700"
          }`}
          data-testid="tab-templates"
        >
          <i className="fas fa-th-large mr-2"></i>Templates
        </Button>
        <Button
          variant="ghost"
          onClick={() => setLeftSidebarTab("components")}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-none ${
            leftSidebarTab === "components"
              ? "text-primary border-b-2 border-primary bg-blue-50"
              : "text-gray-500 hover:text-gray-700"
          }`}
          data-testid="tab-components"
        >
          <i className="fas fa-puzzle-piece mr-2"></i>Components
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          <Input
            type="text"
            placeholder={`Search ${leftSidebarTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            data-testid="input-search"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {leftSidebarTab === "templates" ? (
          <TemplateLibrary searchQuery={searchQuery} />
        ) : (
          <div className="space-y-4" data-testid="components-section">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Headers</h3>
              <div className="space-y-2">
                <div className="component-item" data-testid="component-header-1">
                  <h4 className="text-xs font-medium text-gray-900">Navigation Header</h4>
                  <p className="text-xs text-gray-500">Standard navigation with logo</p>
                </div>
                <div className="component-item" data-testid="component-header-2">
                  <h4 className="text-xs font-medium text-gray-900">Hero Header</h4>
                  <p className="text-xs text-gray-500">Large header with background</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Content Blocks</h3>
              <div className="space-y-2">
                <div className="component-item" data-testid="component-text-block">
                  <h4 className="text-xs font-medium text-gray-900">Text Block</h4>
                  <p className="text-xs text-gray-500">Rich text content area</p>
                </div>
                <div className="component-item" data-testid="component-image-block">
                  <h4 className="text-xs font-medium text-gray-900">Image Block</h4>
                  <p className="text-xs text-gray-500">Responsive image with caption</p>
                </div>
                <div className="component-item" data-testid="component-cta-block">
                  <h4 className="text-xs font-medium text-gray-900">Call-to-Action</h4>
                  <p className="text-xs text-gray-500">Button with background</p>
                </div>
                <div className="component-item" data-testid="component-testimonials">
                  <h4 className="text-xs font-medium text-gray-900">Testimonials</h4>
                  <p className="text-xs text-gray-500">Customer reviews carousel</p>
                </div>
                <div className="component-item" data-testid="component-pricing">
                  <h4 className="text-xs font-medium text-gray-900">Pricing Table</h4>
                  <p className="text-xs text-gray-500">Service pricing comparison</p>
                </div>
                <div className="component-item" data-testid="component-faq">
                  <h4 className="text-xs font-medium text-gray-900">FAQ Section</h4>
                  <p className="text-xs text-gray-500">Frequently asked questions</p>
                </div>
                <div className="component-item" data-testid="component-team">
                  <h4 className="text-xs font-medium text-gray-900">Team Grid</h4>
                  <p className="text-xs text-gray-500">Team member profiles</p>
                </div>
                <div className="component-item" data-testid="component-gallery">
                  <h4 className="text-xs font-medium text-gray-900">Image Gallery</h4>
                  <p className="text-xs text-gray-500">Photo grid with lightbox</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Layout</h3>
              <div className="space-y-2">
                <div className="component-item" data-testid="component-two-column">
                  <h4 className="text-xs font-medium text-gray-900">Two Column</h4>
                  <p className="text-xs text-gray-500">Side-by-side layout</p>
                </div>
                <div className="component-item" data-testid="component-three-column">
                  <h4 className="text-xs font-medium text-gray-900">Three Column</h4>
                  <p className="text-xs text-gray-500">Three equal columns</p>
                </div>
                <div className="component-item" data-testid="component-four-column">
                  <h4 className="text-xs font-medium text-gray-900">Four Column</h4>
                  <p className="text-xs text-gray-500">Four equal columns grid</p>
                </div>
                <div className="component-item" data-testid="component-asymmetric">
                  <h4 className="text-xs font-medium text-gray-900">Asymmetric Layout</h4>
                  <p className="text-xs text-gray-500">2/3 and 1/3 split</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Interactive</h3>
              <div className="space-y-2">
                <div className="component-item" data-testid="component-contact-form">
                  <h4 className="text-xs font-medium text-gray-900">Contact Form</h4>
                  <p className="text-xs text-gray-500">Get in touch form</p>
                </div>
                <div className="component-item" data-testid="component-newsletter">
                  <h4 className="text-xs font-medium text-gray-900">Newsletter Signup</h4>
                  <p className="text-xs text-gray-500">Email subscription form</p>
                </div>
                <div className="component-item" data-testid="component-search-bar">
                  <h4 className="text-xs font-medium text-gray-900">Search Bar</h4>
                  <p className="text-xs text-gray-500">Site search functionality</p>
                </div>
                <div className="component-item" data-testid="component-social-feed">
                  <h4 className="text-xs font-medium text-gray-900">Social Media Feed</h4>
                  <p className="text-xs text-gray-500">Instagram/Twitter feed</p>
                </div>
                <div className="component-item" data-testid="component-video-player">
                  <h4 className="text-xs font-medium text-gray-900">Video Player</h4>
                  <p className="text-xs text-gray-500">Embedded video content</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">E-commerce</h3>
              <div className="space-y-2">
                <div className="component-item" data-testid="component-product-grid">
                  <h4 className="text-xs font-medium text-gray-900">Product Grid</h4>
                  <p className="text-xs text-gray-500">Product showcase layout</p>
                </div>
                <div className="component-item" data-testid="component-shopping-cart">
                  <h4 className="text-xs font-medium text-gray-900">Shopping Cart</h4>
                  <p className="text-xs text-gray-500">Cart summary widget</p>
                </div>
                <div className="component-item" data-testid="component-product-filter">
                  <h4 className="text-xs font-medium text-gray-900">Product Filter</h4>
                  <p className="text-xs text-gray-500">Filter and sort products</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
