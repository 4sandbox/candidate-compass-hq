
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Company } from '@/data/mockCompanies';

interface EditCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Partial<Company> & { id?: number } | null;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const EditCompanyDialog: React.FC<EditCompanyDialogProps> = ({
  open,
  onOpenChange,
  company,
  onChange,
  onSubmit
}) => {
  if (!company) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa công ty</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin của công ty.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên công ty</Label>
              <Input 
                id="edit-name" 
                placeholder="Nhập tên công ty" 
                value={company.name || ''}
                onChange={(e) => onChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-industry">Ngành nghề</Label>
              <Input 
                id="edit-industry" 
                placeholder="Ví dụ: Công nghệ, Tài chính..." 
                value={company.industry || ''}
                onChange={(e) => onChange('industry', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-website">Website (không bắt buộc)</Label>
              <Input 
                id="edit-website" 
                placeholder="https://example.com" 
                value={company.website || ''}
                onChange={(e) => onChange('website', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Địa chỉ (không bắt buộc)</Label>
              <Input 
                id="edit-address" 
                placeholder="Địa chỉ công ty" 
                value={company.address || ''}
                onChange={(e) => onChange('address', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả (không bắt buộc)</Label>
              <Textarea 
                id="edit-description" 
                placeholder="Mô tả về công ty" 
                value={company.description || ''}
                onChange={(e) => onChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDialog;
