
import React from 'react';
import { Copy, Building, Briefcase, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmailTemplate } from '@/data/mockEmailTemplates';
import { Company } from '@/data/mockCompanies';
import { JobDetail } from '@/data/mockJobDetails';
import { Candidate } from '@/data/mockCandidates';

interface EmailComposerProps {
  templates: EmailTemplate[];
  companies: Company[];
  filteredJobs: JobDetail[];
  candidates: Candidate[];
  selectedCandidates: number[];
  selectedTemplateId: string;
  subject: string;
  body: string;
  selectedCompanyId: string;
  position: string;
  onSelectTemplate: (templateId: string) => void;
  onCompanyChange: (companyId: string) => void;
  onPositionChange: (position: string) => void;
  onSubjectChange: (subject: string) => void;
  onBodyChange: (body: string) => void;
  onCopyToClipboard: () => void;
}

const EmailComposer: React.FC<EmailComposerProps> = ({
  templates,
  companies,
  filteredJobs,
  candidates,
  selectedCandidates,
  selectedTemplateId,
  subject,
  body,
  selectedCompanyId,
  position,
  onSelectTemplate,
  onCompanyChange,
  onPositionChange,
  onSubjectChange,
  onBodyChange,
  onCopyToClipboard,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="template">Mẫu email</Label>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs text-muted-foreground"
            disabled={!selectedTemplateId}
            onClick={() => onSelectTemplate('')}
          >
            Xóa mẫu
          </Button>
        </div>
        <Select
          value={selectedTemplateId}
          onValueChange={onSelectTemplate}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn mẫu email" />
          </SelectTrigger>
          <SelectContent>
            {templates.map(template => (
              <SelectItem key={template.id} value={template.id.toString()}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Công ty</Label>
        <Select 
          value={selectedCompanyId} 
          onValueChange={onCompanyChange}
        >
          <SelectTrigger>
            <Building className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Chọn công ty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tất cả công ty</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id.toString()}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="position">Vị trí ứng tuyển</Label>
        <Select 
          value={position} 
          onValueChange={onPositionChange}
          disabled={filteredJobs.length === 0}
        >
          <SelectTrigger>
            <Briefcase className="h-4 w-4 mr-2" />
            <SelectValue placeholder={filteredJobs.length === 0 ? "Chọn công ty trước" : "Chọn vị trí"} />
          </SelectTrigger>
          <SelectContent>
            {filteredJobs.map(job => (
              <SelectItem key={job.id} value={job.title}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Tiêu đề</Label>
        <Input 
          id="subject" 
          placeholder="Tiêu đề email"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="body">Nội dung</Label>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs flex items-center gap-1"
            onClick={onCopyToClipboard}
          >
            <Copy className="h-3 w-3" />
            <span>Sao chép</span>
          </Button>
        </div>
        <Textarea 
          id="body" 
          placeholder="Nội dung email"
          className="min-h-[250px]"
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
        />
      </div>
      
      <div className="pt-4 border-t">
        <div className="bg-slate-50 p-3 rounded-md mb-4">
          <p className="text-sm font-medium mb-1">Biến có thể sử dụng:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{'{Tên}'}</Badge>
            <Badge variant="outline">{'{Vị trí ứng tuyển}'}</Badge>
            <Badge variant="outline">{'{Công ty}'}</Badge>
          </div>
        </div>
      </div>

      {selectedCandidates.length === 1 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center text-green-800 mb-2">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="font-medium">Xem trước email</span>
          </div>
          <p className="text-sm text-green-800">
            Email sẽ được gửi tới {candidates.find(c => c.id === selectedCandidates[0])?.name} với nội dung đã được điều chỉnh phù hợp.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailComposer;
