
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  skill: string;
  className?: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, className }) => {
  // Map skills to colors based on categories
  const getSkillColor = (skill: string) => {
    const frontendSkills = ['React', 'Angular', 'Vue.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS'];
    const backendSkills = ['Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'PHP', 'Java', '.NET'];
    const databaseSkills = ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase', 'SQL', 'NoSQL', 'Redis'];
    const cloudSkills = ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD'];
    
    if (frontendSkills.includes(skill)) return "bg-blue-100 text-blue-800";
    if (backendSkills.includes(skill)) return "bg-green-100 text-green-800";
    if (databaseSkills.includes(skill)) return "bg-purple-100 text-purple-800";
    if (cloudSkills.includes(skill)) return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };
  
  return (
    <Badge 
      className={cn(
        getSkillColor(skill), 
        "font-normal",
        className
      )}
      variant="outline"
    >
      {skill}
    </Badge>
  );
};

export default SkillBadge;
