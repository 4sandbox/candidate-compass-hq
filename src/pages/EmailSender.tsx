
import React, { useState, useEffect } from 'react';
import { Send, User, Users, Copy, CheckCircle, Search, Filter, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCandidates } from '@/hooks/useCandidates';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { useCompanies } from '@/hooks/useCompanies';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { EmailTemplateManager } from '@/components/EmailTemplateManager';
import { Candidate } from '@/data/mockCandidates';

const EmailSender = () => {
  const { candidates, loading: candidatesLoading } = useCandidates();
  const { 
    templates, 
    renderTemplate, 
    loading: templatesLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate
  } = useEmailTemplates();
  const { companies, loading: companiesLoading } = useCompanies();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("compose");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [position, setPosition] = useState('Frontend Developer');
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSending, setIsSending] = useState(false);
  
  const loading = candidatesLoading || templatesLoading || companiesLoading;
  
  // Filter candidates based on search query and status
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status === (statusFilter === 'potential' ? 'Tiềm năng' : 'Không phù hợp');
    return matchesSearch && matchesStatus;
  });
  
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
  
  const handleTemplateClick = (templateId: number) => {
    setSelectedTemplateId(templateId.toString());
    setActiveTab("compose");
    
    const template = templates.find(t => t.id === templateId);
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
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };
  
  // Update template preview when selected candidate changes and a template is selected
  useEffect(() => {
    if (selectedTemplateId && templates.length > 0) {
      const template = templates.find(t => t.id.toString() === selectedTemplateId);
      if (!template) return;
      
      // If there's a selected candidate, use their name for preview
      const candidateName = selectedCandidates.length === 1
        ? candidates.find(c => c.id === selectedCandidates[0])?.name || '{Tên}'
        : '{Tên}';
      
      const rendered = renderTemplate(template, candidateName, position);
      setSubject(rendered.subject);
      setBody(rendered.body);
    }
  }, [selectedCandidates, position]);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(body);
    
    toast({
      title: "Đã sao chép",
      description: "Nội dung email đã được sao chép vào clipboard",
    });
  };
  
  const handlePositionChange = (value: string) => {
    setPosition(value);
    
    if (selectedTemplateId && templates.length > 0) {
      const template = templates.find(t => t.id.toString() === selectedTemplateId);
      if (!template) return;
      
      // If there's a selected candidate, use their name for preview
      const candidateName = selectedCandidates.length === 1
        ? candidates.find(c => c.id === selectedCandidates[0])?.name || '{Tên}'
        : '{Tên}';
      
      const rendered = renderTemplate(template, candidateName, value);
      setSubject(rendered.subject);
      setBody(rendered.body);
    }
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
          <div className="flex items-center gap-2">
            <Badge variant={candidate.status === "Tiềm năng" ? "default" : "secondary"}>
              {candidate.status}
            </Badge>
            <Checkbox checked={isSelected} />
          </div>
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý Email</h1>
          <Button 
            variant="default" 
            onClick={handleSendEmail}
            disabled={isSending || selectedCandidates.length === 0 || !subject || !body}
            className="flex items-center"
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Candidate selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Ứng viên</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSelectAllCandidates}
                  >
                    {selectedCandidates.length === filteredCandidates.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </Button>
                </div>
                
                <div className="space-y-4 mb-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Tìm theo tên, email..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select 
                      value={statusFilter} 
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[160px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="potential">Tiềm năng</SelectItem>
                        <SelectItem value="not_suitable">Không phù hợp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map(renderCandidateCard)
                  ) : (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 mx-auto text-gray-300" />
                      <p className="mt-2 text-gray-500">Không tìm thấy ứng viên phù hợp</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Đã chọn {selectedCandidates.length} / {filteredCandidates.length}
                  </div>
                  <div className="flex items-center text-primary text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{selectedCandidates.length} người nhận</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Email composition */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="compose" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Soạn email</span>
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Quản lý mẫu</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="compose" className="mt-0">
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
                        <Select 
                          value={position} 
                          onValueChange={handlePositionChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vị trí" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                            <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                            <SelectItem value="Full-stack Developer">Full-stack Developer</SelectItem>
                            <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                            <SelectItem value="Project Manager">Project Manager</SelectItem>
                            <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                          </SelectContent>
                        </Select>
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
                          className="min-h-[250px]"
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                        />
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="bg-slate-50 p-3 rounded-md mb-4">
                          <p className="text-sm font-medium mb-1">Biến có thể sử dụng:</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{'{Tên}'}</Badge>
                            <Badge variant="outline">{'{Vị trí ứng tuyển}'}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="templates" className="mt-0">
                    <EmailTemplateManager 
                      templates={templates}
                      onTemplateSelect={handleTemplateClick}
                      onCreateTemplate={createTemplate}
                      onUpdateTemplate={updateTemplate}
                      onDeleteTemplate={deleteTemplate}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
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
