
import React from 'react';
import { User, Users, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Candidate } from '@/data/mockCandidates';

interface CandidateListProps {
  candidates: Candidate[];
  selectedCandidates: number[];
  searchQuery: string;
  statusFilter: string;
  onSelectCandidate: (candidateId: number) => void;
  onSelectAllCandidates: () => void;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  selectedCandidates,
  searchQuery,
  statusFilter,
  onSelectCandidate,
  onSelectAllCandidates,
  onSearchChange,
  onStatusFilterChange,
}) => {
  const renderCandidateCard = (candidate: Candidate) => {
    const isSelected = selectedCandidates.includes(candidate.id);
    
    return (
      <Card 
        key={candidate.id} 
        className={`cursor-pointer transition-all ${isSelected ? 'border-primary ring-1 ring-primary' : ''}`}
        onClick={() => onSelectCandidate(candidate.id)}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
              <User className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">{candidate.name}</div>
              <div className="text-sm text-gray-500">{candidate.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={candidate.status === "Tiềm năng" ? "default" : "secondary"}>
              {candidate.status}
            </Badge>
            <Checkbox checked={isSelected} />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Ứng viên</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onSelectAllCandidates}
          >
            {selectedCandidates.length === candidates.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </Button>
        </div>
        
        <div className="space-y-4 mb-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Tìm theo tên, email..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={onStatusFilterChange}
            >
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="potential">Tiềm năng</SelectItem>
                <SelectItem value="not_suitable">Không phù hợp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {candidates.length > 0 ? (
            candidates.map(renderCandidateCard)
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">Không tìm thấy ứng viên phù hợp</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Đã chọn {selectedCandidates.length} / {candidates.length}
          </div>
          <div className="flex items-center text-primary text-sm">
            <Users className="h-4 w-4 mr-1" />
            <span>{selectedCandidates.length} người nhận</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateList;
