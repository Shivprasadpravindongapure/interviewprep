import React, { useState, useEffect } from 'react';
import { userAPI, assessmentAPI } from '../services/api';
import type { Progress, Submission } from '../types';

const Progress: React.FC = () => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const [progressResponse, submissionsResponse] = await Promise.all([
        userAPI.getProgress(),
        assessmentAPI.getMySubmissions()
      ]);

      setProgress(progressResponse.data.progress);
      setSubmissions(submissionsResponse.data);
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading progress...</div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 70) return '🎉';
    if (score >= 50) return '👍';
    return '📚';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Progress</h1>

        {/* Overall Readiness */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Overall Readiness</h2>
          <div className="text-center">
            <div className="text-6xl mb-4">{getScoreEmoji(progress?.overallReadiness || 0)}</div>
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(progress?.overallReadiness || 0)}`}>
              {progress?.overallReadiness || 0}%
            </div>
            <p className="text-gray-600">
              {progress?.overallReadiness && progress.overallReadiness >= 70 
                ? 'You\'re doing great! Keep it up!' 
                : progress?.overallReadiness && progress.overallReadiness >= 50
                ? 'Good progress! Room for improvement.'
                : 'Keep practicing! You\'ll get there.'}
            </p>
          </div>
        </div>

        {/* Subject-wise Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 DSA Progress</h3>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getScoreColor(progress?.dsaScore || 0)}`}>
                {progress?.dsaScore || 0}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress?.dsaScore || 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🌐 Web Development</h3>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getScoreColor(progress?.webScore || 0)}`}>
                {progress?.webScore || 0}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress?.webScore || 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🗄️ DBMS</h3>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getScoreColor(progress?.dbmsScore || 0)}`}>
                {progress?.dbmsScore || 0}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress?.dbmsScore || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📈 This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sessions Completed</span>
                <span className="font-bold">{progress?.totalSessions || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Score</span>
                <span className={`font-bold ${getScoreColor(progress?.averageScore || 0)}`}>
                  {(progress?.averageScore || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">⚠️ Weak Areas</h3>
            {progress?.weakAreas && progress.weakAreas.length > 0 ? (
              <div className="space-y-2">
                {progress.weakAreas.map((area, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-yellow-500 mr-2">⚠️</span>
                    <span className="text-gray-700">{area}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No weak areas identified yet. Keep practicing!</p>
            )}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Recent Activity</h3>
          {submissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No assessments completed yet. Start practicing to see your progress!</p>
          ) : (
            <div className="space-y-3">
              {submissions.slice(0, 10).map((submission) => (
                <div key={submission._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {typeof submission.assessmentId === 'object' 
                          ? submission.assessmentId.title 
                          : 'Assessment'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(submission.createdAt).toLocaleDateString()} • {submission.timeSpent / 1000 / 60} min
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(submission.percentage)}`}>
                        {submission.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {submission.score}/{submission.totalMarks}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Recommendations</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-blue-800">
                {progress?.overallReadiness && progress.overallReadiness < 50 
                  ? 'Focus on fundamentals and practice daily for at least 30 minutes'
                  : progress?.overallReadiness && progress.overallReadiness < 70
                  ? 'You\'re making good progress! Try medium difficulty problems'
                  : 'Excellent work! Challenge yourself with hard problems and mock interviews'}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-blue-800">
                Review your incorrect answers to understand concepts better
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-blue-800">
                Practice consistently - even 15 minutes daily makes a big difference
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Progress;
