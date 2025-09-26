import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileText, Lightbulb, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type AnalysisResult = {
  id: string;
  reportText: string;
  analysis: string;
  timestamp: string;
};

// Define the base URL for your backend API
const API_BASE_URL = 'http://localhost:5000/api';

const MedicalReportAnalyzer = () => {
  const [reportInput, setReportInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gemini API Key for direct frontend calls
  const GEMINI_API_KEY_FRONTEND_DIRECT_CALLS = "AIzaSyD5p-3vuYEI0BQRhEMPZ08QOkq_D56tvUI";

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [analysisResults]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReportInput('');
      setSelectedFile(file);
      toast.info(`File "${file.name}" selected. Click Analyze Report.`);
    } else {
      setSelectedFile(null);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((reportInput.trim() === '' && !selectedFile) || isAnalyzing) {
      toast.error("Please paste text or select a file to analyze.");
      return;
    }

    setIsAnalyzing(true);
    let currentReportContent = reportInput.trim();

    setReportInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFile(null);

    try {
      let analysisResponseText = 'Could not generate an analysis. Please try again.';
      let originalReportUsed = '';
      
      const formData = new FormData();
      if (selectedFile) {
        // If a file is selected, use the file upload path
        formData.append('reportFile', selectedFile);
      } else {
        // If no file, use the text input path and send as a separate field
        formData.append('reportText', currentReportContent);
      }

      // We use a single endpoint on the backend for both paths
      const response = await fetch(`${API_BASE_URL}/analysis/report`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend Analysis Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to analyze report via backend.');
      }

      const result = await response.json();
      analysisResponseText = result.data.analysis;
      originalReportUsed = result.data.reportTextSnippet;

      const newResult: AnalysisResult = {
        id: result.data._id,
        reportText: originalReportUsed,
        analysis: analysisResponseText,
        timestamp: result.data.analysisTimestamp,
      };
      setAnalysisResults((prevResults) => [...prevResults, newResult]);

    } catch (error: any) {
      console.error('Medical Report Analyzer Error:', error);
      toast.error(error.message || 'Failed to analyze report. Please try again.');
      const errorResult: AnalysisResult = {
        id: Date.now().toString() + '-error',
        reportText: currentReportContent || (selectedFile ? selectedFile.name : 'N/A'),
        analysis: `Error: ${error.message || 'Could not connect to AI for analysis.'}`,
        timestamp: new Date().toLocaleString(),
      };
      setAnalysisResults((prevResults) => [...prevResults, errorResult]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
          <FileText className="h-6 w-6 mr-2 text-healthcare-primary" />
          Medical Report Analyzer
        </CardTitle>
        <CardDescription className="text-center">
          Paste your medical report text or upload a file, and our AI will summarize key findings.
          <br/>
          <span className="text-red-500 font-semibold">Disclaimer: This is for informational purposes only and not a substitute for professional medical advice.</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {analysisResults.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Paste your medical report text or upload a file below for analysis.</p>
                <p className="text-sm mt-2 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Example: "Patient presented with persistent cough, fever of 101F, and mild shortness of breath for 3 days. Chest X-ray showed bilateral infiltrates."
                </p>
              </div>
            )}
            {analysisResults.map((result) => (
              <div key={result.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                <p className="font-semibold text-gray-700 mb-2">Report Text: <span className="font-normal text-gray-800">{result.reportText}</span></p>
                <p className="font-semibold text-healthcare-primary mb-2">AI Analysis:</p>
                <p className="whitespace-pre-wrap">{result.analysis}</p>
                <p className="text-xs text-gray-500 mt-2 text-right">{result.timestamp}</p>
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-healthcare-primary" />
                <span className="ml-2 text-gray-600">Analyzing report...</span>
              </div>
            )}
            <div ref={resultsEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t">
        <form onSubmit={handleAnalyze} className="flex flex-col gap-3">
          <Textarea
            placeholder="Paste your medical report text here..."
            value={reportInput}
            onChange={(e) => {
                setReportInput(e.target.value);
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }}
            disabled={isAnalyzing}
            className="flex-1 min-h-[60px]"
            rows={2}
          />
          <div className="flex items-center gap-2">
            {/* The Label and Input for file upload */}
            <Label htmlFor="file-upload" className="flex-1">
                <Button asChild variant="outline" className="w-full cursor-pointer">
                    <span className="flex items-center justify-center gap-2">
                        <Upload className="h-4 w-4" /> {selectedFile ? selectedFile.name : 'Upload File (.txt, .pdf, .jpg, .png)'}
                    </span>
                </Button>
            </Label>
            <Input 
                id="file-upload" 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" // Hide the default file input
                accept=".txt,text/plain,application/pdf,image/jpeg,image/png" // Accept PDF and images
                disabled={isAnalyzing}
            />
            {/* Analyze Report Button */}
            <Button type="submit" disabled={isAnalyzing}>
              <FileText className="h-4 w-4 mr-2" />
              Analyze Report
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            For advanced image analysis (e.g., direct interpretation of charts/graphs), specialized models or services are needed. This tool extracts text from images.
          </p>
        </form>
      </div>
    </Card>
  );
};

export default MedicalReportAnalyzer;