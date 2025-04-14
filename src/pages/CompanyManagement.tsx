import React, { useState } from 'react';
import { Building, Plus, Trash2, Edit, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useCompanies } from '@/hooks/useCompanies';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

const CompanyManagement = () => {
  const { companies, loading, addCompany, updateCompany, deleteCompany } = useCompanies();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<{ id: number; name: string; industry: string; website?: string; description?: string; address?: string; } | null>(null);
  const [newCompany, setNewCompany] = useState({ name: '', industry: '', website: '', description: '', address: '' });

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCompany(newCompany);
      setNewCompany({ name: '', industry: '', website: '', description: '', address: '' });
      setIsCreateDialogOpen(false);
      toast({
        title: "Công ty đã được tạo",
        description: `Công ty "${newCompany.name}" đã được tạo thành công`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo công ty. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleEditCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCompany) return;
    
    try {
      await updateCompany(currentCompany.id, currentCompany);
      setIsEditDialogOpen(false);
      toast({
        title: "Công ty đã được cập nhật",
        description: `Công ty "${currentCompany.name}" đã được cập nhật thành công`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật công ty. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCompany = async () => {
    if (!currentCompany) return;
    
    try {
      await deleteCompany(currentCompany.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Công ty đã bị xóa",
        description: `Công ty "${currentCompany.name}" đã bị xóa`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa công ty. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    setTimeout(() => {
      setNewCompany({ name: '', industry: '', website: '', description: '', address: '' });
    }, 100);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setTimeout(() => {
      setCurrentCompany(null);
    }, 100);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setTimeout(() => {
      setCurrentCompany(null);
    }, 100);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý công ty</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm công ty mới
        </Button>
      </div>

      {companies.length === 0 ? (
        <EmptyState 
          title="Chưa có công ty nào"
          description="Bắt đầu bằng cách thêm công ty đầu tiên."
          icon={<Building />}
          action={
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm công ty mới
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardHeader className="pb-3 flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{company.industry}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Mở menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => {
                        setCurrentCompany({
                          id: company.id, 
                          name: company.name,
                          industry: company.industry,
                          website: company.website,
                          description: company.description,
                          address: company.address
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
                        setCurrentCompany({
                          id: company.id, 
                          name: company.name,
                          industry: company.industry,
                          website: company.website,
                          description: company.description,
                          address: company.address
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
              <CardContent>
                {company.website && (
                  <p className="text-sm mb-2">
                    <span className="font-medium">Website:</span>{" "}
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {company.website}
                    </a>
                  </p>
                )}
                {company.address && (
                  <p className="text-sm mb-2">
                    <span className="font-medium">Địa chỉ:</span> {company.address}
                  </p>
                )}
                {company.description && (
                  <p className="text-sm mb-2 line-clamp-3">
                    <span className="font-medium">Mô tả:</span> {company.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  Đã tạo: {format(company.createdDate, 'dd/MM/yyyy')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm công ty mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin công ty của bạn.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCompany}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Tên công ty</Label>
                <Input 
                  id="name" 
                  placeholder="Nhập tên công ty" 
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Ngành nghề</Label>
                <Input 
                  id="industry" 
                  placeholder="Ví dụ: Công nghệ, Tài chính..." 
                  value={newCompany.industry}
                  onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (không bắt buộc)</Label>
                <Input 
                  id="website" 
                  placeholder="https://example.com" 
                  value={newCompany.website}
                  onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ (không bắt buộc)</Label>
                <Input 
                  id="address" 
                  placeholder="Địa chỉ công ty" 
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả (không bắt buộc)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Mô tả về công ty" 
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleCreateDialogClose}>
                Hủy
              </Button>
              <Button type="submit">Tạo công ty</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa công ty</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin của công ty.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCompany}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tên công ty</Label>
                <Input 
                  id="edit-name" 
                  placeholder="Nhập tên công ty" 
                  value={currentCompany?.name || ''}
                  onChange={(e) => setCurrentCompany(curr => curr ? { ...curr, name: e.target.value } : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-industry">Ngành nghề</Label>
                <Input 
                  id="edit-industry" 
                  placeholder="Ví dụ: Công nghệ, Tài chính..." 
                  value={currentCompany?.industry || ''}
                  onChange={(e) => setCurrentCompany(curr => curr ? { ...curr, industry: e.target.value } : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-website">Website (không bắt buộc)</Label>
                <Input 
                  id="edit-website" 
                  placeholder="https://example.com" 
                  value={currentCompany?.website || ''}
                  onChange={(e) => setCurrentCompany(curr => curr ? { ...curr, website: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Địa chỉ (không bắt buộc)</Label>
                <Input 
                  id="edit-address" 
                  placeholder="Địa chỉ công ty" 
                  value={currentCompany?.address || ''}
                  onChange={(e) => setCurrentCompany(curr => curr ? { ...curr, address: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả (không bắt buộc)</Label>
                <Textarea 
                  id="edit-description" 
                  placeholder="Mô tả về công ty" 
                  value={currentCompany?.description || ''}
                  onChange={(e) => setCurrentCompany(curr => curr ? { ...curr, description: e.target.value } : null)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleEditDialogClose}>
                Hủy
              </Button>
              <Button type="submit">Lưu thay đổi</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa công ty</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa công ty "{currentCompany?.name}"?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={handleDeleteDialogClose}>
              Hủy
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteCompany}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CompanyManagement;
