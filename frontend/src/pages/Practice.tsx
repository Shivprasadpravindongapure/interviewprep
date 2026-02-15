import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../services/api';

interface Assessment {
  _id: string;
  title: string;
  type: string;
  difficulty: string;
  topics: string[];
  questions: any[];
  timeLimit: number;
}

const Practice: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const response = await assessmentAPI.getAssessments();
      if (response.data.success) {
        setAssessments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(assessment => 
    filter === 'all' || assessment.difficulty === filter
  );

  const startAssessment = (assessmentId: string) => {
    navigate(`/assessment/${assessmentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading assessments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Assessments</h1>
          <p className="text-gray-600">Choose an assessment to start practicing</p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('easy')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'easy' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setFilter('medium')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'medium' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setFilter('hard')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'hard' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Hard
            </button>
          </div>
        </div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <div key={assessment._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {assessment.title}
                </h3>
                <div className="flex gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    assessment.difficulty === 'easy' 
                      ? 'bg-green-100 text-green-800'
                      : assessment.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {assessment.difficulty.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {assessment.type.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📝 {assessment.questions.length} questions</p>
                  <p>⏱️ {assessment.timeLimit} minutes</p>
                  <p>🏷️ {assessment.topics.join(', ')}</p>
                </div>
              </div>
              <button
                onClick={() => startAssessment(assessment._id)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Assessment
              </button>
            </div>
          ))}
        </div>

        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No assessments found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
