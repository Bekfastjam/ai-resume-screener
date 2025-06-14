
import { useState } from "react";
import { Header } from "@/components/Header";
import { JobDescriptionForm } from "@/components/JobDescriptionForm";
import { ResumeUploader } from "@/components/ResumeUploader";
import { CandidateRankings } from "@/components/CandidateRankings";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, FileText, TrendingUp } from "lucide-react";

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

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || resumes.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis - in real implementation, this would call OpenAI API
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResults: AnalysisResult[] = resumes.map((resume, index) => ({
      resumeId: resume.id,
      fileName: resume.fileName,
      overallScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
      skillsMatch: Math.floor(Math.random() * 30) + 70,
      experienceMatch: Math.floor(Math.random() * 35) + 65,
      educationMatch: Math.floor(Math.random() * 25) + 75,
      keyStrengths: [
        "Strong technical background in required technologies",
        "Relevant industry experience",
        "Leadership and team management skills",
        "Excellent communication abilities"
      ].slice(0, Math.floor(Math.random() * 3) + 2),
      gaps: [
        "Limited experience with specific framework mentioned",
        "Could benefit from additional certifications",
        "No direct experience in the industry vertical"
      ].slice(0, Math.floor(Math.random() * 2) + 1),
      recommendation: index < 2 ? "Strong candidate - recommend for interview" : 
                     index < 4 ? "Good candidate - consider for interview" : 
                     "May not be the best fit for this role",
      analysis: `This candidate shows ${index < 2 ? 'excellent' : index < 4 ? 'good' : 'moderate'} alignment with the job requirements. Their background in relevant technologies and experience level make them ${index < 2 ? 'a top choice' : index < 4 ? 'a viable option' : 'worth considering with reservations'} for this position.`
    }));
    
    // Sort by overall score
    mockResults.sort((a, b) => b.overallScore - a.overallScore);
    
    setAnalysisResults(mockResults);
    setIsAnalyzing(false);
    setCurrentStep('results');
  };

  const handleStartOver = () => {
    setCurrentStep('setup');
    setJobDescription("");
    setResumes([]);
    setAnalysisResults([]);
  };

  if (currentStep === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Analysis Results</h1>
              <p className="text-slate-600">AI-powered candidate ranking and insights</p>
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
            disabled={!jobDescription.trim() || resumes.length === 0 || isAnalyzing}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Analyzing Candidates...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-3" />
                Analyze & Rank Candidates
              </>
            )}
          </Button>
          
          {(!jobDescription.trim() || resumes.length === 0) && (
            <p className="text-slate-500 mt-3">
              Please add a job description and upload at least one resume to begin analysis
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
