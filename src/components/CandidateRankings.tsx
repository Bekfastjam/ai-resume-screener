
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, TrendingDown, User, Award } from "lucide-react";
import { AnalysisResult } from "@/pages/Index";

interface CandidateRankingsProps {
  results: AnalysisResult[];
}

export const CandidateRankings = ({ results }: CandidateRankingsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 85) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Award className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <TrendingUp className="w-5 h-5 text-green-600" />;
    return <User className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Star className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-slate-800">Candidate Rankings</h2>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={result.resumeId} className="p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getRankIcon(index)}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    #{index + 1} - {result.fileName}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {result.recommendation}
                  </p>
                </div>
              </div>
              <Badge variant={getScoreBadgeVariant(result.overallScore)} className="text-sm font-bold">
                {result.overallScore}% Match
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">Skills</span>
                  <span className={`text-sm font-semibold ${getScoreColor(result.skillsMatch)}`}>
                    {result.skillsMatch}%
                  </span>
                </div>
                <Progress value={result.skillsMatch} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">Experience</span>
                  <span className={`text-sm font-semibold ${getScoreColor(result.experienceMatch)}`}>
                    {result.experienceMatch}%
                  </span>
                </div>
                <Progress value={result.experienceMatch} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">Education</span>
                  <span className={`text-sm font-semibold ${getScoreColor(result.educationMatch)}`}>
                    {result.educationMatch}%
                  </span>
                </div>
                <Progress value={result.educationMatch} className="h-2" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Key Strengths
                </h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  {result.keyStrengths.slice(0, 3).map((strength, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Areas for Consideration
                </h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  {result.gaps.slice(0, 2).map((gap, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600 italic">
                "{result.analysis}"
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
