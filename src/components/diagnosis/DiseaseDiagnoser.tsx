import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Stethoscope, MessageSquareText, Lightbulb, Upload, FileText, Image as ImageIcon, X, FileQuestion } from 'lucide-react';
import { toast } from 'sonner';

type FileWithPreview = {
  file: File;
  preview: string;
  type: 'image' | 'pdf' | 'other';
  id: string;
};

type DiagnosisResult = {
  id: string;
  symptoms: string;
  diagnosis: string;
  timestamp: string;
};

const DiseaseDiagnoser = () => {
  const [symptomsInput, setSymptomsInput] = useState('');
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[]>([]);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Your Gemini API Key - Make sure this is the correct key from your Google Cloud Console
  const GEMINI_API_KEY_DIAGNOSER = "AIzaSyD5p-3vuYEI0BQRhEMPZ08QOkq_D56tvUI"; // Your provided API key

  // Scroll to bottom of results
  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [diagnosisResults]);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (symptomsInput.trim() === '' || isDiagnosing) return;

    setIsDiagnosing(true);
    const currentSymptoms = symptomsInput.trim();
    setSymptomsInput(''); // Clear input immediately

    const userPrompt = `As a medical assistant, analyze the following symptoms and suggest possible diseases or conditions. Also, provide advice on whether a doctor's visit is recommended. Be concise and clear, and emphasize that this is not a substitute for professional medical advice.

Symptoms: "${currentSymptoms}"

Possible conditions:
Advice:`;

    try {
      const apiKey = GEMINI_API_KEY_DIAGNOSER; // Use the explicitly defined API key

      const payload = { contents: [{ role: "user", parts: [{ text: userPrompt }] }] };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error Response:', errorData); // Log full error for debugging
        throw new Error(errorData.error?.message || 'Failed to get diagnosis from AI.');
      }

      const result = await response.json();
      let aiDiagnosisText = 'Could not generate a diagnosis. Please try again.';

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        aiDiagnosisText = result.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected AI response structure:', result);
      }

      const newResult: DiagnosisResult = {
        id: Date.now().toString(),
        symptoms: currentSymptoms,
        diagnosis: aiDiagnosisText,
        timestamp: new Date().toLocaleString(),
      };
      setDiagnosisResults((prevResults) => [...prevResults, newResult]);
      
    } catch (error: any) {
      console.error('Disease Diagnoser Error:', error);
      toast.error(error.message || 'Failed to diagnose. Please try again.');
      const errorResult: DiagnosisResult = {
        id: Date.now().toString() + '-error',
        symptoms: currentSymptoms,
        diagnosis: `Error: ${error.message || 'Could not connect to AI for diagnosis.'}`,
        timestamp: new Date().toLocaleString(),
      };
      setDiagnosisResults((prevResults) => [...prevResults, errorResult]);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: FileWithPreview[] = Array.from(e.target.files).map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        type: (file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other') as 'image' | 'pdf' | 'other',
        id: Math.random().toString(36).substr(2, 9)
      }));
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter(f => f.id !== id);
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles: FileWithPreview[] = Array.from(e.dataTransfer.files).map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        type: (file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other') as 'image' | 'pdf' | 'other',
        id: Math.random().toString(36).substr(2, 9)
      }));
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  }, []);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
          <Stethoscope className="h-6 w-6 mr-2 text-healthcare-primary" />
          Disease Diagnoser & Report Analysis
        </CardTitle>
        <CardDescription className="text-center">
          Upload medical reports or images, describe your symptoms, and get AI-powered analysis.
          <br />
          <span className="text-red-500 font-semibold">Disclaimer: This is for informational purposes only and not a substitute for professional medical advice.</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
        <div className="space-y-6">
          {/* File Upload Section */}
          <div 
            ref={dropRef}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragOver}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging ? 'border-healthcare-primary bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-healthcare-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {isDragging ? 'Drop files here' : 'Drag and drop files here'}
              </h3>
              <p className="text-sm text-gray-500">
                Upload PDF reports or images (PNG, JPG, JPEG)
              </p>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Select Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          {/* File Previews */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Uploaded Files ({files.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map((file) => (
                  <div key={file.id} className="relative group border rounded-lg p-3 flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {file.type === 'image' ? (
                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                          <img src={file.preview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : file.type === 'pdf' ? (
                        <div className="w-12 h-12 bg-red-50 rounded-md flex items-center justify-center">
                          <FileText className="h-6 w-6 text-red-500" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                          <FileQuestion className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.file.size / 1024).toFixed(1)} KB • {file.type.toUpperCase()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                Describe your symptoms
              </label>
              <span className="text-xs text-gray-500">Optional but recommended</span>
            </div>
            <Textarea
              id="symptoms"
              placeholder="E.g., Fever, headache, and fatigue for 3 days..."
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              className="min-h-[100px]"
              disabled={isDiagnosing}
            />
          </div>

          {/* Diagnosis Results */}
          <ScrollArea className="flex-1 pr-2 max-h-96">
            <div className="space-y-4">
              {diagnosisResults.length > 0 ? (
                diagnosisResults.map((result) => (
                  <div key={result.id} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    {result.symptoms && (
                      <p className="font-medium text-blue-800 mb-2">
                        <span className="font-semibold">Symptoms:</span> {result.symptoms}
                      </p>
                    )}
                    <div className="prose prose-sm prose-blue max-w-none">
                      <p className="whitespace-pre-line text-gray-800">{result.diagnosis}</p>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">{result.timestamp}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquareText className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p>Your analysis results will appear here</p>
                </div>
              )}
              <div ref={resultsEndRef} />
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      <div className="border-t p-4 bg-gray-50">
        <Button 
          onClick={handleDiagnose} 
          className="w-full"
          size="lg"
          disabled={isDiagnosing || (files.length === 0 && !symptomsInput.trim())}
        >
          {isDiagnosing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Stethoscope className="mr-2 h-4 w-4" />
              {files.length > 0 ? 'Analyze Files & Symptoms' : 'Analyze Symptoms'}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default DiseaseDiagnoser;