
import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, Edit, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useJobDetails } from '@/hooks/useJobDetails';
import { useCompanies } from '@/hooks/useCompanies';
import { useProjects } from '@/hooks/useProjects';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

const JobDetailManagement = () => {
  const { jobDetails, loading, addJobDetail, updateJobDetail, deleteJobDetail } = useJobDetails();
  const { companies, loading: loadingCompanies } = useCompanies();
  const { projects, loading: loadingProjects } = useProjects();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [currentJob, setCurrentJob] = useState<any>(null);
  const [newJob, setNewJob] = useState({
    title: '',
    companyId: '',
    projectId: '',
    location: '',
    jobType: 'Full-time',
    salary: '',
    requirements: '',
    description: '',
    responsibilities: '',
    deadline: '',
    status: 'Đang tuyển' as 'Đang tuyển' | 'Đã đóng' | 'Tạm dừng'
  });

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requirementsArray = newJob.requirements
        .split('\n')
        .filter(item => item.trim() !== '');
        
      const responsibilitiesArray = newJob.responsibilities
        .split('\n')
        .filter(item => item.trim() !== '');

      await addJobDetail({
        ...newJob,
        companyId: parseInt(newJob.companyId),
        projectId: parseInt(newJob.projectId),
        requirements: requirementsArray,
        responsibilities: responsibilitiesArray,
        deadline: newJob.deadline ? new Date(newJob.deadline) : undefined,
        status: newJob.status
      });
      
      setNewJob({
        title: '',
        companyId: '',
        projectId: '',
        location: '',
        jobType: 'Full-time',
        salary: '',
        requirements: '',
        description: '',
        responsibilities: '',
        deadline: '',
        status: 'Đang tuyển'
      });
      
      setIsCreateDialogOpen(false);
      toast({
        title: "Đã tạo tin tuyển dụng",
        description: `Tin tuyển dụng "${newJob.title}" đã được tạo thành công`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo tin tuyển dụng. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleEditJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentJob) return;

    try {
      const requirementsArray = currentJob.requirements instanceof Array 
        ? currentJob.requirements 
        : currentJob.requirements.split('\n').filter((item: string) => item.trim() !== '');
        
      const responsibilitiesArray = currentJob.responsibilities instanceof Array 
        ? currentJob.responsibilities
        : currentJob.responsibilities.split('\n').filter((item: string) => item.trim() !== '');
      
      await updateJobDetail(currentJob.id, {
        ...currentJob,
        requirements: requirementsArray,
        responsibilities: responsibilitiesArray,
        deadline: currentJob.deadline ? new Date(currentJob.deadline) : undefined
      });
      
      setIsEditDialogOpen(false);
      toast({
        title: "Đã cập nhật tin tuyển dụng",
        description: `Tin tuyển dụng "${currentJob.title}" đã được cập nhật thành công`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật tin tuyển dụng. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = async () => {
    if (!currentJob) return;
    
    try {
      await deleteJobDetail(currentJob.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Đã xóa tin tuyển dụng",
        description: `Tin tuyển dụng "${currentJob.title}" đã bị xóa`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa tin tuyển dụng. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Đang tuyển':
        return 'bg-green-100 text-green-800';
      case 'Đã đóng':
        return 'bg-gray-100 text-gray-800';
      case 'Tạm dừng':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getCompanyName = (companyId: number) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'N/A';
  };

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'N/A';
  };

  if (loading || loadingCompanies || loadingProjects) {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tin tuyển dụng</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm tin tuyển dụng
        </Button>
      </div>

      {jobDetails.length === 0 ? (
        <EmptyState 
          title="Chưa có tin tuyển dụng nào"
          description="Bắt đầu bằng cách thêm tin tuyển dụng đầu tiên."
          icon={<Briefcase />}
          action={
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm tin tuyển dụng
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobDetails.map((job) => (
            <Card key={job.id}>
              <CardHeader className="pb-3 flex flex-row justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <Badge className={getStatusBadgeColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getCompanyName(job.companyId)} • {job.location}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 ml-2">
                      <span className="sr-only">Mở menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => {
                        setCurrentJob({
                          ...job,
                          requirements: job.requirements.join('\n'),
                          responsibilities: job.responsibilities.join('\n'),
                          deadline: job.deadline ? format(job.deadline, 'yyyy-MM-dd') : ''
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Chỉnh sửa</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => {
                        setCurrentJob(job);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Xóa</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="font-medium">Dự án:</span> {getProjectName(job.projectId)}
                  </p>
                  {job.salary && (
                    <p className="text-sm">
                      <span className="font-medium">Lương:</span> {job.salary}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Loại việc làm:</span> {job.jobType}
                  </p>
                  <p className="text-sm line-clamp-2">
                    <span className="font-medium">Mô tả:</span> {job.description}
                  </p>
                  {job.deadline && (
                    <p className="text-sm">
                      <span className="font-medium">Hạn chót:</span> {format(job.deadline, 'dd/MM/yyyy')}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">
                    Đã tạo: {format(job.createdDate, 'dd/MM/yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Job Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm tin tuyển dụng mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết về vị trí tuyển dụng.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateJob}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Chức danh</Label>
                <Input 
                  id="title" 
                  placeholder="Ví dụ: Frontend Developer" 
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Địa điểm</Label>
                <Input 
                  id="location" 
                  placeholder="Ví dụ: TP.HCM" 
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Công ty</Label>
                <Select 
                  value={newJob.companyId} 
                  onValueChange={(value) => setNewJob({ ...newJob, companyId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn công ty" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Dự án</Label>
                <Select 
                  value={newJob.projectId} 
                  onValueChange={(value) => setNewJob({ ...newJob, projectId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dự án" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobType">Loại việc làm</Label>
                <Select 
                  value={newJob.jobType} 
                  onValueChange={(value) => setNewJob({ ...newJob, jobType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Lương (không bắt buộc)</Label>
                <Input 
                  id="salary" 
                  placeholder="Ví dụ: 1000 - 2000 USD" 
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select 
                  value={newJob.status} 
                  onValueChange={(value: 'Đang tuyển' | 'Đã đóng' | 'Tạm dừng') => 
                    setNewJob({ ...newJob, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang tuyển">Đang tuyển</SelectItem>
                    <SelectItem value="Tạm dừng">Tạm dừng</SelectItem>
                    <SelectItem value="Đã đóng">Đã đóng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Hạn chót (không bắt buộc)</Label>
                <Input 
                  id="deadline" 
                  type="date" 
                  value={newJob.deadline}
                  onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Mô tả công việc</Label>
                <Textarea 
                  id="description" 
                  placeholder="Mô tả chi tiết về công việc" 
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="requirements">Yêu cầu (mỗi yêu cầu một dòng)</Label>
                <Textarea 
                  id="requirements" 
                  placeholder="Ví dụ:
2 năm kinh nghiệm với React
Thành thạo JavaScript/TypeScript
Hiểu biết về responsive design" 
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="responsibilities">Trách nhiệm (mỗi trách nhiệm một dòng)</Label>
                <Textarea 
                  id="responsibilities" 
                  placeholder="Ví dụ:
Phát triển và duy trì giao diện người dùng
Tối ưu hóa ứng dụng để đạt hiệu suất tối đa
Hợp tác với team backend" 
                  value={newJob.responsibilities}
                  onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Tạo tin tuyển dụng</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa tin tuyển dụng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi tiết về vị trí tuyển dụng.
            </DialogDescription>
          </DialogHeader>
          {currentJob && (
            <form onSubmit={handleEditJob}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Chức danh</Label>
                  <Input 
                    id="edit-title" 
                    value={currentJob.title || ''}
                    onChange={(e) => setCurrentJob({ ...currentJob, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Địa điểm</Label>
                  <Input 
                    id="edit-location" 
                    value={currentJob.location || ''}
                    onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Công ty</Label>
                  <Select 
                    value={currentJob.companyId?.toString()} 
                    onValueChange={(value) => setCurrentJob({ ...currentJob, companyId: parseInt(value) })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-project">Dự án</Label>
                  <Select 
                    value={currentJob.projectId?.toString()} 
                    onValueChange={(value) => setCurrentJob({ ...currentJob, projectId: parseInt(value) })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-jobType">Loại việc làm</Label>
                  <Select 
                    value={currentJob.jobType} 
                    onValueChange={(value) => setCurrentJob({ ...currentJob, jobType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-salary">Lương (không bắt buộc)</Label>
                  <Input 
                    id="edit-salary" 
                    value={currentJob.salary || ''}
                    onChange={(e) => setCurrentJob({ ...currentJob, salary: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Trạng thái</Label>
                  <Select 
                    value={currentJob.status} 
                    onValueChange={(value: 'Đang tuyển' | 'Đã đóng' | 'Tạm dừng') => 
                      setCurrentJob({ ...currentJob, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Đang tuyển">Đang tuyển</SelectItem>
                      <SelectItem value="Tạm dừng">Tạm dừng</SelectItem>
                      <SelectItem value="Đã đóng">Đã đóng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-deadline">Hạn chót (không bắt buộc)</Label>
                  <Input 
                    id="edit-deadline" 
                    type="date" 
                    value={currentJob.deadline || ''}
                    onChange={(e) => setCurrentJob({ ...currentJob, deadline: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-description">Mô tả công việc</Label>
                  <Textarea 
                    id="edit-description" 
                    value={currentJob.description || ''}
                    onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-requirements">Yêu cầu (mỗi yêu cầu một dòng)</Label>
                  <Textarea 
                    id="edit-requirements" 
                    value={currentJob.requirements || ''}
                    onChange={(e) => setCurrentJob({ ...currentJob, requirements: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-responsibilities">Trách nhiệm (mỗi trách nhiệm một dòng)</Label>
                  <Textarea 
                    id="edit-responsibilities" 
                    value={currentJob.responsibilities || ''}
                    onChange={(e) => setCurrentJob({ ...currentJob, responsibilities: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu thay đổi</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Job Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa tin tuyển dụng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tin tuyển dụng "{currentJob?.title}"?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteJob}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default JobDetailManagement;
