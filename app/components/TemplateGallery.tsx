'use client';

import { useState } from 'react';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  preview: string;
  tags: string[];
}

const templates: Template[] = [
  {
    id: 'landing-1',
    name: 'Modern Landing Page',
    category: 'Landing Page',
    description: 'Clean and modern landing page with hero section and features',
    thumbnail: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Landing+1',
    preview: 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Landing+Preview',
    tags: ['modern', 'hero', 'features']
  },
  {
    id: 'landing-2',
    name: 'E-commerce Landing',
    category: 'Landing Page',
    description: 'Product-focused landing page with pricing and testimonials',
    thumbnail: 'https://via.placeholder.com/300x200/10b981/ffffff?text=E-commerce',
    preview: 'https://via.placeholder.com/800x600/10b981/ffffff?text=E-commerce+Preview',
    tags: ['ecommerce', 'pricing', 'testimonials']
  },
  {
    id: 'blog-1',
    name: 'Blog Template',
    category: 'Blog',
    description: 'Clean blog layout with sidebar and featured posts',
    thumbnail: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Blog+1',
    preview: 'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Blog+Preview',
    tags: ['blog', 'sidebar', 'featured']
  },
  {
    id: 'portfolio-1',
    name: 'Portfolio Grid',
    category: 'Portfolio',
    description: 'Grid-based portfolio with project showcases',
    thumbnail: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Portfolio',
    preview: 'https://via.placeholder.com/800x600/f59e0b/ffffff?text=Portfolio+Preview',
    tags: ['portfolio', 'grid', 'projects']
  },
  {
    id: 'business-1',
    name: 'Business Website',
    category: 'Business',
    description: 'Professional business website with services and contact',
    thumbnail: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Business',
    preview: 'https://via.placeholder.com/800x600/ef4444/ffffff?text=Business+Preview',
    tags: ['business', 'services', 'contact']
  },
  {
    id: 'restaurant-1',
    name: 'Restaurant Menu',
    category: 'Restaurant',
    description: 'Elegant restaurant website with menu and reservations',
    thumbnail: 'https://via.placeholder.com/300x200/ec4899/ffffff?text=Restaurant',
    preview: 'https://via.placeholder.com/800x600/ec4899/ffffff?text=Restaurant+Preview',
    tags: ['restaurant', 'menu', 'reservations']
  }
];

const categories = ['All', 'Landing Page', 'Blog', 'Portfolio', 'Business', 'Restaurant'];

interface TemplateGalleryProps {
  onTemplateSelect?: (template: Template) => void;
}

export default function TemplateGallery({ onTemplateSelect }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  return (
    <div className="template-gallery">
      {/* Header */}
      <div className="template-gallery-header">
        <h2 className="template-gallery-title">Choose Your Template</h2>
        <p className="template-gallery-subtitle">
          Select from our collection of professionally designed templates
        </p>
      </div>

      {/* Search and Filters */}
      <div className="template-gallery-filters">
        <div className="template-search">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="template-search-input"
          />
          <svg className="template-search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path strokeWidth="2" d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        <div className="template-categories">
          {categories.map(category => (
            <button
              key={category}
              className={`template-category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="template-grid">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="template-card"
            onClick={() => handleTemplateClick(template)}
          >
            <div className="template-thumbnail">
              <img src={template.thumbnail} alt={template.name} />
              <div className="template-overlay">
                <button className="template-preview-btn">Preview</button>
                <button className="template-use-btn">Use Template</button>
              </div>
            </div>
            <div className="template-info">
              <h3 className="template-name">{template.name}</h3>
              <p className="template-description">{template.description}</p>
              <div className="template-tags">
                {template.tags.map(tag => (
                  <span key={tag} className="template-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="template-modal-overlay" onClick={() => setSelectedTemplate(null)}>
          <div className="template-modal" onClick={(e) => e.stopPropagation()}>
            <div className="template-modal-header">
              <h3>{selectedTemplate.name}</h3>
              <button 
                className="template-modal-close"
                onClick={() => setSelectedTemplate(null)}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="template-modal-content">
              <img src={selectedTemplate.preview} alt={selectedTemplate.name} />
              <div className="template-modal-info">
                <p>{selectedTemplate.description}</p>
                <div className="template-modal-tags">
                  {selectedTemplate.tags.map(tag => (
                    <span key={tag} className="template-tag">{tag}</span>
                  ))}
                </div>
                <button 
                  className="template-modal-use-btn"
                  onClick={() => {
                    if (onTemplateSelect) {
                      onTemplateSelect(selectedTemplate);
                    }
                    setSelectedTemplate(null);
                  }}
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .template-gallery {
          padding: 2rem;
        }

        .template-gallery-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .template-gallery-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .template-gallery-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          margin: 0;
        }

        .template-gallery-filters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .template-search {
          position: relative;
          flex: 1;
          max-width: 300px;
        }

        .template-search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          outline: none;
        }

        .template-search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .template-search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }

        .template-categories {
          display: flex;
          gap: 0.5rem;
        }

        .template-category-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          color: #64748b;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .template-category-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .template-category-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .template-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .template-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .template-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .template-thumbnail {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .template-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .template-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .template-card:hover .template-overlay {
          opacity: 1;
        }

        .template-preview-btn,
        .template-use-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .template-preview-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .template-use-btn {
          background: #3b82f6;
          color: white;
        }

        .template-preview-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .template-use-btn:hover {
          background: #2563eb;
        }

        .template-info {
          padding: 1.5rem;
        }

        .template-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .template-description {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0 0 1rem 0;
          line-height: 1.5;
        }

        .template-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .template-tag {
          background: #f1f5f9;
          color: #64748b;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .template-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .template-modal {
          background: white;
          border-radius: 12px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
        }

        .template-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .template-modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }

        .template-modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .template-modal-close:hover {
          background: #f1f5f9;
        }

        .template-modal-content {
          display: flex;
          max-height: calc(90vh - 100px);
        }

        .template-modal-content img {
          flex: 1;
          object-fit: cover;
          max-height: 600px;
        }

        .template-modal-info {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .template-modal-info p {
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 1rem 0;
        }

        .template-modal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .template-modal-use-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .template-modal-use-btn:hover {
          background: #2563eb;
        }

        @media (max-width: 768px) {
          .template-gallery-filters {
            flex-direction: column;
            align-items: stretch;
          }

          .template-search {
            max-width: none;
          }

          .template-categories {
            justify-content: center;
            flex-wrap: wrap;
          }

          .template-modal-content {
            flex-direction: column;
          }

          .template-modal-content img {
            max-height: 300px;
          }
        }
      `}</style>
    </div>
  );
}
