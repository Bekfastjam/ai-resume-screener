
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingUp, Award, Target } from "lucide-react";
import { AnalysisResult } from "@/pages/Index";

interface AnalysisResultsProps {
  results: AnalysisResult[];
}

export const AnalysisResults = ({ results }: AnalysisResultsProps) => {
  const averageScore = results.reduce((sum, result) => sum + result.overallScore, 0) / results.length;
  const topCandidates = results.filter(result => result.overallScore >= 80).length;
  const goodCandidates = results.filter(result => result.overallScore >= 70 && result.overallScore < 80).length;
  const weakCandidates = results.filter(result => result.overallScore < 70).length;

  const chartData = results.slice(0, 5).map((result, index) => ({
    name: `#${index + 1}`,
    score: result.overallScore,
    skills: result.skillsMatch,
    experience: result.experienceMatch,
    education: result.educationMatch,
  }));

  const distributionData = [
    { name: "Excellent (80%+)", value: topCandidates, color: "#10b981" },
    { name: "Good (70-79%)", value: goodCandidates, color: "#f59e0b" },
    { name: "Needs Review (<70%)", value: weakCandidates, color: "#ef4444" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-800">Analysis Overview</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-slate-800">{results.length}</p>
              <p className="text-sm text-slate-600">Total Candidates</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-slate-800">{topCandidates}</p>
              <p className="text-sm text-slate-600">Top Matches</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-slate-800">{averageScore.toFixed(1)}%</p>
              <p className="text-sm text-slate-600">Average Score</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-slate-800">{goodCandidates}</p>
              <p className="text-sm text-slate-600">Good Matches</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Score Distribution Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Score Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Top 5 Candidates Comparison */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Top 5 Candidates Comparison</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recommendations</h3>
        <div className="space-y-3">
          {topCandidates > 0 && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Priority:</strong> Schedule interviews with top {topCandidates} candidate{topCandidates > 1 ? 's' : ''} (80%+ match)
              </p>
            </div>
          )}
          {goodCandidates > 0 && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Consider:</strong> Review {goodCandidates} good candidate{goodCandidates > 1 ? 's' : ''} for backup options
              </p>
            </div>
          )}
          {weakCandidates > 0 && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                <strong>Review:</strong> {weakCandidates} candidate{weakCandidates > 1 ? 's' : ''} may not meet minimum requirements
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
