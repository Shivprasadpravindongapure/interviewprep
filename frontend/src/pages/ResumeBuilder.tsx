import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }>;
  skills: {
    technical: string[];
    languages: string[];
    tools: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  achievements: string[];
}

const ResumeBuilder: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [resumeScore, setResumeScore] = useState(0);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
      location: '',
      website: '',
      linkedin: '',
      github: ''
    },
    summary: '',
    education: [],
    experience: [],
    skills: {
      technical: user?.profile?.skills || [],
      languages: [],
      tools: []
    },
    projects: [],
    achievements: []
  });

  const [activeSection, setActiveSection] = useState('personal');

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }]
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ['']
      }]
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: '',
        technologies: [],
        link: ''
      }]
    }));
  };

  const updateField = (section: string, field: string, value: any, index?: number) => {
    setResumeData(prev => {
      const newData = { ...prev };
      
      if (index !== undefined) {
        (newData[section as keyof ResumeData] as any[])[index][field] = value;
      } else {
        (newData[section as keyof ResumeData] as any)[field] = value;
      }
      
      return newData;
    });
  };

  const generateQRCode = async () => {
    try {
      // Generate QR code with verification link
      const verificationUrl = `https://ecosense-prep.com/verify/${user?.id}`;
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const calculateResumeScore = () => {
    let score = 0;
    const maxScore = 100;
    
    // Personal info (20 points)
    if (resumeData.personalInfo.name && resumeData.personalInfo.email && resumeData.personalInfo.phone) {
      score += 20;
    }
    
    // Summary (10 points)
    if (resumeData.summary.length > 50) {
      score += 10;
    }
    
    // Education (20 points)
    if (resumeData.education.length > 0) {
      score += 20;
    }
    
    // Experience (25 points)
    if (resumeData.experience.length > 0) {
      score += 15;
      if (resumeData.experience.some(exp => exp.description.length > 2)) {
        score += 10;
      }
    }
    
    // Skills (15 points)
    if (resumeData.skills.technical.length > 3) {
      score += 10;
    }
    if (resumeData.skills.languages.length > 0 || resumeData.skills.tools.length > 0) {
      score += 5;
    }
    
    // Projects (10 points)
    if (resumeData.projects.length > 0) {
      score += 10;
    }
    
    setResumeScore(score);
    return score;
  };

  const generateResume = async () => {
    setIsGenerating(true);
    
    try {
      // Calculate score
      const score = calculateResumeScore();
      
      // Generate QR code
      await generateQRCode();
      
      // Save resume data
      await userAPI.updateProfile({
        resume: resumeData,
        resumeScore: score
      });
      
      setIsGenerating(false);
    } catch (error) {
      console.error('Failed to generate resume:', error);
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    // In a real app, this would use a library like jsPDF or html2canvas
    alert('PDF download would be implemented here');
  };

  const sections = [
    { id: 'personal', title: 'Personal Information', icon: '👤' },
    { id: 'summary', title: 'Professional Summary', icon: '📝' },
    { id: 'education', title: 'Education', icon: '🎓' },
    { id: 'experience', title: 'Work Experience', icon: '💼' },
    { id: 'skills', title: 'Skills', icon: '🛠️' },
    { id: 'projects', title: 'Projects', icon: '🚀' },
    { id: 'achievements', title: 'Achievements', icon: '🏆' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resume Builder</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Navigation */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-wrap gap-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {section.icon} {section.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            {activeSection === 'personal' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={resumeData.personalInfo.name}
                    onChange={(e) => updateField('personalInfo', 'name', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => updateField('personalInfo', 'email', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => updateField('personalInfo', 'phone', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => updateField('personalInfo', 'location', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="url"
                    placeholder="Website"
                    value={resumeData.personalInfo.website}
                    onChange={(e) => updateField('personalInfo', 'website', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => updateField('personalInfo', 'linkedin', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="url"
                    placeholder="GitHub"
                    value={resumeData.personalInfo.github}
                    onChange={(e) => updateField('personalInfo', 'github', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 md:col-span-2"
                  />
                </div>
              </div>
            )}

            {/* Professional Summary */}
            {activeSection === 'summary' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Summary</h2>
                <textarea
                  placeholder="Write a compelling summary about yourself (2-3 sentences)"
                  value={resumeData.summary}
                  onChange={(e) => updateField('summary', '', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-600 mt-2">
                  {resumeData.summary.length}/300 characters
                </p>
              </div>
            )}

            {/* Education */}
            {activeSection === 'education' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Education</h2>
                  <button
                    onClick={addEducation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + Add Education
                  </button>
                </div>
                
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => updateField('education', 'institution', e.target.value, index)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => updateField('education', 'degree', e.target.value, index)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Field of Study"
                          value={edu.field}
                          onChange={(e) => updateField('education', 'field', e.target.value, index)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="GPA (optional)"
                          value={edu.gpa}
                          onChange={(e) => updateField('education', 'gpa', e.target.value, index)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="month"
                          placeholder="Start Date"
                          value={edu.startDate}
                          onChange={(e) => updateField('education', 'startDate', e.target.value, index)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="month"
                          placeholder="End Date"
                          value={edu.endDate}
                          onChange={(e) => updateField('education', 'endDate', e.target.value, index)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {activeSection === 'skills' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {resumeData.skills.technical.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                        >
                          {skill}
                          <button
                            onClick={() => {
                              const newSkills = resumeData.skills.technical.filter((_, i) => i !== index);
                              updateField('skills', 'technical', newSkills);
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add technical skill (press Enter)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          updateField('skills', 'technical', [...resumeData.skills.technical, e.currentTarget.value.trim()]);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                    <input
                      type="text"
                      placeholder="e.g., English, Hindi, Spanish (comma separated)"
                      value={resumeData.skills.languages.join(', ')}
                      onChange={(e) => updateField('skills', 'languages', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tools & Technologies</label>
                    <input
                      type="text"
                      placeholder="e.g., Git, Docker, AWS (comma separated)"
                      value={resumeData.skills.tools.join(', ')}
                      onChange={(e) => updateField('skills', 'tools', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={generateResume}
                disabled={isGenerating}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
              >
                {isGenerating ? 'Generating Resume...' : '🚀 Generate Resume with QR Code'}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {/* Resume Score */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resume Score</h3>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  resumeScore >= 80 ? 'text-green-600' : resumeScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {resumeScore}/100
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      resumeScore >= 80 ? 'bg-green-600' : resumeScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${resumeScore}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {resumeScore >= 80 ? 'Excellent!' : resumeScore >= 60 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resume Preview</h3>
              <div
                ref={resumeRef}
                className="border border-gray-200 rounded-lg p-6 bg-white"
                style={{ minHeight: '800px' }}
              >
                {/* Resume Content */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">{resumeData.personalInfo.name}</h1>
                  <div className="text-gray-600 text-sm">
                    {resumeData.personalInfo.email} • {resumeData.personalInfo.phone}
                    {resumeData.personalInfo.location && ` • ${resumeData.personalInfo.location}`}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {resumeData.personalInfo.website && (
                      <a href={resumeData.personalInfo.website} className="text-blue-600 hover:underline">
                        Website
                      </a>
                    )}
                    {resumeData.personalInfo.linkedin && (
                      <a href={resumeData.personalInfo.linkedin} className="text-blue-600 hover:underline ml-2">
                        LinkedIn
                      </a>
                    )}
                    {resumeData.personalInfo.github && (
                      <a href={resumeData.personalInfo.github} className="text-blue-600 hover:underline ml-2">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                {resumeData.summary && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Professional Summary</h2>
                    <p className="text-gray-700">{resumeData.summary}</p>
                  </div>
                )}

                {qrCodeUrl && (
                  <div className="absolute top-4 right-4">
                    <img src={qrCodeUrl} alt="Verification QR Code" className="w-16 h-16" />
                    <p className="text-xs text-gray-500 mt-1">Verify Resume</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={downloadPDF}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  📄 Download PDF
                </button>
                <button
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔗 Share Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
