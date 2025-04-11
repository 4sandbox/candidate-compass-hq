
import React, { useState, useEffect } from 'react';
import { Send, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCandidates } from '@/hooks/useCandidates';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';
import { useCompanies } from '@/hooks/useCompanies';
import { useJobDetails } from '@/hooks/useJobDetails';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { EmailTemplateManager } from '@/components/EmailTemplateManager';
import { Candidate } from '@/data/mockCandidates';
import { JobDetail } from '@/data/mockJobDetails';
import CandidateList from '@/components/email/CandidateList';
import EmailComposer from '@/components/email/EmailComposer';

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
  const { jobDetails, loading: jobsLoading } = useJobDetails();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("compose");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [filteredJobs, setFilteredJobs] = useState<JobDetail[]>([]);
  const [position, setPosition] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSending, setIsSending] = useState(false);
  
  const loading = candidatesLoading || templatesLoading || companiesLoading || jobsLoading;
  
  useEffect(() => {
    if (selectedCompanyId) {
      const companyId = parseInt(selectedCompanyId);
      const jobs = jobDetails.filter(job => job.companyId === companyId);
      setFilteredJobs(jobs);
      
      const isCurrentPositionValid = jobs.some(job => job.title === position);
      if (!isCurrentPositionValid) {
        setPosition('');
      }
    } else {
      setFilteredJobs(jobDetails);
      setPosition('');
    }
  }, [selectedCompanyId, jobDetails]);
  
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
    
    const candidateName = selectedCandidates.length === 1
      ? candidates.find(c => c.id === selectedCandidates[0])?.name || '{Tên}'
      : '{Tên}';
    
    const companyName = selectedCompanyId 
      ? companies.find(c => c.id.toString() === selectedCompanyId)?.name 
      : undefined;
    
    const rendered = renderTemplate(template, candidateName, position, companyName);
    setSubject(rendered.subject);
    setBody(rendered.body);
  };
  
  const handleTemplateClick = (templateId: number) => {
    setSelectedTemplateId(templateId.toString());
    setActiveTab("compose");
    
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    const candidateName = selectedCandidates.length === 1
      ? candidates.find(c => c.id === selectedCandidates[0])?.name || '{Tên}'
      : '{Tên}';
    
    const companyName = selectedCompanyId 
      ? companies.find(c => c.id.toString() === selectedCompanyId)?.name 
      : undefined;
    
    const rendered = renderTemplate(template, candidateName, position, companyName);
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
  
  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };
  
  useEffect(() => {
    if (selectedTemplateId && templates.length > 0) {
      const template = templates.find(t => t.id.toString() === selectedTemplateId);
      if (!template) return;
      
      const candidateName = selectedCandidates.length === 1
        ? candidates.find(c => c.id === selectedCandidates[0])?.name || '{Tên}'
        : '{Tên}';
      
      const companyName = selectedCompanyId 
        ? companies.find(c => c.id.toString() === selectedCompanyId)?.name 
        : undefined;
        
      const rendered = renderTemplate(template, candidateName, position, companyName);
      setSubject(rendered.subject);
      setBody(rendered.body);
    }
  }, [selectedCandidates, position, selectedCompanyId]);
  
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
      
      const candidateName = selectedCandidates.length === 1
        ? candidates.find(c => c.id === selectedCandidates[0])?.name || '{Tên}'
        : '{Tên}';
      
      const companyName = selectedCompanyId 
        ? companies.find(c => c.id.toString() === selectedCompanyId)?.name 
        : undefined;
        
      const rendered = renderTemplate(template, candidateName, value, companyName);
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
    
    setTimeout(() => {
      setIsSending(false);
      
      toast({
        title: "Gửi email thành công",
        description: `Đã gửi email tới ${selectedCandidates.length} ứng viên`,
      });
    }, 2000);
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
          <div className="lg:col-span-1 space-y-6">
            <CandidateList
              candidates={filteredCandidates}
              selectedCandidates={selectedCandidates}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onSelectCandidate={handleSelectCandidate}
              onSelectAllCandidates={handleSelectAllCandidates}
              onSearchChange={setSearchQuery}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
          
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
                    <EmailComposer
                      templates={templates}
                      companies={companies}
                      filteredJobs={filteredJobs}
                      candidates={candidates}
                      selectedCandidates={selectedCandidates}
                      selectedTemplateId={selectedTemplateId}
                      subject={subject}
                      body={body}
                      selectedCompanyId={selectedCompanyId}
                      position={position}
                      onSelectTemplate={handleSelectTemplate}
                      onCompanyChange={handleCompanyChange}
                      onPositionChange={handlePositionChange}
                      onSubjectChange={setSubject}
                      onBodyChange={setBody}
                      onCopyToClipboard={handleCopyToClipboard}
                    />
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmailSender;
