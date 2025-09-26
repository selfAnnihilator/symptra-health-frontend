import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Lightbulb } from "lucide-react";
import CheckupQuestionnaire from "@/components/mental-health/CheckupQuestionnaire";
import TreatmentPlanAssessment from "@/components/mental-health/TreatmentPlanAssessment";
import { Button } from "@/components/ui/button";

const MentalHealth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">Mental Health Support</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Your well-being matters. Explore tools and resources to support your mental health journey.
        </p>

        <Tabs defaultValue="checkup" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="checkup" className="flex items-center justify-center">
              <Brain className="h-4 w-4 mr-2" />
              Mental Checkup
            </TabsTrigger>
            <TabsTrigger value="treatment-plan" className="flex items-center justify-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Treatment Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checkup">
            <CheckupQuestionnaire />
          </TabsContent>

          <TabsContent value="treatment-plan">
            <TreatmentPlanAssessment /> {/* RENDER THE TREATMENT PLAN COMPONENT HERE */}
          </TabsContent>
        </Tabs>

        <section className="mt-12">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-healthcare-primary" />
                Resources for Well-being
              </CardTitle>
              <CardDescription>Explore articles and guides on mental health topics.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Access a curated library of articles, self-help guides, and external resources to support your mental well-being. Learn about stress management, anxiety coping mechanisms, mindfulness practices, and more.
              </p>
              <Button variant="outline" className="mt-4">Explore Resources</Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default MentalHealth;