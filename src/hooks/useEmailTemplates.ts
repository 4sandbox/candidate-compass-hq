
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

  return {
    templates,
    loading,
    error,
    renderTemplate
  };
};
