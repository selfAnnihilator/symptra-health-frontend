import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    quote: "Symptra Health has revolutionized how I manage my family's health. The AI tools are incredibly insightful!",
    author: "Jane Doe",
    role: "Mother of two",
    avatar: "https://placehold.co/100x100/ADD8E6/000000?text=JD",
  },
  {
    id: 2,
    quote: "The online consultations and medical report analysis saved me so much time and worry. Highly recommended!",
    author: "John Smith",
    role: "Busy Professional",
    avatar: "https://placehold.co/100x100/90EE90/000000?text=JS",
  },
  {
    id: 3,
    quote: "I appreciate the clear, concise information provided by the AI assistant. It's a fantastic first point of contact for health questions.",
    author: "Sarah Brown",
    role: "Health Enthusiast",
    avatar: "https://placehold.co/100x100/FFB6C1/000000?text=SB",
  },
  {
    id: 4,
    quote: "Booking appointments is a breeze, and tracking my records has never been easier. Symptra Health is a game-changer.",
    author: "Michael Green",
    role: "Retired Teacher",
    avatar: "https://placehold.co/100x100/DDA0DD/000000?text=MG",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-healthcare-dark mb-4">
          What Our Users Say
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          Hear directly from individuals who have experienced the benefits of Symptra Health.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="shadow-md hover:shadow-lg transition-all duration-300 flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col items-center">
                <Quote className="h-8 w-8 text-healthcare-primary mb-4" />
                <p className="text-gray-700 italic mb-4 flex-1">"{testimonial.quote}"</p>
                <div className="flex items-center mt-auto">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} onError={(e) => { e.currentTarget.src = `https://placehold.co/100x100/E0E0E0/333333?text=${testimonial.author.charAt(0)}`; }} />
                    <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold text-healthcare-dark">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;