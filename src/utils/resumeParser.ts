
export interface ParsedResume {
  skills: string[];
  experience: string[];
  education: string[];
  rawText: string;
}

export const parseResumeContent = (content: string, fileName: string): ParsedResume => {
  const text = content.toLowerCase();
  
  // Common skills to look for
  const skillKeywords = [
    'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'c++', 'html', 'css',
    'angular', 'vue', 'express', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'project management', 'leadership', 'communication',
    'problem solving', 'teamwork', 'analytical', 'creative', 'detail-oriented'
  ];
  
  const foundSkills = skillKeywords.filter(skill => text.includes(skill));
  
  // Extract experience-related content
  const experiencePatterns = [
    /(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/g,
    /worked\s+(?:as|at|for)\s+[^.]+/g,
    /experience\s+(?:in|with|as)\s+[^.]+/g
  ];
  
  const experience: string[] = [];
  experiencePatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      experience.push(...matches.slice(0, 3)); // Limit to 3 matches per pattern
    }
  });
  
  // Extract education-related content
  const educationPatterns = [
    /(?:bachelor|master|phd|doctorate|degree|diploma|certificate)\s+[^.]+/gi,
    /(?:university|college|institute|school)\s+[^.]+/gi,
    /(?:b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|ph\.?d\.?)\s+[^.]+/gi
  ];
  
  const education: string[] = [];
  educationPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      education.push(...matches.slice(0, 2)); // Limit to 2 matches per pattern
    }
  });
  
  return {
    skills: foundSkills,
    experience: experience.slice(0, 5), // Limit to 5 experience items
    education: education.slice(0, 3), // Limit to 3 education items
    rawText: content
  };
};
