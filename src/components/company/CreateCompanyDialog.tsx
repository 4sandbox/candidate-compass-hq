
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CreateCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: {
    name: string;
    industry: string;
    website: string;
    description: string;
    address: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CreateCompanyDialog: React.FC<CreateCompanyDialogProps> = ({
  open,
  onOpenChange,
  company,
  onChange,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm công ty mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin công ty của bạn.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Tên công ty</Label>
              <Input 
                id="name" 
                placeholder="Nhập tên công ty" 
                value={company.name}
                onChange={(e) => onChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Ngành nghề</Label>
              <Input 
                id="industry" 
                placeholder="Ví dụ: Công nghệ, Tài chính..." 
                value={company.industry}
                onChange={(e) => onChange('industry', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website (không bắt buộc)</Label>
              <Input 
                id="website" 
                placeholder="https://example.com" 
                value={company.website}
                onChange={(e) => onChange('website', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ (không bắt buộc)</Label>
              <Input 
                id="address" 
                placeholder="Địa chỉ công ty" 
                value={company.address}
                onChange={(e) => onChange('address', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả (không bắt buộc)</Label>
              <Textarea 
                id="description" 
                placeholder="Mô tả về công ty" 
                value={company.description}
                onChange={(e) => onChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">Tạo công ty</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCompanyDialog;
