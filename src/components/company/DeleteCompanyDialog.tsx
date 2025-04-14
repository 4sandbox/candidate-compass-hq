
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName: string;
  onConfirmDelete: () => void;
}

const DeleteCompanyDialog: React.FC<DeleteCompanyDialogProps> = ({
  open,
  onOpenChange,
  companyName,
  onConfirmDelete
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa công ty</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa công ty "{companyName}"?
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirmDelete}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCompanyDialog;
