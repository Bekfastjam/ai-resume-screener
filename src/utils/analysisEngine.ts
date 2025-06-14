
import { Resume, AnalysisResult } from "@/pages/Index";
import { parseResumeContent, ParsedResume } from "./resumeParser";

interface JobRequirements {
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: number; // in years
  educationLevel: string;
  keywords: string[];
}

const extractJobRequirements = (jobDescription: string): JobRequirements => {
  const text = jobDescription.toLowerCase();
  
  // Extract years of experience
  const experienceMatch = text.match(/(\d+)\s*(?:\+)?\s*years?\s*(?:of\s*)?(?:experience|exp)/);
  const experienceLevel = experienceMatch ? parseInt(experienceMatch[1]) : 0;
  
  // Common technical skills
  const allSkills = [
    'javascript', 'typescript', 'react', 'angular', 'vue', 'node.js', 'python', 'java',
    'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'html', 'css', 'sass', 'less',
    'mongodb', 'postgresql', 'mysql', 'redis', 'aws', 'azure', 'gcp', 'docker',
    'kubernetes', 'jenkins', 'gitlab', 'github', 'git', 'linux', 'windows',
    'agile', 'scrum', 'kanban', 'jira', 'confluence', 'slack', 'teams'
  ];
  
  const foundSkills = allSkills.filter(skill => text.includes(skill));
  
  // Determine required vs preferred skills
  const requiredPatterns = [
    /(?:required|must have|essential|mandatory)[\s\S]*?(?:skills?|experience|knowledge)/gi,
    /(?:minimum|at least)[\s\S]*?(?:years?|experience)/gi
  ];
  
  const preferredPatterns = [
    /(?:preferred|nice to have|bonus|plus|advantage)[\s\S]*?(?:skills?|experience|knowledge)/gi
  ];
  
  // Simple heuristic: first half of found skills are required, rest are preferred
  const midpoint = Math.ceil(foundSkills.length / 2);
  const requiredSkills = foundSkills.slice(0, midpoint);
  const preferredSkills = foundSkills.slice(midpoint);
  
  // Determine education level
  let educationLevel = 'any';
  if (text.includes('bachelor') || text.includes('b.s') || text.includes('b.a')) {
    educationLevel = 'bachelor';
  }
  if (text.includes('master') || text.includes('m.s') || text.includes('m.a')) {
    educationLevel = 'master';
  }
  if (text.includes('phd') || text.includes('doctorate')) {
    educationLevel = 'phd';
  }
  
  // Extract important keywords
  const keywords = text.match(/\b\w{4,}\b/g)?.slice(0, 20) || [];
  
  return {
    requiredSkills,
    preferredSkills,
    experienceLevel,
    educationLevel,
    keywords
  };
};

const calculateSkillsMatch = (resumeSkills: string[], jobRequirements: JobRequirements): number => {
  const allJobSkills = [...jobRequirements.requiredSkills, ...jobRequirements.preferredSkills];
  if (allJobSkills.length === 0) return 75; // Default score if no skills specified
  
  const matchedRequired = jobRequirements.requiredSkills.filter(skill => 
    resumeSkills.includes(skill)
  ).length;
  
  const matchedPreferred = jobRequirements.preferredSkills.filter(skill => 
    resumeSkills.includes(skill)
  ).length;
  
  const requiredWeight = 0.7;
  const preferredWeight = 0.3;
  
  const requiredScore = jobRequirements.requiredSkills.length > 0 
    ? (matchedRequired / jobRequirements.requiredSkills.length) * 100 * requiredWeight
    : 0;
    
  const preferredScore = jobRequirements.preferredSkills.length > 0
    ? (matchedPreferred / jobRequirements.preferredSkills.length) * 100 * preferredWeight
    : 0;
  
  return Math.min(100, requiredScore + preferredScore + (resumeSkills.length > 5 ? 10 : 0));
};

const calculateExperienceMatch = (resumeExp: string[], jobRequirements: JobRequirements): number => {
  // Extract years from resume experience
  const yearMatches = resumeExp.join(' ').match(/(\d+)\s*(?:years?|yrs?)/g);
  const resumeYears = yearMatches ? 
    Math.max(...yearMatches.map(match => parseInt(match.match(/\d+/)?.[0] || '0'))) : 0;
  
  if (jobRequirements.experienceLevel === 0) return 80; // No specific requirement
  
  const ratio = resumeYears / jobRequirements.experienceLevel;
  if (ratio >= 1.2) return 95; // Exceeds requirement
  if (ratio >= 1.0) return 90; // Meets requirement
  if (ratio >= 0.8) return 75; // Close to requirement
  if (ratio >= 0.5) return 60; // Some experience
  return 40; // Limited experience
};

const calculateEducationMatch = (resumeEdu: string[], jobRequirements: JobRequirements): number => {
  if (jobRequirements.educationLevel === 'any') return 85;
  
  const eduText = resumeEdu.join(' ').toLowerCase();
  
  const levels = {
    'phd': 4,
    'master': 3,
    'bachelor': 2,
    'associate': 1,
    'any': 0
  };
  
  let resumeLevel = 0;
  if (eduText.includes('phd') || eduText.includes('doctorate')) resumeLevel = 4;
  else if (eduText.includes('master') || eduText.includes('m.s') || eduText.includes('m.a')) resumeLevel = 3;
  else if (eduText.includes('bachelor') || eduText.includes('b.s') || eduText.includes('b.a')) resumeLevel = 2;
  else if (eduText.includes('associate') || eduText.includes('diploma')) resumeLevel = 1;
  
  const requiredLevel = levels[jobRequirements.educationLevel as keyof typeof levels] || 0;
  
  if (resumeLevel >= requiredLevel) return 90;
  if (resumeLevel === requiredLevel - 1) return 70;
  return 50;
};

export const analyzeResumes = (resumes: Resume[], jobDescription: string): AnalysisResult[] => {
  const jobRequirements = extractJobRequirements(jobDescription);
  
  const results: AnalysisResult[] = resumes.map(resume => {
    const parsedResume = parseResumeContent(resume.content, resume.fileName);
    
    const skillsMatch = calculateSkillsMatch(parsedResume.skills, jobRequirements);
    const experienceMatch = calculateExperienceMatch(parsedResume.experience, jobRequirements);
    const educationMatch = calculateEducationMatch(parsedResume.education, jobRequirements);
    
    const overallScore = Math.round(
      (skillsMatch * 0.4) + (experienceMatch * 0.35) + (educationMatch * 0.25)
    );
    
    // Generate key strengths
    const keyStrengths: string[] = [];
    if (skillsMatch > 80) keyStrengths.push("Strong technical skill alignment");
    if (experienceMatch > 80) keyStrengths.push("Excellent experience level match");
    if (educationMatch > 80) keyStrengths.push("Strong educational background");
    if (parsedResume.skills.length > 8) keyStrengths.push("Diverse technical skill set");
    if (parsedResume.experience.length > 3) keyStrengths.push("Comprehensive work experience");
    
    // Generate gaps
    const gaps: string[] = [];
    if (skillsMatch < 60) gaps.push("Limited relevant technical skills");
    if (experienceMatch < 60) gaps.push("Experience level below requirements");
    if (educationMatch < 60) gaps.push("Educational background may not meet requirements");
    if (parsedResume.skills.length < 3) gaps.push("Limited technical skill diversity");
    
    // Generate recommendation
    let recommendation: string;
    if (overallScore >= 85) recommendation = "Excellent match - Priority candidate for interview";
    else if (overallScore >= 75) recommendation = "Strong candidate - Recommend for interview";
    else if (overallScore >= 65) recommendation = "Good potential - Consider for interview";
    else if (overallScore >= 50) recommendation = "Moderate fit - Review carefully";
    else recommendation = "May not be suitable for this role";
    
    // Generate detailed analysis
    const analysis = `Candidate scored ${overallScore}% overall match. ${
      skillsMatch > 70 ? 'Technical skills are well-aligned with requirements.' : 'Technical skills need strengthening.'
    } ${
      experienceMatch > 70 ? 'Experience level meets expectations.' : 'Experience level may be below ideal.'
    } ${
      educationMatch > 70 ? 'Educational background is appropriate.' : 'Educational requirements may not be fully met.'
    }`;
    
    return {
      resumeId: resume.id,
      fileName: resume.fileName,
      overallScore,
      skillsMatch: Math.round(skillsMatch),
      experienceMatch: Math.round(experienceMatch),
      educationMatch: Math.round(educationMatch),
      keyStrengths: keyStrengths.length > 0 ? keyStrengths : ["Candidate shows potential"],
      gaps: gaps.length > 0 ? gaps : ["No significant gaps identified"],
      recommendation,
      analysis
    };
  });
  
  // Sort by overall score
  return results.sort((a, b) => b.overallScore - a.overallScore);
};
