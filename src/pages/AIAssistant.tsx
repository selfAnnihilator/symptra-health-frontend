import { useState, useRef, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext'; // Import useAuth to get user name

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};

const AIAssistant = () => {
  const { user } = useAuth(); // Get logged-in user for displaying name
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isSending) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      // Placeholder for Gemini API Key - In a real app, manage securely (e.g., via backend)
      const apiKey = "AIzaSyD5p-3vuYEI0BQRhEMPZ08QOkq_D56tvUI"; // Leave this empty, Canvas will provide it at runtime.

      let chatHistory = [];
      // Add previous messages to chat history for context (optional, but good for conversation)
      messages.forEach(msg => {
        chatHistory.push({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] });
      });
      chatHistory.push({ role: "user", parts: [{ text: userMessage.text }] });

      const payload = { contents: chatHistory };
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from AI.');
      }

      const result = await response.json();
      let aiResponseText = 'No response from AI.';

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        aiResponseText = result.candidates[0].content.parts[0].text;
      } else {
        aiResponseText = 'AI did not provide a valid response structure.';
        console.error('Unexpected AI response structure:', result);
      }

      const aiMessage: Message = { id: Date.now().toString() + '-ai', sender: 'ai', text: aiResponseText };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      
    } catch (error: any) {
      console.error('AI Assistant Error:', error);
      toast.error(error.message || 'Failed to get response from AI Assistant.');
      const errorMessage: Message = { id: Date.now().toString() + '-error', sender: 'ai', text: `Error: ${error.message || 'Could not connect to AI.'}` };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12 flex flex-col items-center">
        <Card className="w-full max-w-3xl shadow-lg h-[calc(100vh-180px)] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <Bot className="h-6 w-6 mr-2 text-healthcare-primary" />
              AI Health Assistant
            </CardTitle>
            <CardDescription className="text-center">
              Ask me anything about health, symptoms, or general medical information.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-10">
                    <Bot className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>How can I help you today?</p>
                  </div>
                )}
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-healthcare-primary text-white">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                        message.sender === 'user' 
                          ? 'bg-healthcare-primary text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                    {message.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-300">
                          {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isSending && (
                  <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-healthcare-primary text-white">AI</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[70%] p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800 rounded-bl-none">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Ask your health question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isSending}
                className="flex-1"
              />
              <Button type="submit" disabled={isSending}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;