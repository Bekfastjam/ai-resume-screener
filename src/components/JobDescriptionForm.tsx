
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";

interface JobDescriptionFormProps {
  value: string;
  onChange: (value: string) => void;
}

export const JobDescriptionForm = ({ value, onChange }: JobDescriptionFormProps) => {
  const characterCount = value.length;
  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
  const isValid = characterCount >= 100;
  const isGoodLength = characterCount >= 200;

  const getValidationColor = () => {
    if (isGoodLength) return "text-green-600";
    if (isValid) return "text-yellow-600";
    return "text-red-500";
  };

  const getValidationIcon = () => {
    if (isGoodLength) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (isValid) return <CheckCircle className="w-4 h-4 text-yellow-600" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="job-description" className="text-base font-medium text-slate-700">
          Paste your job description here *
        </Label>
        <p className="text-sm text-slate-500 mt-1">
          Include required skills, experience level, education requirements, and key responsibilities for accurate analysis
        </p>
      </div>
      
      <Textarea
        id="job-description"
        placeholder="e.g., We are seeking a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js. The ideal candidate should have:

Required Skills:
- Proficiency in JavaScript/TypeScript
- Experience with React and modern web frameworks
- Knowledge of REST APIs and database design
- Experience with cloud platforms (AWS, Azure, or GCP)

Preferred Qualifications:
- Bachelor's degree in Computer Science or related field
- Experience with agile development methodologies
- Strong problem-solving and communication skills
- Leadership experience or mentoring junior developers

Responsibilities:
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Code review and maintain high code quality standards..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`min-h-[250px] text-base resize-none transition-colors ${
          isValid 
            ? 'focus:ring-2 focus:ring-green-500 focus:border-transparent border-green-300' 
            : 'focus:ring-2 focus:ring-red-500 focus:border-transparent border-red-300'
        }`}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span>{characterCount} characters</span>
          <span>{wordCount} words</span>
        </div>
        
        <div className={`flex items-center gap-2 text-sm ${getValidationColor()}`}>
          {getValidationIcon()}
          <span>
            {isGoodLength 
              ? "Excellent detail level" 
              : isValid 
                ? "Good - more detail recommended" 
                : "Minimum 100 characters required"
            }
          </span>
        </div>
      </div>

      {!isValid && characterCount > 0 && (
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800">
            <strong>Tip:</strong> Include specific skills, experience requirements, education level, and key responsibilities to get more accurate candidate matching.
          </p>
        </div>
      )}

      {isValid && !isGoodLength && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Suggestion:</strong> Consider adding more details about preferred qualifications, company culture, or specific technologies for even better analysis results.
          </p>
        </div>
      )}

      {isGoodLength && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Great!</strong> Your job description has sufficient detail for accurate candidate analysis.
          </p>
        </div>
      )}
    </div>
  );
};
