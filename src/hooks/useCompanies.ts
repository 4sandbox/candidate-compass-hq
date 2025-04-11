
import { useState, useEffect } from 'react';
import { Company, mockCompanies } from '../data/mockCompanies';

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCompanies(mockCompanies);
        setLoading(false);
      } catch (err) {
        setError('Failed to load companies');
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const addCompany = async (company: Omit<Company, 'id' | 'createdDate'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCompany: Company = {
        ...company,
        id: Math.max(...companies.map(c => c.id), 0) + 1,
        createdDate: new Date()
      };
      
      setCompanies(prev => [...prev, newCompany]);
      return newCompany;
    } catch (err) {
      setError('Failed to add company');
      throw new Error('Failed to add company');
    }
  };

  const updateCompany = async (id: number, updates: Partial<Company>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCompanies(prev => 
        prev.map(company => 
          company.id === id ? { ...company, ...updates } : company
        )
      );
      
      return companies.find(company => company.id === id);
    } catch (err) {
      setError('Failed to update company');
      throw new Error('Failed to update company');
    }
  };

  const deleteCompany = async (id: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCompanies(prev => prev.filter(company => company.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete company');
      throw new Error('Failed to delete company');
    }
  };

  return {
    companies,
    loading,
    error,
    addCompany,
    updateCompany,
    deleteCompany
  };
};
