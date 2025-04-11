
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { EmailTemplateForm } from './EmailTemplateForm';
import { EmailTemplate } from '@/data/mockEmailTemplates';

interface EmailTemplateManagerProps {
  templates: EmailTemplate[];
  onTemplateSelect: (templateId: number) => void;
  onCreateTemplate: (template: Omit<EmailTemplate, 'id'>) => void;
  onUpdateTemplate: (id: number, template: Omit<EmailTemplate, 'id'>) => void;
  onDeleteTemplate: (id: number) => void;
}

export const EmailTemplateManager: React.FC<EmailTemplateManagerProps> = ({
  templates,
  onTemplateSelect,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<EmailTemplate | null>(null);

  const handleCreateClick = () => {
    setSelectedTemplate(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (template: EmailTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (template: EmailTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    setTemplateToDelete(template);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveTemplate = (data: Omit<EmailTemplate, 'id'>) => {
    if (selectedTemplate) {
      onUpdateTemplate(selectedTemplate.id, data);
      toast({
        title: "Cập nhật thành công",
        description: `Mẫu email "${data.name}" đã được cập nhật`,
      });
    } else {
      onCreateTemplate(data);
      toast({
        title: "Tạo mẫu thành công",
        description: `Mẫu email "${data.name}" đã được tạo`,
      });
    }
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      onDeleteTemplate(templateToDelete.id);
      toast({
        title: "Xóa thành công",
        description: `Mẫu email "${templateToDelete.name}" đã được xóa`,
      });
      setIsDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleCopyTemplate = (template: EmailTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTemplate = {
      name: `${template.name} (Bản sao)`,
      subject: template.subject,
      body: template.body
    };
    
    onCreateTemplate(newTemplate);
    toast({
      title: "Sao chép thành công",
      description: `Đã tạo bản sao của mẫu email "${template.name}"`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Mẫu email</h3>
        <Button onClick={handleCreateClick} size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Tạo mẫu</span>
        </Button>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:border-primary`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex-1 truncate">
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {template.subject}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => handleCopyTemplate(template, e)}
                    title="Tạo bản sao"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => handleEditClick(template, e)}
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    onClick={(e) => handleDeleteClick(template, e)}
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {templates.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Chưa có mẫu email nào</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleCreateClick}
              >
                <Plus className="h-4 w-4 mr-1" />
                Tạo mẫu đầu tiên
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? 'Chỉnh sửa mẫu email' : 'Tạo mẫu email mới'}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate 
                ? 'Cập nhật thông tin mẫu email hiện tại' 
                : 'Tạo một mẫu email mới để sử dụng cho chiến dịch email'}
            </DialogDescription>
          </DialogHeader>
          <EmailTemplateForm
            initialData={selectedTemplate || undefined}
            onSave={handleSaveTemplate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa mẫu email</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mẫu email "{templateToDelete?.name}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
