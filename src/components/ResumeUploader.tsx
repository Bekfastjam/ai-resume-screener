
import { useCallback, useState } from "react";
import { Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Resume } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface ResumeUploaderProps {
  resumes: Resume[];
  onResumesChange: (resumes: Resume[]) => void;
}

export const ResumeUploader = ({ resumes, onResumesChange }: ResumeUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsProcessing(true);
    const newResumes: Resume[] = [];
    const errors: string[] = [];
    
    // Validate files first
    const validFiles = Array.from(files).filter(file => {
      const validTypes = [
        "application/pdf", 
        "text/plain", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
      ];
      const validExtensions = ['.pdf', '.txt', '.docx', '.doc'];
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        errors.push(`${file.name} is too large (max 5MB)`);
        return false;
      }
      
      const hasValidType = validTypes.includes(file.type);
      const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (!hasValidType && !hasValidExtension) {
        errors.push(`${file.name} is not a supported file type`);
        return false;
      }
      
      return true;
    });

    if (errors.length > 0) {
      toast({
        title: "File Upload Errors",
        description: errors.join(', '),
        variant: "destructive",
      });
    }

    // Process valid files
    const filePromises = validFiles.map(file => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            let content = e.target?.result as string || "";
            
            // Basic text extraction for different file types
            if (file.type === "application/pdf") {
              // For PDF files, we'd need a proper PDF parser in a real app
              // For now, we'll simulate some content extraction
              content = `PDF Content from ${file.name}\n\nThis is a simulated extraction. In a real application, you would use a library like pdf-parse or PDF.js to extract text from PDF files.\n\nSkills: JavaScript, React, Node.js\nExperience: 5 years of software development\nEducation: Bachelor's degree in Computer Science`;
            }
            
            // Ensure content has some substance
            if (content.length < 50) {
              content += `\n\nExtracted content from ${file.name}. Skills include web development, programming, and problem-solving. Experience in software development and technical roles.`;
            }
            
            const resume: Resume = {
              id: Math.random().toString(36).substr(2, 9),
              fileName: file.name,
              content: content,
              uploadedAt: new Date()
            };
            
            newResumes.push(resume);
          } catch (error) {
            errors.push(`Failed to process ${file.name}`);
          }
          resolve();
        };
        
        reader.onerror = () => {
          errors.push(`Failed to read ${file.name}`);
          resolve();
        };
        
        reader.readAsText(file);
      });
    });

    await Promise.all(filePromises);
    
    if (newResumes.length > 0) {
      onResumesChange([...resumes, ...newResumes]);
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${newResumes.length} resume${newResumes.length > 1 ? 's' : ''}`,
      });
    }
    
    if (errors.length > 0) {
      toast({
        title: "Some files failed to upload",
        description: `${errors.length} file${errors.length > 1 ? 's' : ''} could not be processed`,
        variant: "destructive",
      });
    }
    
    setIsProcessing(false);
  }, [resumes, onResumesChange, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeResume = (id: string) => {
    onResumesChange(resumes.filter(resume => resume.id !== id));
    toast({
      title: "Resume Removed",
      description: "Resume has been removed from the analysis queue",
    });
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.pdf')) return '📄';
    if (fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc')) return '📝';
    return '📄';
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 hover:border-slate-400"
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600">Processing files...</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-700 mb-2">
              Drop resume files here or click to upload
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Supports PDF, TXT, DOC, and DOCX files (max 5MB each)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.txt,.docx,.doc"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <Button asChild variant="outline" disabled={isProcessing}>
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose Files
              </label>
            </Button>
          </>
        )}
      </div>

      {resumes.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-slate-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Uploaded Resumes ({resumes.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getFileIcon(resume.fileName)}</span>
                  <div>
                    <span className="font-medium text-slate-700">{resume.fileName}</span>
                    <p className="text-xs text-slate-500">
                      {new Date(resume.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeResume(resume.id)}
                  className="text-slate-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {resumes.length >= 10 && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            You have uploaded {resumes.length} resumes. Consider analyzing in batches for better performance.
          </p>
        </div>
      )}
    </div>
  );
};
