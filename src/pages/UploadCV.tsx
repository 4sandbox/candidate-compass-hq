
import React, { useState, useCallback, useRef } from 'react';
import { FileText, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

const UploadCV = () => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    
    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "File không hợp lệ",
          description: `${file.name} không phải là file PDF, DOCX hoặc hình ảnh`,
          variant: "destructive",
        });
        return;
      }
      
      const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      const newFile: UploadedFile = {
        id,
        file,
        status: 'uploading',
        progress: 0
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 20);
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Simulate processing delay after upload completes
          setTimeout(() => {
            setUploadedFiles(prev => 
              prev.map(f => 
                f.id === id 
                  ? { ...f, status: Math.random() > 0.1 ? 'success' : 'error', progress: 100 } 
                  : f
              )
            );
            
            const success = Math.random() > 0.1;
            if (success) {
              toast({
                title: "Upload thành công",
                description: `${file.name} đã được tải lên thành công`,
              });
            } else {
              toast({
                title: "Upload thất bại",
                description: `Không thể xử lý ${file.name}`,
                variant: "destructive",
              });
            }
          }, 500);
        } else {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === id ? { ...f, progress } : f
            )
          );
        }
      }, 200);
    });
  }, [toast]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  }, [processFiles]);
  
  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };
  
  const handleBrowse = () => {
    fileInputRef.current?.click();
  };
  
  const handleProceedToResults = () => {
    // In a real app, this would navigate to the results page or trigger the next step
    toast({
      title: "Đang xử lý",
      description: "Dữ liệu từ CV đang được phân tích...",
    });
    
    // Simulate processing delay
    setTimeout(() => {
      window.location.href = '/candidates';
    }, 1500);
  };
  
  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (extension === 'docx' || extension === 'doc') {
      return <FileText className="h-6 w-6 text-blue-500" />;
    } else {
      return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const hasSuccessFiles = uploadedFiles.some(file => file.status === 'success');

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Upload CV</h1>
        
        <div 
          className={cn(
            "dropzone",
            isDragging && "active",
            uploadedFiles.length > 0 && "mb-6"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            multiple 
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Kéo thả hoặc tải lên CV</h3>
              <p className="text-sm text-gray-500 mt-1">
                Hỗ trợ định dạng PDF, DOCX và hình ảnh (JPG, PNG)
              </p>
            </div>
            <Button type="button" onClick={handleBrowse}>
              Chọn file
            </Button>
          </div>
        </div>
        
        {uploadedFiles.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="text-sm font-medium">Danh sách file ({uploadedFiles.length})</h3>
            </div>
            <ul className="divide-y">
              {uploadedFiles.map(file => (
                <li key={file.id} className="px-4 py-3 flex items-center">
                  <div className="mr-3">
                    {getFileTypeIcon(file.file.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.file.name}</p>
                    <div className="flex items-center mt-1">
                      {file.status === 'uploading' ? (
                        <div className="w-full max-w-xs">
                          <Progress value={file.progress} className="h-1.5" />
                        </div>
                      ) : file.status === 'success' ? (
                        <span className="flex items-center text-xs text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          OCR thành công
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-red-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Xử lý thất bại
                        </span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="ml-2 text-gray-400 hover:text-gray-500"
                    onClick={() => handleRemoveFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 px-4 py-3 border-t flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {uploadedFiles.filter(f => f.status === 'success').length} CV xử lý thành công
              </p>
              <Button 
                onClick={handleProceedToResults} 
                disabled={!hasSuccessFiles}
              >
                Xem kết quả
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UploadCV;
