import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Stethoscope, MessageSquareText, Lightbulb, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navigation from '@/components/Navigation';

type DiagnosisResult = {
  id: string;
  symptoms: string;
  diagnosis: string;
  timestamp: string;
};

const DiseaseDiagnoser = () => {
  // This is the component that contains just the disease diagnosis functionality
  // It's used both as a standalone page and within the Diagnosis page
  const { user } = useAuth(); // Get user for patient details in PDF
  const [symptomsInput, setSymptomsInput] = useState('');
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[]>([]);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null); // Ref for PDF content

  const GEMINI_API_KEY_DIAGNOSER = "AIzaSyAxfkDQH3qqmzca0g1tBR74guIAiiPL1lc"; // Your provided API key

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [diagnosisResults]);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (symptomsInput.trim() === '' || isDiagnosing) return;

    setIsDiagnosing(true);
    const currentSymptoms = symptomsInput.trim();
    setSymptomsInput('');

    const userPrompt = `As a medical assistant, analyze the following symptoms and suggest possible diseases or conditions. Also, provide advice on whether a doctor's visit is recommended. Be concise and clear, and emphasize that this is not a substitute for professional medical advice.

Symptoms: "${currentSymptoms}"

Possible conditions:
Advice:`;

    try {
      const apiKey = GEMINI_API_KEY_DIAGNOSER;

      const payload = { contents: [{ role: "user", parts: [{ text: userPrompt }] }] };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error Response:', errorData);
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

  const handleDownloadPdf = async () => {
    if (pdfContentRef.current) {
        const input = pdfContentRef.current;
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; 
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        pdf.save(`HealthAI_Diagnosis_${new Date().toLocaleDateString()}.pdf`);
    } else {
        toast.error("Could not find content to download.");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
          <Stethoscope className="h-6 w-6 mr-2 text-healthcare-primary" />
          Disease Diagnoser
        </CardTitle>
        <CardDescription className="text-center">
          Enter your symptoms, and our AI will suggest possible conditions and advice.
          <br/>
          <span className="text-red-500 font-semibold">Disclaimer: This is for informational purposes only and not a substitute for professional medical advice.</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {diagnosisResults.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                <MessageSquareText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Enter your symptoms below to get a diagnosis.</p>
                <p className="text-sm mt-2 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Example: "Fever, sore throat, body aches, and fatigue."
                </p>
              </div>
            )}
            {/* The content to be downloaded as PDF */}
            <div ref={pdfContentRef}>
              {diagnosisResults.map((result) => (
                <div key={result.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border">
                  {/* PDF Header with User/Date */}
                  <div className="mb-4 pb-2 border-b">
                      <h3 className="text-xl font-bold text-healthcare-dark">HealthAI Diagnosis Report</h3>
                      <p className="text-sm text-gray-600">Patient: {user?.name || 'Guest User'}</p>
                      <p className="text-sm text-gray-600">Date: {result.timestamp}</p>
                  </div>
                  <p className="font-semibold text-gray-700 mb-2">Symptoms: <span className="font-normal text-gray-800">{result.symptoms}</span></p>
                  <p className="font-semibold text-healthcare-primary mb-2">Possible Conditions & Advice:</p>
                  <p className="whitespace-pre-wrap text-gray-800">{result.diagnosis}</p>
                  <p className="text-xs text-gray-500 mt-4 text-right">
                    Disclaimer: This is for informational purposes only and not a substitute for professional medical advice.
                  </p>
                </div>
              ))}
            </div>
            {isDiagnosing && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-healthcare-primary" />
                <span className="ml-2 text-gray-600">Analyzing symptoms...</span>
              </div>
            )}
            <div ref={resultsEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t flex gap-2">
        <form onSubmit={handleDiagnose} className="flex-1 flex gap-2">
          <Textarea
            placeholder="Describe your symptoms here (e.g., 'fever, cough, fatigue, headache')..."
            value={symptomsInput}
            onChange={(e) => setSymptomsInput(e.target.value)}
            disabled={isDiagnosing}
            className="flex-1 min-h-[60px]"
            rows={2}
          />
          <Button type="submit" disabled={isDiagnosing} className="flex-shrink-0">
            <Stethoscope className="h-4 w-4 mr-2" />
            Diagnose
          </Button>
        </form>
        {diagnosisResults.length > 0 && (
            <Button onClick={handleDownloadPdf} variant="outline" className="flex-shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
            </Button>
        )}
      </div>
    </Card>
  );
};

// This is the actual page component that includes Navigation
const DiseaseDiagnosisPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">Symptom Checker</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Enter your symptoms, and our AI will suggest possible conditions and advice.
        </p>
        <DiseaseDiagnoser />
      </div>
    </div>
  );
};

export default DiseaseDiagnosisPage;