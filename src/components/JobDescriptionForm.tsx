
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface JobDescriptionFormProps {
  value: string;
  onChange: (value: string) => void;
}

export const JobDescriptionForm = ({ value, onChange }: JobDescriptionFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="job-description" className="text-base font-medium text-slate-700">
          Paste your job description here
        </Label>
        <p className="text-sm text-slate-500 mt-1">
          Include required skills, experience, and qualifications for best results
        </p>
      </div>
      
      <Textarea
        id="job-description"
        placeholder="e.g., We are looking for a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js. The ideal candidate should have experience with cloud platforms like AWS, strong problem-solving skills, and the ability to work in a fast-paced environment..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] text-base resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{value.length} characters</span>
        <span>Minimum 100 characters recommended</span>
      </div>
    </div>
  );
};
