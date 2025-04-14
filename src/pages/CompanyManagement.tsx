
import React, { useState } from 'react';
import { Building, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompanies } from '@/hooks/useCompanies';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import CompanyGrid from '@/components/company/CompanyGrid';
import CreateCompanyDialog from '@/components/company/CreateCompanyDialog';
import EditCompanyDialog from '@/components/company/EditCompanyDialog';
import DeleteCompanyDialog from '@/components/company/DeleteCompanyDialog';
import { Company } from '@/data/mockCompanies';

const CompanyManagement = () => {
  const { companies, loading, addCompany, updateCompany, deleteCompany } = useCompanies();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Partial<Company> & { id?: number } | null>(null);
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
    if (!currentCompany?.id) return;
    
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
    if (!currentCompany?.id) return;
    
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

  const handleEditButtonClick = (company: Company) => {
    setCurrentCompany({
      id: company.id, 
      name: company.name,
      industry: company.industry,
      website: company.website,
      description: company.description,
      address: company.address
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteButtonClick = (company: Company) => {
    setCurrentCompany({
      id: company.id, 
      name: company.name,
      industry: company.industry,
      website: company.website,
      description: company.description,
      address: company.address
    });
    setIsDeleteDialogOpen(true);
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
        <CompanyGrid 
          companies={companies}
          onEditClick={handleEditButtonClick}
          onDeleteClick={handleDeleteButtonClick}
        />
      )}

      <CreateCompanyDialog 
        open={isCreateDialogOpen}
        onOpenChange={handleCreateDialogClose}
        company={newCompany}
        onChange={(field, value) => setNewCompany(prev => ({ ...prev, [field]: value }))}
        onSubmit={handleCreateCompany}
      />

      <EditCompanyDialog 
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
        company={currentCompany}
        onChange={(field, value) => setCurrentCompany(curr => curr ? { ...curr, [field]: value } : null)}
        onSubmit={handleEditCompany}
      />

      <DeleteCompanyDialog 
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogClose}
        companyName={currentCompany?.name || ''}
        onConfirmDelete={handleDeleteCompany}
      />
    </Layout>
  );
};

export default CompanyManagement;
