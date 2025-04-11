
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Filter, Search, User, X, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CandidateStatus, useCandidates } from '@/hooks/useCandidates';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import SkillBadge from '@/components/SkillBadge';

const CandidateList = () => {
  const { 
    candidates, 
    loading, 
    statusFilter, 
    setStatusFilter,
    matchWithJobDescription
  } = useCandidates('Tất cả');
  
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isJdDialogOpen, setIsJdDialogOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  
  const statusOptions: CandidateStatus[] = ['Tất cả', 'Tiềm năng', 'Không phù hợp'];
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleMatchWithJD = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mô tả công việc",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsMatching(true);
      await matchWithJobDescription(jobDescription);
      
      toast({
        title: "Phân tích hoàn tất",
        description: "Các CV đã được so khớp với mô tả công việc",
      });
      
      setIsJdDialogOpen(false);
      setJobDescription('');
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể so khớp CV với mô tả công việc",
        variant: "destructive",
      });
    } finally {
      setIsMatching(false);
    }
  };
  
  const handleExportCSV = () => {
    toast({
      title: "Đang xuất CSV",
      description: "File sẽ được tải xuống sau vài giây",
    });
    
    // Simulate download delay
    setTimeout(() => {
      const headers = ['ID', 'Name', 'Email', 'Skills', 'Status', 'Match Score'];
      
      const csvContent = [
        headers.join(','),
        ...candidates.map(candidate => [
          candidate.id,
          `"${candidate.name}"`,
          candidate.email,
          `"${candidate.skills.join(', ')}"`,
          candidate.status,
          candidate.matchScore || 0
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'candidates.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Xuất thành công",
        description: "File CSV đã được tải xuống",
      });
    }, 1000);
  };
  
  const filteredCandidates = candidates.filter(candidate => {
    if (searchQuery === '') return true;
    
    const query = searchQuery.toLowerCase();
    return (
      candidate.name.toLowerCase().includes(query) ||
      candidate.email.toLowerCase().includes(query) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(query))
    );
  });

  const renderCandidateRow = (candidate: typeof candidates[0]) => {
    // Format match score with color based on value
    const getScoreColor = (score?: number) => {
      if (score === undefined) return "text-gray-400";
      if (score >= 80) return "text-green-600";
      if (score >= 60) return "text-yellow-600";
      return "text-red-600";
    };
    
    return (
      <tr key={candidate.id} className="border-b hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
              <User className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">{candidate.name}</div>
              <div className="text-sm text-gray-500">{candidate.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1">
            {candidate.skills.slice(0, 3).map((skill, index) => (
              <SkillBadge key={index} skill={skill} />
            ))}
            {candidate.skills.length > 3 && (
              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                +{candidate.skills.length - 3}
              </Badge>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Badge
            className={
              candidate.status === 'Tiềm năng'
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }
            variant="outline"
          >
            {candidate.status}
          </Badge>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {candidate.matchScore !== undefined ? (
            <div className="flex items-center gap-2">
              <div className={`font-medium ${getScoreColor(candidate.matchScore)}`}>
                {candidate.matchScore}%
              </div>
              <Progress 
                value={candidate.matchScore} 
                className="h-2 w-20" 
                indicatorClassName={
                  candidate.matchScore >= 80 ? "bg-green-500" :
                  candidate.matchScore >= 60 ? "bg-yellow-500" :
                  "bg-red-500"
                }
              />
            </div>
          ) : (
            <span className="text-gray-400">--</span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
          <Link 
            to={`/candidates/${candidate.id}`} 
            className="text-primary hover:text-primary/80 font-medium"
          >
            Chi tiết
          </Link>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Danh sách ứng viên</h1>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Xuất CSV
          </Button>
          
          <Dialog open={isJdDialogOpen} onOpenChange={setIsJdDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <AlignLeft className="h-4 w-4 mr-2" />
                So khớp JD
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>So khớp với mô tả công việc</DialogTitle>
                <DialogDescription>
                  Nhập mô tả công việc để so khớp với CV của ứng viên
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea 
                  placeholder="Nhập mô tả công việc ở đây..." 
                  className="min-h-[200px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">
                    Hủy
                  </Button>
                </DialogClose>
                <Button onClick={handleMatchWithJD} disabled={isMatching}>
                  {isMatching ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Đang xử lý...</span>
                    </>
                  ) : 'So khớp'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc kỹ năng"
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 h-4 w-4" />
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as CandidateStatus)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredCandidates.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Không tìm thấy ứng viên nào phù hợp với tìm kiếm của bạn</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="px-6 py-3 text-left">Ứng viên</th>
                  <th className="px-6 py-3 text-left">Kỹ năng</th>
                  <th className="px-6 py-3 text-left">Trạng thái</th>
                  <th className="px-6 py-3 text-left">Điểm khớp</th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {filteredCandidates.map(renderCandidateRow)}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {filteredCandidates.length} / {candidates.length} ứng viên
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Trước
            </Button>
            <Button variant="outline" size="sm" disabled>
              Tiếp
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CandidateList;
