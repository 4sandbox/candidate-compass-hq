
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Users, Mail, Trash2, Edit, MoreVertical, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format } from 'date-fns';

const Dashboard = () => {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<{ id: number; name: string; description?: string; position: string; } | null>(null);
  const [newProject, setNewProject] = useState({ name: '', description: '', position: '' });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProject(newProject);
      setNewProject({ name: '', description: '', position: '' });
      setIsCreateDialogOpen(false);
      toast({
        title: "Dự án đã được tạo",
        description: `Dự án "${newProject.name}" đã được tạo thành công`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo dự án. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;
    
    try {
      await updateProject(currentProject.id, currentProject);
      setIsEditDialogOpen(false);
      toast({
        title: "Dự án đã được cập nhật",
        description: `Dự án "${currentProject.name}" đã được cập nhật thành công`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật dự án. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async () => {
    if (!currentProject) return;
    
    try {
      await deleteProject(currentProject.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Dự án đã bị xóa",
        description: `Dự án "${currentProject.name}" đã bị xóa`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa dự án. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const renderStatCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Dự án
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {projects.length > 0 
              ? `Dự án mới nhất: ${projects[0].name}`
              : 'Chưa có dự án nào'
            }
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ứng viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {projects.reduce((sum, project) => sum + project.candidateCount, 0)}
          </div>
          <div className="flex items-center text-xs text-green-600 mt-1">
            <FileText className="h-3 w-3 mr-1" />
            <span>Xem tất cả ứng viên</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Email đã gửi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Mail className="h-3 w-3 mr-1" />
            <span>Tháng trước: 12</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo dự án mới
        </Button>
      </div>

      {renderStatCards()}

      <h2 className="text-xl font-semibold mb-4">Dự án của bạn</h2>
      
      {projects.length === 0 ? (
        <div className="bg-gray-50 rounded-lg border border-dashed border-gray-200 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Bạn chưa có dự án nào</h3>
          <p className="mt-2 text-sm text-gray-500">
            Bắt đầu bằng cách tạo dự án tuyển dụng đầu tiên của bạn.
          </p>
          <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo dự án mới
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-3 pt-5 px-5 flex flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{project.position}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => {
                        setCurrentProject({
                          id: project.id, 
                          name: project.name, 
                          description: project.description || '',
                          position: project.position
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Chỉnh sửa</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>Chia sẻ</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => {
                        setCurrentProject({
                          id: project.id, 
                          name: project.name,
                          description: project.description,
                          position: project.position
                        });
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Xóa</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="pb-5 px-5">
                <div className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description || 'Không có mô tả'}
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {project.candidateCount} ứng viên
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {format(project.createdDate, 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <Link to="/upload">
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm CV
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo dự án mới</DialogTitle>
            <DialogDescription>
              Tạo dự án tuyển dụng mới để quản lý CV ứng viên.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProject}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Tên dự án</Label>
                <Input 
                  id="name" 
                  placeholder="Nhập tên dự án" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Vị trí tuyển dụng</Label>
                <Input 
                  id="position" 
                  placeholder="Ví dụ: Frontend Developer" 
                  value={newProject.position}
                  onChange={(e) => setNewProject({ ...newProject, position: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả (không bắt buộc)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Mô tả về dự án tuyển dụng" 
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Tạo dự án</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa dự án</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin dự án tuyển dụng của bạn.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProject}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tên dự án</Label>
                <Input 
                  id="edit-name" 
                  placeholder="Nhập tên dự án" 
                  value={currentProject?.name || ''}
                  onChange={(e) => setCurrentProject(curr => curr ? { ...curr, name: e.target.value } : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">Vị trí tuyển dụng</Label>
                <Input 
                  id="edit-position" 
                  placeholder="Ví dụ: Frontend Developer" 
                  value={currentProject?.position || ''}
                  onChange={(e) => setCurrentProject(curr => curr ? { ...curr, position: e.target.value } : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả (không bắt buộc)</Label>
                <Textarea 
                  id="edit-description" 
                  placeholder="Mô tả về dự án tuyển dụng" 
                  value={currentProject?.description || ''}
                  onChange={(e) => setCurrentProject(curr => curr ? { ...curr, description: e.target.value } : null)}
                  rows={3}
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
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa dự án</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa dự án "{currentProject?.name}"?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteProject}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Dashboard;
