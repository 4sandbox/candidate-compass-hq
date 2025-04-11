
import { useState, useEffect } from 'react';
import { Candidate, mockCandidates, CandidateStatus } from '../data/mockCandidates';

export const useCandidates = (initialStatus: CandidateStatus = 'Tất cả') => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CandidateStatus>(initialStatus);

  // Simulate API call
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter candidates based on status
        const filteredCandidates = statusFilter === 'Tất cả'
          ? mockCandidates
          : mockCandidates.filter(candidate => candidate.status === statusFilter);
          
        setCandidates(filteredCandidates);
        setLoading(false);
      } catch (err) {
        setError('Failed to load candidates');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [statusFilter]);

  const matchWithJobDescription = async (jd: string): Promise<Candidate[]> => {
    try {
      // Simulate API call for matching
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send the JD to an API and get back updated scores
      // For now, we'll simulate it with random scores
      const updatedCandidates = candidates.map(candidate => ({
        ...candidate,
        matchScore: Math.floor(Math.random() * 50) + 50 // Random score between 50-100
      }));
      
      setCandidates(updatedCandidates);
      return updatedCandidates;
    } catch (err) {
      setError('Failed to match with job description');
      return candidates;
    }
  };

  return {
    candidates,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    matchWithJobDescription
  };
};
