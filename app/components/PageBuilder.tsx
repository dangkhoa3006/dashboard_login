'use client';

import { useState } from 'react';
import CKEditorWrapper from './CKEditorWrapper';
import TemplateGallery from './TemplateGallery';

interface Page {
    id: string;
    title: string;
    content: string;
    template: string;
    status: 'draft' | 'published';
    createdAt: Date;
    updatedAt: Date;
}

interface Template {
    id: string;
    name: string;
    category: string;
    description: string;
    thumbnail: string;
    preview: string;
    tags: string[];
}

export default function PageBuilder() {
    const [currentPage, setCurrentPage] = useState<Page | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [showTemplateGallery, setShowTemplateGallery] = useState(false);
    const [editorContent, setEditorContent] = useState('');
    const [pageTitle, setPageTitle] = useState('');
    const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'settings'>('editor');

    const handleTemplateSelect = (template: Template) => {
        setSelectedTemplate(template);
        setShowTemplateGallery(false);

        // Load template content
        const templateContent = getTemplateContent(template.id);
        setEditorContent(templateContent);
        setPageTitle(template.name);
    };

    const getTemplateContent = (templateId: string): string => {
        const templates = {
            'landing-1': `
        <h1>Welcome to Our Platform</h1>
        <p>This is a modern landing page template with a clean design and professional layout.</p>
        <h2>Key Features</h2>
        <ul>
          <li>Responsive design</li>
          <li>Modern UI/UX</li>
          <li>Fast loading</li>
          <li>SEO optimized</li>
        </ul>
        <h2>About Us</h2>
        <p>We are dedicated to providing the best solutions for our customers. Our team of experts works tirelessly to ensure your success.</p>
      `,
            'blog-1': `
        <h1>Blog Post Title</h1>
        <p><em>Published on ${new Date().toLocaleDateString()}</em></p>
        <p>This is the introduction paragraph of your blog post. It should capture the reader's attention and provide a brief overview of what they can expect to learn.</p>
        <h2>Main Content Section</h2>
        <p>Here you can add your main content with detailed information, examples, and insights that provide value to your readers.</p>
        <blockquote>
          <p>This is a blockquote that highlights important information or quotes from experts in your field.</p>
        </blockquote>
        <h2>Conclusion</h2>
        <p>Wrap up your blog post with a strong conclusion that reinforces your main points and encourages further engagement.</p>
      `,
            'portfolio-1': `
        <h1>Portfolio Showcase</h1>
        <p>Welcome to my portfolio. Here you can see examples of my work and projects I've completed.</p>
        <h2>Featured Projects</h2>
        <h3>Project 1: Web Application</h3>
        <p>Description of the first project including technologies used and challenges overcome.</p>
        <h3>Project 2: Mobile App</h3>
        <p>Description of the second project with details about the development process and outcomes.</p>
        <h3>Project 3: E-commerce Platform</h3>
        <p>Description of the third project highlighting the business impact and technical achievements.</p>
      `
        };

        return templates[templateId as keyof typeof templates] || '<h1>New Page</h1><p>Start creating your content...</p>';
    };

    const handleSave = () => {
        if (!pageTitle.trim()) {
            alert('Please enter a page title');
            return;
        }

        const page: Page = {
            id: currentPage?.id || Date.now().toString(),
            title: pageTitle,
            content: editorContent,
            template: selectedTemplate?.id || 'custom',
            status: 'draft',
            createdAt: currentPage?.createdAt || new Date(),
            updatedAt: new Date()
        };

        setCurrentPage(page);

        // Save to localStorage for demo
        const pages = JSON.parse(localStorage.getItem('cms_pages') || '[]');
        const existingIndex = pages.findIndex((p: Page) => p.id === page.id);

        if (existingIndex >= 0) {
            pages[existingIndex] = page;
        } else {
            pages.push(page);
        }

        localStorage.setItem('cms_pages', JSON.stringify(pages));
        alert('Page saved successfully!');
    };

    const handlePublish = () => {
        if (!currentPage) {
            alert('Please save the page first');
            return;
        }

        const updatedPage = { ...currentPage, status: 'published' as const };
        setCurrentPage(updatedPage);

        // Update in localStorage
        const pages = JSON.parse(localStorage.getItem('cms_pages') || '[]');
        const pageIndex = pages.findIndex((p: Page) => p.id === currentPage.id);
        if (pageIndex >= 0) {
            pages[pageIndex] = updatedPage;
            localStorage.setItem('cms_pages', JSON.stringify(pages));
        }

        alert('Page published successfully!');
    };

    return (
        <div className="page-builder">
            {/* Header */}
            <div className="page-builder-header">
                <div className="page-builder-title">
                    <h2>Page Builder</h2>
                    <p>Create and edit your website pages with our powerful editor</p>
                </div>

                <div className="page-builder-actions">
                    <button
                        className="page-builder-btn secondary"
                        onClick={() => setShowTemplateGallery(true)}
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Choose Template
                    </button>

                    <button
                        className="page-builder-btn secondary"
                        onClick={handleSave}
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Save Draft
                    </button>

                    <button
                        className="page-builder-btn primary"
                        onClick={handlePublish}
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Publish
                    </button>
                </div>
            </div>

            {/* Template Gallery Modal */}
            {showTemplateGallery && (
                <div className="template-gallery-modal">
                    <div className="template-gallery-modal-content">
                        <div className="template-gallery-modal-header">
                            <h3>Choose a Template</h3>
                            <button
                                className="template-gallery-modal-close"
                                onClick={() => setShowTemplateGallery(false)}
                            >
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <TemplateGallery onTemplateSelect={handleTemplateSelect} />
                    </div>
                </div>
            )}

            {/* Selected Template Info */}
            {selectedTemplate && (
                <div className="selected-template-info">
                    <div className="selected-template-thumbnail">
                        <img src={selectedTemplate.thumbnail} alt={selectedTemplate.name} />
                    </div>
                    <div className="selected-template-details">
                        <h4>{selectedTemplate.name}</h4>
                        <p>{selectedTemplate.description}</p>
                        <div className="selected-template-tags">
                            {selectedTemplate.tags.map(tag => (
                                <span key={tag} className="template-tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                    <button
                        className="change-template-btn"
                        onClick={() => setShowTemplateGallery(true)}
                    >
                        Change Template
                    </button>
                </div>
            )}

            {/* Page Title Input */}
            <div className="page-title-section">
                <input
                    type="text"
                    placeholder="Enter page title..."
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    className="page-title-input"
                />
            </div>

            {/* Tabs */}
            <div className="page-builder-tabs">
                <button
                    className={`page-builder-tab ${activeTab === 'editor' ? 'active' : ''}`}
                    onClick={() => setActiveTab('editor')}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editor
                </button>

                <button
                    className={`page-builder-tab ${activeTab === 'preview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preview')}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                </button>

                <button
                    className={`page-builder-tab ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                </button>
            </div>

            {/* Tab Content */}
            <div className="page-builder-content">
                {activeTab === 'editor' && (
                    <div className="editor-tab">
                        <CKEditorWrapper
                            initialData={editorContent}
                            onChange={setEditorContent}
                            placeholder="Start creating your content..."
                            height="500px"
                        />
                    </div>
                )}

                {activeTab === 'preview' && (
                    <div className="preview-tab">
                        <div className="preview-container">
                            <div
                                className="preview-content"
                                dangerouslySetInnerHTML={{ __html: editorContent }}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="settings-tab">
                        <div className="settings-section">
                            <h3>Page Settings</h3>
                            <div className="setting-item">
                                <label>Page Title</label>
                                <input
                                    type="text"
                                    value={pageTitle}
                                    onChange={(e) => setPageTitle(e.target.value)}
                                    placeholder="Enter page title"
                                />
                            </div>

                            <div className="setting-item">
                                <label>Meta Description</label>
                                <textarea
                                    placeholder="Enter meta description for SEO"
                                    rows={3}
                                />
                            </div>

                            <div className="setting-item">
                                <label>Keywords</label>
                                <input
                                    type="text"
                                    placeholder="Enter keywords separated by commas"
                                />
                            </div>

                            <div className="setting-item">
                                <label>Page Status</label>
                                <select>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .page-builder {
          padding: 2rem;
          background: #f8fafc;
          min-height: calc(100vh - 72px);
        }

        .page-builder-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 2rem;
        }

        .page-builder-title h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .page-builder-title p {
          color: #64748b;
          margin: 0;
        }

        .page-builder-actions {
          display: flex;
          gap: 1rem;
        }

        .page-builder-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .page-builder-btn.primary {
          background: #3b82f6;
          color: white;
        }

        .page-builder-btn.primary:hover {
          background: #2563eb;
        }

        .page-builder-btn.secondary {
          background: white;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .page-builder-btn.secondary:hover {
          background: #f8fafc;
          color: #3b82f6;
          border-color: #3b82f6;
        }

        .template-gallery-modal {
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

        .template-gallery-modal-content {
          background: white;
          border-radius: 12px;
          max-width: 1200px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
        }

        .template-gallery-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .template-gallery-modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }

        .template-gallery-modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .template-gallery-modal-close:hover {
          background: #f1f5f9;
        }

        .selected-template-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .selected-template-thumbnail {
          width: 80px;
          height: 60px;
          border-radius: 6px;
          overflow: hidden;
        }

        .selected-template-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .selected-template-details {
          flex: 1;
        }

        .selected-template-details h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .selected-template-details p {
          margin: 0 0 0.5rem 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .selected-template-tags {
          display: flex;
          gap: 0.5rem;
        }

        .template-tag {
          background: #f1f5f9;
          color: #64748b;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .change-template-btn {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .change-template-btn:hover {
          background: #e2e8f0;
          color: #3b82f6;
        }

        .page-title-section {
          margin-bottom: 1.5rem;
        }

        .page-title-input {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          outline: none;
        }

        .page-title-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .page-builder-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .page-builder-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .page-builder-tab:hover {
          background: #f8fafc;
          color: #3b82f6;
        }

        .page-builder-tab.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .page-builder-content {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .editor-tab,
        .preview-tab,
        .settings-tab {
          padding: 2rem;
        }

        .preview-container {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 2rem;
          min-height: 500px;
        }

        .preview-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1e293b;
        }

        .preview-content h1,
        .preview-content h2,
        .preview-content h3 {
          margin-top: 0;
          margin-bottom: 1rem;
        }

        .preview-content p {
          margin-bottom: 1rem;
        }

        .settings-section h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }

        .setting-item {
          margin-bottom: 1.5rem;
        }

        .setting-item label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        .setting-item input,
        .setting-item textarea,
        .setting-item select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.9rem;
          outline: none;
        }

        .setting-item input:focus,
        .setting-item textarea:focus,
        .setting-item select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        @media (max-width: 768px) {
          .page-builder-header {
            flex-direction: column;
            align-items: stretch;
          }

          .page-builder-actions {
            justify-content: center;
            flex-wrap: wrap;
          }

          .selected-template-info {
            flex-direction: column;
            text-align: center;
          }

          .page-builder-tabs {
            flex-wrap: wrap;
          }
        }
      `}</style>
        </div>
    );
}
