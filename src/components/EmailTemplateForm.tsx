
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmailTemplate } from '@/data/mockEmailTemplates';

const templateSchema = z.object({
  name: z.string().min(1, 'Tên mẫu email là bắt buộc'),
  subject: z.string().min(1, 'Tiêu đề email là bắt buộc'),
  body: z.string().min(10, 'Nội dung email cần ít nhất 10 ký tự'),
});

type FormValues = z.infer<typeof templateSchema>;

interface EmailTemplateFormProps {
  initialData?: EmailTemplate;
  onSave: (data: FormValues) => void;
  onCancel: () => void;
}

export const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: initialData?.name || '',
      subject: initialData?.subject || '',
      body: initialData?.body || '',
    },
  });

  const onSubmit = (values: FormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên mẫu email</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Mời phỏng vấn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ví dụ: Mời tham gia phỏng vấn vị trí {Vị trí ứng tuyển}" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung email</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập nội dung email..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Lưu mẫu
          </Button>
        </div>
      </form>
    </Form>
  );
};
