import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Lightbulb, MessageSquareText, FileText } from 'lucide-react';
import { toast } from 'sonner';

type TreatmentPlanResult = {
  id: string;
  input: string;
  plan: string;
  timestamp: string;
};

const TreatmentPlanAssessment = () => {
  const [input, setInput] = useState('');
  const [assessmentResults, setAssessmentResults] = useState<TreatmentPlanResult[]>([]);
  const [isAssessing, setIsAssessing] = useState(false);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  // Gemini API Key for direct frontend calls
  const GEMINI_API_KEY = "AIzaSyD5p-3vuYEI0BQRhEMPZ08QOkq_D56tvUI"; // Your provided API key

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [assessmentResults]);

  const handleSubmitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isAssessing) return;

    setIsAssessing(true);
    const currentInput = input.trim();
    setInput(''); // Clear input immediately

    const userPrompt = `Based on the following user input, suggest a general, non-medical mental health self-care plan or approach. Include suggestions for activities, resources, or mindset shifts. Emphasize that this is not professional medical advice and a healthcare provider should be consulted for personalized treatment.

User Input: "${currentInput}"

Suggested Self-Care Plan:`;

    try {
      const payload = { contents: [{ role: "user", parts: [{ text: userPrompt }] }] };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error Response:', errorData);
        throw new Error(errorData.error?.message || 'Failed to get treatment plan from AI.');
      }

      const result = await response.json();
      let aiPlanText = 'Could not generate a plan. Please try again.';

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        aiPlanText = result.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected AI response structure:', result);
      }

      const newResult: TreatmentPlanResult = {
        id: Date.now().toString(),
        input: currentInput,
        plan: aiPlanText,
        timestamp: new Date().toLocaleString(),
      };
      setAssessmentResults((prevResults) => [...prevResults, newResult]);
      
    } catch (error: any) {
      console.error('Treatment Plan Assessment Error:', error);
      toast.error(error.message || 'Failed to generate plan. Please try again.');
      const errorResult: TreatmentPlanResult = {
        id: Date.now().toString() + '-error',
        input: currentInput,
        plan: `Error: ${error.message || 'Could not connect to AI for plan generation.'}`,
        timestamp: new Date().toLocaleString(),
      };
      setAssessmentResults((prevResults) => [...prevResults, errorResult]);
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
          <Lightbulb className="h-6 w-6 mr-2 text-healthcare-primary" />
          Personalized Treatment Plan
        </CardTitle>
        <CardDescription className="text-center">
          Describe your situation or preferences, and our AI will suggest a general self-care plan.
          <br/>
          <span className="text-red-500 font-semibold">Disclaimer: This is not a medical diagnosis and should not replace professional medical advice.</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {assessmentResults.length === 0 ? (
              <form onSubmit={handleSubmitAssessment} className="space-y-4">
                <Textarea
                  placeholder="Describe your current mental health concerns, goals, or preferences for support (e.g., 'feeling overwhelmed, need strategies for daily stress', 'looking for ways to improve sleep and mood')..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isAssessing}
                  className="min-h-[120px]"
                  rows={4}
                />
                <Button type="submit" className="w-full" disabled={isAssessing}>
                  {isAssessing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Generate Plan
                </Button>
              </form>
            ) : (
              // Display assessment results
              <div className="space-y-4">
                {assessmentResults.map((result) => (
                  <div key={result.id} className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
                    <p className="font-semibold text-green-800 mb-2">Your Input:</p>
                    <p className="whitespace-pre-wrap text-gray-800 mb-4">{result.input}</p>
                    <p className="font-semibold text-green-800 mb-2">Suggested Self-Care Plan:</p>
                    <p className="whitespace-pre-wrap text-gray-800 mb-4">{result.plan}</p>
                    <p className="text-xs text-gray-500 mt-2 text-right">{result.timestamp}</p>
                  </div>
                ))}
                <Button onClick={() => setAssessmentResults([])} variant="outline" className="w-full">
                  Generate Another Plan
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TreatmentPlanAssessment;