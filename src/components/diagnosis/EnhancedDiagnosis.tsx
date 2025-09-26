import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2, Stethoscope, FileText, Upload, X, Check, ChevronRight, ChevronLeft, MapPin, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

type DiagnosisResult = {
  id: string;
  symptoms: string;
  diagnosis: string;
  timestamp: string;
  confidence?: number;
  recommendations?: string[];
  severity?: 'low' | 'moderate' | 'high';
};

type BodyPart = {
  id: string;
  name: string;
  selected: boolean;
};

const BODY_PARTS: BodyPart[] = [
  { id: 'head', name: 'Head', selected: false },
  { id: 'neck', name: 'Neck', selected: false },
  { id: 'chest', name: 'Chest', selected: false },
  { id: 'stomach', name: 'Stomach', selected: false },
  { id: 'back', name: 'Back', selected: false },
  { id: 'arm-left', name: 'Left Arm', selected: false },
  { id: 'arm-right', name: 'Right Arm', selected: false },
  { id: 'leg-left', name: 'Left Leg', selected: false },
  { id: 'leg-right', name: 'Right Leg', selected: false },
];

export const EnhancedDiagnosis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState('');
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPart[]>(BODY_PARTS);
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [files, setFiles] = useState<File[]>([]);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [results, setResults] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleBodyPart = (id: string) => {
    setSelectedBodyParts(prev => 
      prev.map(part => 
        part.id === id ? { ...part, selected: !part.selected } : part
      )
    );
  };

  const handleDiagnose = async () => {
    if (step < 3) {
      setStep(step + 1);
      setProgress((step / 2) * 100);
      return;
    }

    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    setIsDiagnosing(true);
    setProgress(70);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result - in a real app, this would come from your API
      const mockResult: DiagnosisResult = {
        id: Date.now().toString(),
        symptoms,
        diagnosis: `Based on your symptoms (${symptoms}), you may be experiencing a common condition. However, this is not a medical diagnosis. Please consult with a healthcare provider for an accurate assessment.`,
        timestamp: new Date().toLocaleString(),
        confidence: 78,
        recommendations: [
          'Rest and stay hydrated',
          'Monitor your symptoms',
          'Consult a doctor if symptoms worsen',
          'Avoid strenuous activities'
        ],
        severity: 'moderate'
      };

      setResults(mockResult);
      setStep(4);
      setProgress(100);
    } catch (error) {
      console.error('Diagnosis error:', error);
      toast.error('Failed to process diagnosis. Please try again.');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(((step - 2) / 2) * 100);
    }
  };

  const startOver = () => {
    setStep(1);
    setSymptoms('');
    setSelectedBodyParts(BODY_PARTS);
    setDuration('');
    setSeverity(3);
    setFiles([]);
    setResults(null);
    setProgress(0);
  };

  const getSelectedBodyParts = () => {
    return selectedBodyParts.filter(part => part.selected).map(part => part.name);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-2">Symptom Checker</h1>
        <p className="text-gray-600">
          Describe your symptoms and get AI-powered health insights. This tool is for informational purposes only.
        </p>
      </div>

      <Progress value={progress} className="h-2 mb-8" />

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {step === 1 && 'Describe Your Symptoms'}
                {step === 2 && 'Additional Information'}
                {step === 3 && 'Upload Files (Optional)'}
                {step === 4 && 'Your Results'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Tell us about how you\'re feeling'}
                {step === 2 && 'Help us understand your symptoms better'}
                {step === 3 && 'Upload any relevant medical reports or images'}
                {step === 4 && 'Review your diagnosis and next steps'}
              </CardDescription>
            </div>
            <Badge variant="outline" className="px-4 py-1">
              Step {step} of 4
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="symptoms">
                  What symptoms are you experiencing?
                </label>
                <Textarea
                  id="symptoms"
                  placeholder="E.g., Headache, fever, and fatigue for the past 2 days"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Select affected areas (optional)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {selectedBodyParts.map((part) => (
                    <Button
                      key={part.id}
                      variant={part.selected ? 'default' : 'outline'}
                      className="flex items-center gap-2"
                      onClick={() => toggleBodyPart(part.id)}
                    >
                      {part.selected ? <Check className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                      {part.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  How long have you been experiencing these symptoms?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['Less than 24 hours', '1-3 days', '4-7 days', '1-2 weeks', 'More than 2 weeks'].map((option) => (
                    <Button
                      key={option}
                      variant={duration === option ? 'default' : 'outline'}
                      onClick={() => setDuration(option)}
                      className="justify-start"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  How severe are your symptoms?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Button
                      key={level}
                      variant={severity >= level ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => setSeverity(level as 1 | 2 | 3 | 4 | 5)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mild</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="mb-2">Drag and drop files here, or click to browse</p>
                <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG, PDF (max 5MB each)</p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Files
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,.pdf"
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Selected Files</h4>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && results && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Your Symptoms</h3>
                <p className="text-blue-700">{results.symptoms}</p>
                {getSelectedBodyParts().length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm text-blue-600">Affected areas: </span>
                    <span className="text-sm text-blue-700">{getSelectedBodyParts().join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Preliminary Assessment</h3>
                <div className="bg-white border rounded-lg p-4">
                  <p>{results.diagnosis}</p>
                  <div className="mt-3 flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Confidence:</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${results.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium ml-2">{results.confidence}%</span>
                  </div>
                </div>
              </div>

              {results.recommendations && results.recommendations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Recommendations</h3>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <h3 className="font-medium text-amber-800 mb-2">Important Notice</h3>
                <p className="text-amber-700 text-sm">
                  This is not a medical diagnosis. The information provided is for informational purposes only and should not be considered as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={step > 1 ? handleBack : () => navigate(-1)}
            disabled={isDiagnosing}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === 1 ? 'Back' : 'Previous'}
          </Button>

          {step < 4 ? (
            <Button
              onClick={handleDiagnose}
              disabled={isDiagnosing || (step === 1 && !symptoms.trim())}
            >
              {isDiagnosing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {step === 3 ? 'Get Diagnosis' : 'Continue'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" onClick={startOver}>
                Start Over
              </Button>
              <Button>Book Appointment</Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default EnhancedDiagnosis;
