import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Brain, MessageSquareText, Lightbulb, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

type Question = {
  id: string;
  text: string;
  options: string[];
};

type Answer = {
  questionId: string;
  answer: string;
};

type AssessmentResult = {
  id: string;
  summary: string;
  advice: string;
  timestamp: string;
};

const questions: Question[] = [
  {
    id: 'q1',
    text: "Over the last two weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 'q2',
    text: "Over the last two weeks, how often have you been bothered by having little interest or pleasure in doing things?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 'q3',
    text: "Over the last two weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 'q4',
    text: "Over the last two weeks, how often have you been bothered by feeling tired or having little energy?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 'q5',
    text: "Over the last two weeks, how often have you been bothered by poor appetite or overeating?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 'q6',
    text: "Over the last two weeks, how often have you been bothered by feeling bad about yourself—or that you are a failure or have let yourself or your family down?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 'q7',
    text: "Over the last two weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 'q8',
    text: "Over the last two weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite—being so fidgety or restless that you have been moving around a lot more than usual?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  },
  {
    id: 'q9',
    text: "Over the last two weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself in some way?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
  }
];

const CheckupQuestionnaire = () => {
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({});
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [isAssessing, setIsAssessing] = useState(false);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  // Gemini API Key for direct frontend calls
  const GEMINI_API_KEY = "AIzaSyD5p-3vuYEI0BQRhEMPZ08QOkq_D56tvUI"; // Your provided API key

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [assessmentResults]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setCurrentAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAssessing) return;

    // Check if all questions are answered
    if (Object.keys(currentAnswers).length !== questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setIsAssessing(true);
    const answersSummary = questions.map(q => {
      const answer = currentAnswers[q.id];
      return `${q.text} - ${answer}`;
    }).join('\n');

    const userPrompt = `Based on the following answers to a mental health questionnaire, provide a general assessment of the user's mental well-being. Offer compassionate and general advice for self-care or when to consider professional help. Emphasize that this is not a diagnosis and should not replace professional medical or psychological advice.

Questionnaire Answers:
${answersSummary}

General Assessment:
Self-care Advice:
When to seek professional help:`;

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
        throw new Error(errorData.error?.message || 'Failed to get assessment from AI.');
      }

      const result = await response.json();
      let aiAssessmentText = 'Could not generate an assessment. Please try again.';

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        aiAssessmentText = result.candidates[0].content.parts[0].text;
      } else {
        console.error('Unexpected AI response structure:', result);
      }

      const newResult: AssessmentResult = {
        id: Date.now().toString(),
        summary: answersSummary,
        advice: aiAssessmentText,
        timestamp: new Date().toLocaleString(),
      };
      setAssessmentResults((prevResults) => [...prevResults, newResult]);
      setCurrentAnswers({}); // Reset answers after submission
      
    } catch (error: any) {
      console.error('Mental Health Assessment Error:', error);
      toast.error(error.message || 'Failed to perform assessment. Please try again.');
      const errorResult: AssessmentResult = {
        id: Date.now().toString() + '-error',
        summary: answersSummary,
        advice: `Error: ${error.message || 'Could not connect to AI for assessment.'}`,
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
          <Brain className="h-6 w-6 mr-2 text-healthcare-primary" />
          Mental Health Checkup
        </CardTitle>
        <CardDescription className="text-center">
          Answer a few questions to get a general assessment of your mental well-being.
          <br/>
          <span className="text-red-500 font-semibold">Disclaimer: This is not a diagnosis and should not replace professional medical advice.</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {assessmentResults.length === 0 ? (
              <form onSubmit={handleSubmitAssessment} className="space-y-6">
                {questions.map((q) => (
                  <div key={q.id} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                    <p className="font-semibold text-gray-800">{q.text}</p>
                    <RadioGroup 
                      value={currentAnswers[q.id] || ''} 
                      onValueChange={(value) => handleAnswerChange(q.id, value)}
                    >
                      {q.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${q.id}-${index}`} />
                          <Label htmlFor={`${q.id}-${index}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
                <Button type="submit" className="w-full" disabled={isAssessing}>
                  {isAssessing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Get Assessment
                </Button>
              </form>
            ) : (
              // Display assessment results
              <div className="space-y-4">
                {assessmentResults.map((result) => (
                  <div key={result.id} className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
                    <p className="font-semibold text-green-800 mb-2">Assessment Summary:</p>
                    <p className="whitespace-pre-wrap text-gray-800 mb-4">{result.advice}</p>
                    <p className="text-xs text-gray-500 mt-2 text-right">{result.timestamp}</p>
                  </div>
                ))}
                <Button onClick={() => setAssessmentResults([])} variant="outline" className="w-full">
                  Take Another Checkup
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CheckupQuestionnaire;