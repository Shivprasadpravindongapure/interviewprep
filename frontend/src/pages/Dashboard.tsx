import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import { Progress } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await userAPI.getProgress();
        setProgress(response.data.progress);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to ace your interviews? Let's continue your preparation journey.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Readiness</p>
                <p className="text-2xl font-bold text-blue-600">
                  {progress?.overallReadiness || 0}%
                </p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">DSA Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {progress?.dsaScore || 0}%
                </p>
              </div>
              <div className="text-3xl">💻</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Web Dev</p>
                <p className="text-2xl font-bold text-purple-600">
                  {progress?.webScore || 0}%
                </p>
              </div>
              <div className="text-3xl">🌐</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">DBMS</p>
                <p className="text-2xl font-bold text-orange-600">
                  {progress?.dbmsScore || 0}%
                </p>
              </div>
              <div className="text-3xl">🗄️</div>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Today's Task</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>10 MCQs (15 min)</span>
                </div>
                <button
                  onClick={() => navigate('/practice?type=mcq')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Start
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>1 Coding Problem (45 min)</span>
                </div>
                <button
                  onClick={() => navigate('/practice?type=coding')}
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  Start
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span>Review weak areas</span>
                </div>
                <button
                  onClick={() => navigate('/progress')}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Review
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Target Companies</h2>
            <div className="flex flex-wrap gap-2">
              {(user?.profile?.targetCompanies || ['Google', 'Microsoft', 'Amazon', 'Meta']).map((company, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {company}
                </span>
              ))}
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
              + Add Company
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/practice')}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">📚</div>
              <div className="font-medium">Practice</div>
            </button>
            <button
              onClick={() => navigate('/progress')}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">📈</div>
              <div className="font-medium">Progress</div>
            </button>
            <button
              onClick={() => navigate('/resume')}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">📄</div>
              <div className="font-medium">Resume</div>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors"
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="font-medium">Profile</div>
            </button>
          </div>
        </div>

        {/* Weak Areas Alert */}
        {progress?.weakAreas && progress.weakAreas.length > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Weak Areas to Focus On
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  {progress.weakAreas.join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
