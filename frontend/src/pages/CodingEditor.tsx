import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { assessmentAPI } from '../services/api';
import type { Assessment, Question } from '../types';

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

interface CodingQuestion extends Question {
  testCases: TestCase[];
  starterCode: {
    javascript?: string;
    python?: string;
    java?: string;
  };
  solution?: {
    javascript?: string;
    python?: string;
    java?: string;
  };
}

const CodingEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [question, setQuestion] = useState<CodingQuestion | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);

  const editorRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (id) {
      fetchAssessment();
    }
  }, [id]);

  useEffect(() => {
    if (assessment && question) {
      setTimeLeft(assessment.timeLimit * 60 * 1000);
      
      // Set starter code based on language
      const starterCode = question.starterCode[language as keyof typeof question.starterCode];
      if (starterCode) {
        setCode(starterCode);
      }
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            handleSubmit();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [assessment, question, language]);

  const fetchAssessment = async () => {
    try {
      const response = await assessmentAPI.getAssessment(id!);
      setAssessment(response.data);
      setQuestion(response.data.questions[0] as CodingQuestion);
    } catch (error) {
      console.error('Failed to fetch assessment:', error);
      navigate('/practice');
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      });

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordingBlob(blob);
        uploadRecording(blob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      // Stop recording when stream ends
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording();
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadRecording = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('video', blob, `recording-${Date.now()}.webm`);
      formData.append('assessmentId', id!);
      
      // Upload recording
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

  const runCode = async () => {
    if (!question) return;
    
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Mock code execution - in real app, this would call a code execution service
      const results = question.testCases.map((testCase, index) => {
        try {
          // Simple evaluation for demo - in production, use proper sandbox
          const mockResult = evaluateCode(code, testCase.input, language);
          
          return {
            testCase: index + 1,
            input: testCase.input,
            expected: testCase.output,
            actual: mockResult,
            passed: mockResult === testCase.output,
            error: null
          };
        } catch (error: any) {
          return {
            testCase: index + 1,
            input: testCase.input,
            expected: testCase.output,
            actual: null,
            passed: false,
            error: error?.message || 'Unknown error'
          };
        }
      });
      
      setTestResults(results);
    } catch (error) {
      console.error('Code execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const evaluateCode = (code: string, input: string, lang: string): string => {
    // This is a simplified mock - in production, use proper code execution service
    try {
      if (lang === 'javascript') {
        // Simple evaluation for demo purposes
        if (code.includes('twoSum') || code.includes('two_sum')) {
          const numsMatch = input.match(/\[(.*?)\]/);
          const targetMatch = input.match(/,\s*(\d+)/);
          
          if (!numsMatch || !targetMatch) {
            return '[]';
          }
          
          const nums = JSON.parse(numsMatch[1]);
          const target = parseInt(targetMatch[1]);
          
          // Mock two sum solution
          for (let i = 0; i < nums.length; i++) {
            for (let j = i + 1; j < nums.length; j++) {
              if (nums[i] + nums[j] === target) {
                return JSON.stringify([i, j]);
              }
            }
          }
        }
      }
    } catch (error: any) {
      return 'Error: ' + (error?.message || 'Unknown error');
    }
    
    return '[]'; // Default fallback
  };

  const handleSubmit = async () => {
    if (!assessment || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const totalTime = Date.now() - startTime;
      
      // Calculate score based on test results
      const passedTests = testResults.filter(r => r.passed).length;
      const totalTests = question?.testCases?.length || 1;
      const score = (passedTests / totalTests) * 100;
      
      const response = await assessmentAPI.submitAssessment({
        assessmentId: assessment._id,
        answers: [{
          questionId: question!._id,
          answer: {
            code,
            language,
            testResults
          },
          isCorrect: passedTests === totalTests,
          timeSpent: totalTime
        }],
        timeSpent: totalTime
      });
      
      // Stop recording if active
      if (isRecording) {
        stopRecording();
      }
      
      navigate('/assessment-results', { 
        state: { 
          submission: response.data,
          score,
          passedTests,
          totalTests
        } 
      });
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!assessment || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading coding challenge...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
            <div className="flex items-center space-x-4">
              <div className={`text-lg font-bold ${timeLeft < 60000 ? 'text-red-600' : 'text-gray-700'}`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isRecording 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRecording ? '⏹️ Stop Recording' : '🔴 Start Recording'}
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">{question.text}</h2>
            <div className="flex items-center space-x-4 text-sm text-blue-700">
              <span className="font-medium">Difficulty:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                question.difficulty === 'easy' 
                  ? 'bg-green-100 text-green-800'
                  : question.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {question.difficulty}
              </span>
              <span className="font-medium">Topic:</span>
              <span>{question.topic}</span>
              <span className="font-medium">Time Limit:</span>
              <span>{assessment.timeLimit} minutes</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Code Editor</h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Editor
                height="400px"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
            
            <div className="flex space-x-4 mt-4">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isRunning ? 'Running...' : '▶️ Run Code'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || testResults.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Solution'}
              </button>
            </div>
          </div>

          {/* Test Cases & Results */}
          <div className="space-y-6">
            {/* Test Cases */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Test Cases</h3>
              <div className="space-y-3">
                {question.testCases.map((testCase, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="font-medium text-gray-900 mb-1">
                      Test Case {index + 1}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div><strong>Input:</strong> {testCase.input}</div>
                      <div><strong>Expected:</strong> {testCase.output}</div>
                      {testCase.explanation && (
                        <div className="mt-1 text-gray-500">{testCase.explanation}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Test Results</h3>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 ${
                        result.passed 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          Test Case {result.testCase}
                          <span className={`ml-2 text-sm ${
                            result.passed ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {result.passed ? '✅ Passed' : '❌ Failed'}
                          </span>
                        </div>
                      </div>
                      
                      {result.error ? (
                        <div className="text-red-600 text-sm mt-1">
                          Error: {result.error}
                        </div>
                      ) : (
                        <div className="text-sm mt-1">
                          <div><strong>Output:</strong> {result.actual}</div>
                          {!result.passed && (
                            <div className="text-red-600">
                              Expected: {result.expected}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Score:</span>
                    <span className={`text-lg font-bold ${
                      testResults.filter(r => r.passed).length === testResults.length
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}>
                      {testResults.filter(r => r.passed).length}/{testResults.length} test cases passed
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingEditor;
