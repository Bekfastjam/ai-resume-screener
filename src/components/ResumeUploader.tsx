
import { useCallback, useState } from "react";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Resume } from "@/pages/Index";

interface ResumeUploaderProps {
  resumes: Resume[];
  onResumesChange: (resumes: Resume[]) => void;
}

export const ResumeUploader = ({ resumes, onResumesChange }: ResumeUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = useCallback((files: FileList) => {
    const newResumes: Resume[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type === "application/pdf" || file.type === "text/plain" || file.name.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const resume: Resume = {
            id: Math.random().toString(36).substr(2, 9),
            fileName: file.name,
            content: e.target?.result as string || "",
            uploadedAt: new Date()
          };
          newResumes.push(resume);
          
          if (newResumes.length === files.length) {
            onResumesChange([...resumes, ...newResumes]);
          }
        };
        reader.readAsText(file);
      }
    });
  }, [resumes, onResumesChange]);

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
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 hover:border-slate-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-slate-700 mb-2">
          Drop resume files here or click to upload
        </p>
        <p className="text-sm text-slate-500 mb-4">
          Supports PDF, TXT, and DOCX files
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.txt,.docx"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <Button asChild variant="outline">
          <label htmlFor="file-upload" className="cursor-pointer">
            Choose Files
          </label>
        </Button>
      </div>

      {resumes.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-slate-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Uploaded Resumes ({resumes.length})
          </h3>
          <div className="space-y-2">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-slate-700">{resume.fileName}</span>
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
    </div>
  );
};
