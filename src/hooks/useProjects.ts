
import { useState, useEffect } from 'react';
import { Project, mockProjects } from '../data/mockProjects';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProjects(mockProjects);
        setLoading(false);
      } catch (err) {
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const addProject = async (project: Omit<Project, 'id' | 'candidateCount' | 'createdDate'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProject: Project = {
        ...project,
        id: Math.max(...projects.map(p => p.id), 0) + 1,
        candidateCount: 0,
        createdDate: new Date()
      };
      
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError('Failed to add project');
      throw new Error('Failed to add project');
    }
  };

  const updateProject = async (id: number, updates: Partial<Project>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? { ...project, ...updates } : project
        )
      );
      
      return projects.find(project => project.id === id);
    } catch (err) {
      setError('Failed to update project');
      throw new Error('Failed to update project');
    }
  };

  const deleteProject = async (id: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProjects(prev => prev.filter(project => project.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete project');
      throw new Error('Failed to delete project');
    }
  };

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject
  };
};
