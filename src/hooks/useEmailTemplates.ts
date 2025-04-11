
import { useState, useEffect } from 'react';
import { EmailTemplate, mockEmailTemplates } from '../data/mockEmailTemplates';

export const useEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setTemplates(mockEmailTemplates);
        setLoading(false);
      } catch (err) {
        setError('Failed to load email templates');
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const renderTemplate = (template: EmailTemplate, candidateName: string, position: string): { subject: string, body: string } => {
    const subject = template.subject
      .replace('{Tên}', candidateName)
      .replace('{Vị trí ứng tuyển}', position);
      
    const body = template.body
      .replace(/{Tên}/g, candidateName)
      .replace(/{Vị trí ứng tuyển}/g, position);
      
    return { subject, body };
  };

  const createTemplate = async (templateData: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newId = templates.length > 0 
      ? Math.max(...templates.map(t => t.id)) + 1 
      : 1;
      
    const newTemplate: EmailTemplate = {
      id: newId,
      ...templateData
    };
    
    setTemplates(prevTemplates => [...prevTemplates, newTemplate]);
    return newTemplate;
  };

  const updateTemplate = async (id: number, templateData: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate | undefined> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedTemplate = { id, ...templateData };
    
    setTemplates(prevTemplates => 
      prevTemplates.map(template => 
        template.id === id ? updatedTemplate : template
      )
    );
    
    return updatedTemplate;
  };

  const deleteTemplate = async (id: number): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTemplates(prevTemplates => 
      prevTemplates.filter(template => template.id !== id)
    );
    
    return true;
  };

  return {
    templates,
    loading,
    error,
    renderTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
};
