
import { useState } from "react";
import { Header } from "@/components/Header";
import { JobDescriptionForm } from "@/components/JobDescriptionForm";
import { ResumeUploader } from "@/components/ResumeUploader";
import { CandidateRankings } from "@/components/CandidateRankings";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, FileText, TrendingUp } from "lucide-react";
import { analyzeResumes } from "@/utils/analysisEngine";
import { useToast } from "@/hooks/use-toast";

export interface Resume {
  id: string;
  fileName: string;
  content: string;
  uploadedAt: Date;
}

export interface AnalysisResult {
  resumeId: string;
  fileName: string;
  overallScore: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  keyStrengths: string[];
  gaps: string[];
  recommendation: string;
  analysis: string;
}

const Index = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'setup' | 'results'>('setup');
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please enter a job description before analyzing.",
        variant: "destructive",
      });
      return;
    }
    
    if (resumes.length === 0) {
      toast({
        title: "No Resumes Uploaded",
        description: "Please upload at least one resume to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    if (jobDescription.length < 100) {
      toast({
        title: "Job Description Too Short",
        description: "Please provide a more detailed job description (minimum 100 characters) for better analysis.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Add a realistic delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Use the enhanced analysis engine
      const results = analyzeResumes(resumes, jobDescription);
      
      setAnalysisResults(results);
      setCurrentStep('results');
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${results.length} resume${results.length > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the resumes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('setup');
    setJobDescription("");
    setResumes([]);
    setAnalysisResults([]);
    toast({
      title: "New Analysis Started",
      description: "Ready for a new analysis session.",
    });
  };

  const canAnalyze = jobDescription.trim().length >= 100 && resumes.length > 0;

  if (currentStep === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Analysis Results</h1>
              <p className="text-slate-600">
                AI-powered analysis of {analysisResults.length} candidate{analysisResults.length > 1 ? 's' : ''}
              </p>
            </div>
            <Button onClick={handleStartOver} variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              New Analysis
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CandidateRankings results={analysisResults} />
            </div>
            <div>
              <AnalysisResults results={analysisResults} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">AI Resume Screener</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Upload resumes and job descriptions to get AI-powered candidate rankings and insights
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">Job Description</h2>
            </div>
            <JobDescriptionForm 
              value={jobDescription}
              onChange={setJobDescription}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">Upload Resumes</h2>
            </div>
            <ResumeUploader 
              resumes={resumes}
              onResumesChange={setResumes}
            />
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            size="lg"
            className={`px-8 py-3 text-lg font-medium rounded-xl shadow-lg transition-all duration-200 ${
              canAnalyze 
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Analyzing {resumes.length} Resume{resumes.length > 1 ? 's' : ''}...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-3" />
                Analyze & Rank Candidates
              </>
            )}
          </Button>
          
          <div className="mt-4 space-y-2">
            {!jobDescription.trim() && (
              <p className="text-red-500 text-sm">⚠️ Job description is required</p>
            )}
            {jobDescription.trim() && jobDescription.length < 100 && (
              <p className="text-yellow-600 text-sm">
                ⚠️ Job description should be at least 100 characters ({jobDescription.length}/100)
              </p>
            )}
            {resumes.length === 0 && (
              <p className="text-red-500 text-sm">⚠️ At least one resume is required</p>
            )}
            {canAnalyze && (
              <p className="text-green-600 text-sm">✅ Ready to analyze!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
