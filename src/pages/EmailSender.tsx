
import React, { useState } from 'react';
import { Send, User, Users, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCandidates } from '@/hooks/useCandidates';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Candidate } from '@/data/mockCandidates';

const EmailSender = () => {
  const { candidates, loading: candidatesLoading } = useCandidates();
  const { templates, renderTemplate, loading: templatesLoading } = useEmailTemplates();
  const { toast } = useToast();
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [position, setPosition] = useState('Frontend Developer');
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  const loading = candidatesLoading || templatesLoading;
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    
    if (!templateId) {
      setSubject('');
      setBody('');
      return;
    }
    
    const template = templates.find(t => t.id.toString() === templateId);
    if (!template) return;
    
    // If there's a selected candidate, use their name for preview
    const candidateName = selectedCandidates.length === 1
      ? candidates.find(c => c.id === selectedCandidates[0])?.name || '{Tên}'
      : '{Tên}';
    
    const rendered = renderTemplate(template, candidateName, position);
    setSubject(rendered.subject);
    setBody(rendered.body);
  };
  
  const handleSelectCandidate = (candidateId: number) => {
    setSelectedCandidates(prev => {
      const isSelected = prev.includes(candidateId);
      
      if (isSelected) {
        return prev.filter(id => id !== candidateId);
      } else {
        return [...prev, candidateId];
      }
    });
  };
  
  const handleSelectAllCandidates = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map(c => c.id));
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(body);
    
    toast({
      title: "Đã sao chép",
      description: "Nội dung email đã được sao chép vào clipboard",
    });
  };
  
  const handleSendEmail = () => {
    if (selectedCandidates.length === 0) {
      toast({
        title: "Chưa chọn ứng viên",
        description: "Vui lòng chọn ít nhất một ứng viên để gửi email",
        variant: "destructive",
      });
      return;
    }
    
    if (!subject || !body) {
      toast({
        title: "Nội dung trống",
        description: "Vui lòng nhập tiêu đề và nội dung email",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending delay
    setTimeout(() => {
      setIsSending(false);
      
      toast({
        title: "Gửi email thành công",
        description: `Đã gửi email tới ${selectedCandidates.length} ứng viên`,
      });
    }, 2000);
  };
  
  const renderCandidateCard = (candidate: Candidate) => {
    const isSelected = selectedCandidates.includes(candidate.id);
    
    return (
      <Card 
        key={candidate.id} 
        className={`cursor-pointer transition-all ${isSelected ? 'border-primary ring-1 ring-primary' : ''}`}
        onClick={() => handleSelectCandidate(candidate.id)}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
              <User className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">{candidate.name}</div>
              <div className="text-sm text-gray-500">{candidate.email}</div>
            </div>
          </div>
          <Checkbox checked={isSelected} />
        </CardContent>
      </Card>
    );
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Gửi Email</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Candidate selection */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Ứng viên</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSelectAllCandidates}
                >
                  {selectedCandidates.length === candidates.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {candidates.map(renderCandidateCard)}
              </div>
              
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Đã chọn {selectedCandidates.length} / {candidates.length}
                </div>
                <div className="flex items-center text-primary text-sm">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{selectedCandidates.length} người nhận</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Email composition */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 border rounded-lg">
              <h2 className="text-lg font-medium mb-4">Soạn email</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="template">Mẫu email</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs text-muted-foreground"
                      disabled={!selectedTemplateId}
                      onClick={() => handleSelectTemplate('')}
                    >
                      Xóa mẫu
                    </Button>
                  </div>
                  <Select
                    value={selectedTemplateId}
                    onValueChange={handleSelectTemplate}
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
                  <Label htmlFor="position">Vị trí ứng tuyển</Label>
                  <Input 
                    id="position" 
                    placeholder="Vị trí ứng tuyển"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Được sử dụng để thay thế biến {'{Vị trí ứng tuyển}'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Tiêu đề</Label>
                  <Input 
                    id="subject" 
                    placeholder="Tiêu đề email"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="body">Nội dung</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs flex items-center gap-1"
                      onClick={handleCopyToClipboard}
                    >
                      <Copy className="h-3 w-3" />
                      <span>Sao chép</span>
                    </Button>
                  </div>
                  <Textarea 
                    id="body" 
                    placeholder="Nội dung email"
                    className="min-h-[200px]"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm mb-2">
                    <span className="font-medium">Biến có thể sử dụng:</span> {'{Tên}'}, {'{Vị trí ứng tuyển}'}
                  </p>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSendEmail}
                      disabled={isSending || selectedCandidates.length === 0}
                    >
                      {isSending ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Đang gửi...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Gửi email
                        </>
                      )}
                    </Button>
                  </div>
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
        </div>
      </div>
    </Layout>
  );
};

export default EmailSender;
