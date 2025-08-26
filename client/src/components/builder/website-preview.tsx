import { useBuilderStore } from "@/store/builder-store";
import { SectionOverlay } from "./section-overlay";

export function WebsitePreview() {
  const { currentProject, selectedDevice, zoom } = useBuilderStore();

  if (!currentProject) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center" data-testid="no-project">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
        <p className="text-gray-500">Select a template to get started</p>
      </div>
    );
  }

  const getDeviceWidth = () => {
    switch (selectedDevice) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "1200px";
    }
  };

  const sections = currentProject.sections.sort((a, b) => a.order - b.order);

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      style={{ 
        maxWidth: getDeviceWidth(),
        minHeight: "800px",
        transform: `scale(${zoom / 100})`,
        transformOrigin: "top center"
      }}
      data-testid="website-preview"
    >
      {sections.map((section) => (
        <div key={section.id} className="relative group" data-droppable="true" data-section={section.type}>
          {section.type === "header" && (
            <div className="h-20 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center px-8 relative"
                 style={{ 
                   backgroundImage: section.config.backgroundImage ? `url('${section.config.backgroundImage}')` : undefined,
                   backgroundSize: "cover",
                   backgroundPosition: "center",
                   backgroundBlendMode: "overlay"
                 }}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-8">
                  <h1 className="text-2xl font-bold text-white" data-testid={`section-title-${section.id}`}>
                    {section.config.title}
                  </h1>
                  <nav className="hidden md:flex space-x-6">
                    {section.config.navigation?.map((item: string, index: number) => (
                      <a key={index} href="#" className="text-white hover:text-gray-300" data-testid={`nav-item-${index}`}>
                        {item}
                      </a>
                    ))}
                  </nav>
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors" data-testid="header-cta">
                  {section.config.ctaButton}
                </button>
              </div>
            </div>
          )}

          {section.type === "hero" && (
            <div className="py-20 px-8 text-center" 
                 style={{ 
                   background: section.config.backgroundGradient || section.config.backgroundColor || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                 }}>
              <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-white mb-6" data-testid={`hero-title-${section.id}`}>
                  {section.config.title}
                </h1>
                <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto" data-testid={`hero-subtitle-${section.id}`}>
                  {section.config.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {section.config.ctaButtons?.map((buttonText: string, index: number) => (
                    <button 
                      key={index}
                      className={index === 0 
                        ? "px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        : "px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
                      }
                      data-testid={`hero-cta-${index}`}
                    >
                      {buttonText}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section.type === "about" && (
            <div className="py-16 px-8 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6" data-testid={`about-title-${section.id}`}>
                      {section.config.title}
                    </h2>
                    <p className="text-gray-600 mb-6" data-testid={`about-description-${section.id}`}>
                      {section.config.description}
                    </p>
                    {section.config.skills && (
                      <div className="flex flex-wrap gap-3">
                        {section.config.skills.map((skill: string, index: number) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-primary text-white rounded-full text-sm"
                            data-testid={`skill-${index}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <img 
                      src={section.config.image} 
                      alt="About image" 
                      className="rounded-xl shadow-lg w-full"
                      data-testid={`about-image-${section.id}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {section.type === "services" && (
            <div className="py-16 px-8 bg-gray-50">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid={`services-title-${section.id}`}>
                    {section.config.title}
                  </h2>
                  {section.config.subtitle && (
                    <p className="text-gray-600 max-w-2xl mx-auto" data-testid={`services-subtitle-${section.id}`}>
                      {section.config.subtitle}
                    </p>
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {section.config.services?.map((service: any, index: number) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                        <i className={`${service.icon} text-white text-xl`}></i>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3" data-testid={`service-title-${index}`}>
                        {service.title}
                      </h3>
                      <p className="text-gray-600" data-testid={`service-description-${index}`}>
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section.type === "footer" && (
            <div className="py-12 px-8 bg-gray-900 text-white">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4" data-testid={`footer-title-${section.id}`}>
                  {section.config.title}
                </h2>
                <p className="text-gray-300 mb-6" data-testid={`footer-description-${section.id}`}>
                  {section.config.description}
                </p>
                <div className="flex justify-center space-x-6 mb-8">
                  {section.config.socialLinks?.map((platform: string, index: number) => (
                    <a 
                      key={index} 
                      href="#" 
                      className="text-gray-300 hover:text-white text-xl"
                      data-testid={`social-link-${platform}`}
                    >
                      <i className={`fab fa-${platform}`}></i>
                    </a>
                  ))}
                </div>
                <p className="text-gray-400 text-sm" data-testid={`footer-copyright-${section.id}`}>
                  {section.config.copyright}
                </p>
              </div>
            </div>
          )}

          {section.type === "custom" && (
            <div className="py-16 px-8 bg-white">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6" data-testid={`custom-title-${section.id}`}>
                  {section.config.title}
                </h2>
                <p className="text-gray-600" data-testid={`custom-content-${section.id}`}>
                  {section.config.content}
                </p>
              </div>
            </div>
          )}

          <SectionOverlay sectionId={section.id} />
        </div>
      ))}
    </div>
  );
}
