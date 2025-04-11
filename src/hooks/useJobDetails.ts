
import { useState, useEffect } from 'react';
import { JobDetail, mockJobDetails } from '../data/mockJobDetails';

export const useJobDetails = (projectId?: number) => {
  const [jobDetails, setJobDetails] = useState<JobDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter job details based on projectId if provided
        const filteredJobs = projectId 
          ? mockJobDetails.filter(job => job.projectId === projectId)
          : mockJobDetails;
          
        setJobDetails(filteredJobs);
        setLoading(false);
      } catch (err) {
        setError('Failed to load job details');
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [projectId]);

  const addJobDetail = async (job: Omit<JobDetail, 'id' | 'createdDate'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newJob: JobDetail = {
        ...job,
        id: Math.max(...jobDetails.map(j => j.id), 0) + 1,
        createdDate: new Date()
      };
      
      setJobDetails(prev => [...prev, newJob]);
      return newJob;
    } catch (err) {
      setError('Failed to add job detail');
      throw new Error('Failed to add job detail');
    }
  };

  const updateJobDetail = async (id: number, updates: Partial<JobDetail>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setJobDetails(prev => 
        prev.map(job => 
          job.id === id ? { ...job, ...updates } : job
        )
      );
      
      return jobDetails.find(job => job.id === id);
    } catch (err) {
      setError('Failed to update job detail');
      throw new Error('Failed to update job detail');
    }
  };

  const deleteJobDetail = async (id: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setJobDetails(prev => prev.filter(job => job.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete job detail');
      throw new Error('Failed to delete job detail');
    }
  };

  return {
    jobDetails,
    loading,
    error,
    addJobDetail,
    updateJobDetail,
    deleteJobDetail
  };
};
