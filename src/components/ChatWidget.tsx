
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, User } from "lucide-react";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! How can I help you today?", isUser: false }
  ]);

  useEffect(() => {
    if (isOpen) {
      const chatContainer = document.getElementById("chat-messages");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    setMessages([...messages, { text: message, isUser: true }]);
    setMessage("");
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for your message. A healthcare professional will respond shortly. Is there anything else I can help with?", 
        isUser: false 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-healthcare-primary hover:bg-healthcare-primary/90'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl z-50 flex flex-col overflow-hidden border border-gray-200 animate-fade-up">
          {/* Header */}
          <div className="bg-healthcare-primary p-4 text-white flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              <h3 className="font-medium">HealthAI Support</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div id="chat-messages" className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-3/4 p-3 rounded-lg ${
                  msg.isUser 
                    ? 'bg-healthcare-primary text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  {!msg.isUser && (
                    <div className="flex items-center mb-1">
                      <div className="bg-healthcare-primary/20 p-1 rounded-full mr-1">
                        <MessageCircle className="h-3 w-3 text-healthcare-primary" />
                      </div>
                      <span className="text-xs font-medium">Support</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mr-2"
            />
            <Button type="submit" size="sm" className="bg-healthcare-primary hover:bg-healthcare-primary/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
