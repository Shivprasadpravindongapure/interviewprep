import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { assessmentAPI } from '../services/api';
import type { Assessment, Question } from '../types';

interface InterviewQuestion extends Question {
  followUp?: string[];
  evaluationCriteria?: string[];
}

const AIInterview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (id) {
      fetchAssessment();
    }
  }, [id]);

  useEffect(() => {
    if (assessment && !isInterviewComplete) {
      setTimeLeft(assessment.timeLimit * 60 * 1000);
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            completeInterview();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [assessment, isInterviewComplete]);

  const fetchAssessment = async () => {
    try {
      const response = await assessmentAPI.getAssessment(id!);
      setAssessment(response.data);
      setQuestions(response.data.questions as InterviewQuestion[]);
    } catch (error) {
      console.error('Failed to fetch assessment:', error);
      navigate('/practice');
    }
  };

  const startInterview = () => {
    setIsInterviewStarted(true);
    setStartTime(Date.now());
    startRecording();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      });

      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        setRecordedChunks(chunks);
        uploadRecording(new Blob(chunks, { type: 'video/webm' }));
      };

      mediaRecorderRef.current = recorder;
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);

      // Simulate AI speech recognition
      simulateTranscription();
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Please allow camera and microphone access to start the interview');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const simulateTranscription = () => {
    // Mock transcription - in real app, this would use speech-to-text API
    const mockTranscripts = [
      "I would approach this problem by first understanding the requirements...",
      "The key consideration here is scalability and performance...",
      "I believe the best solution would involve using a hash map for O(1) lookups...",
      "This reminds me of a similar problem I worked on in my previous project...",
      "I would consider edge cases and handle them appropriately in my solution..."
    ];
    
    const interval = setInterval(() => {
      if (!isRecording) {
        clearInterval(interval);
        return;
      }
      
      const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setTranscript(prev => prev + ' ' + randomTranscript);
    }, 3000);
  };

  const uploadRecording = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('video', blob, `interview-${Date.now()}.webm`);
      formData.append('assessmentId', id!);
      
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/recordings/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
    } catch (error) {
      console.error('Failed to upload recording:', error);
    }
  };

  const nextQuestion = () => {
    const currentAnswer = transcript.trim();
    setAnswers([...answers, currentAnswer]);
    setTranscript('');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeInterview();
    }
  };

  const completeInterview = async () => {
    stopRecording();
    setIsInterviewComplete(true);
    
    const finalAnswers = [...answers, transcript.trim()];
    
    try {
      const totalTime = Date.now() - startTime;
      
      // Generate AI feedback (mock for now)
      const aiFeedback = generateAIFeedback(questions, finalAnswers);
      setFeedback(aiFeedback);
      
      const response = await assessmentAPI.submitAssessment({
        assessmentId: assessment!._id,
        answers: questions.map((q, index) => ({
          questionId: q._id,
          answer: finalAnswers[index] || '',
          isCorrect: true, // Interview questions don't have right/wrong answers
          timeSpent: totalTime / questions.length
        })),
        timeSpent: totalTime
      });
      
    } catch (error) {
      console.error('Failed to submit interview:', error);
    }
  };

  const generateAIFeedback = (questions: InterviewQuestion[], answers: string[]) => {
    // Mock AI feedback generation
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];
    let score = 75;
    
    // Analyze responses
    const totalWords = answers.join(' ').split(' ').length;
    const avgWordsPerAnswer = totalWords / answers.length;
    
    if (avgWordsPerAnswer > 50) {
      strengths.push('Detailed and comprehensive answers');
      score += 5;
    } else {
      weaknesses.push('Answers could be more detailed');
      recommendations.push('Provide more specific examples in your responses');
      score -= 5;
    }
    
    if (answers.some(a => a.includes('data structure') || a.includes('algorithm'))) {
      strengths.push('Good technical knowledge');
      score += 5;
    }
    
    if (answers.some(a => a.includes('scalability') || a.includes('performance'))) {
      strengths.push('Considers system design aspects');
      score += 5;
    }
    
    recommendations.push('Practice explaining your thought process clearly');
    recommendations.push('Include more real-world examples');
    
    return {
      score: Math.min(100, Math.max(0, score)),
      strengths,
      weaknesses,
      recommendations,
      detailedFeedback: {
        communication: avgWordsPerAnswer > 30 ? 'Good' : 'Needs Improvement',
        technicalKnowledge: strengths.length > 1 ? 'Strong' : 'Developing',
        problemSolving: 'Good',
        confidence: 'Moderate'
      }
    };
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading AI interview...</div>
      </div>
    );
  }

  if (isInterviewComplete && feedback) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Interview Complete!</h1>
              
              <div className="text-6xl mb-4">
                {feedback.score >= 80 ? '🎉' : feedback.score >= 60 ? '👍' : '📚'}
              </div>
              
              <div className="text-2xl font-bold text-blue-600 mb-2">
                Overall Score: {feedback.score}/100
              </div>
              
              <p className="text-gray-600 mb-8">
                Here's your AI-powered feedback on your performance
              </p>
            </div>

            {/* Detailed Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-900 mb-3">💪 Strengths</h3>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-center text-green-800">
                      <span className="mr-2">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-yellow-900 mb-3">📝 Areas for Improvement</h3>
                <ul className="space-y-2">
                  {feedback.weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-center text-yellow-800">
                      <span className="mr-2">•</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Detailed Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(feedback.detailedFeedback).map(([key, value]: [string, any]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-blue-600 capitalize">
                      {value}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-3">🎯 Recommendations</h3>
              <ul className="space-y-2">
                {feedback.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start text-blue-800">
                    <span className="mr-2">→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/practice')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Practice More
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {!isInterviewStarted ? (
          /* Interview Setup */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">AI Mock Interview</h1>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Interview Details</h2>
                <div className="space-y-2 text-blue-800">
                  <div><strong>Duration:</strong> {assessment.timeLimit} minutes</div>
                  <div><strong>Questions:</strong> {questions.length}</div>
                  <div><strong>Format:</strong> Video interview with AI analysis</div>
                  <div><strong>Topics:</strong> {assessment.topics.join(', ')}</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">📋 Before You Start</h3>
                <ul className="space-y-2 text-yellow-800">
                  <li>• Ensure you're in a quiet, well-lit environment</li>
                  <li>• Test your camera and microphone</li>
                  <li>• Have a stable internet connection</li>
                  <li>• The interview will be recorded for AI analysis</li>
                  <li>• Speak clearly and explain your thought process</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🎥 Camera Test</h3>
                <div className="flex justify-center mb-4">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={320}
                    height={240}
                    className="rounded-lg border-2 border-gray-300"
                  />
                </div>
                <p className="text-center text-gray-600 text-sm">
                  Make sure your camera is working and you're clearly visible
                </p>
              </div>

              <button
                onClick={startInterview}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                🚀 Start Interview
              </button>
            </div>
          </div>
        ) : (
          /* Interview Interface */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Feed */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">🎥 Your Video</h2>
                <div className={`flex items-center space-x-2 ${isRecording ? 'text-red-600' : 'text-gray-600'}`}>
                  <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-sm font-medium">
                    {isRecording ? 'Recording' : 'Not Recording'}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <Webcam
                  audio={true}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-lg border-2 border-gray-300"
                />
                
                {/* Timer Overlay */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  ⏱️ {formatTime(timeLeft)}
                </div>
                
                {/* Question Number */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    isRecording 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isRecording ? '⏹️ Pause' : '🔴 Resume'}
                </button>
              </div>
            </div>

            {/* Question and Answer */}
            <div className="space-y-6">
              {/* Current Question */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🤖 AI Interviewer</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-medium">
                    {currentQuestion.text}
                  </p>
                </div>
                
                {currentQuestion.followUp && currentQuestion.followUp.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Follow-up questions to consider:</p>
                    <ul className="space-y-1">
                      {currentQuestion.followUp.map((followUp, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          • {followUp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Live Transcription */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Your Response</h3>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
                  {transcript ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
                  ) : (
                    <p className="text-gray-400 italic">
                      {isRecording ? 'Listening to your response...' : 'Start speaking when ready...'}
                    </p>
                  )}
                </div>
                
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    disabled={!transcript.trim()}
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    onClick={completeInterview}
                    className="mt-4 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Complete Interview ✅
                  </button>
                )}
              </div>

              {/* Progress */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInterview;
