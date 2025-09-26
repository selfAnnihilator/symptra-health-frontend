
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Search, AlertCircle, CheckCircle2 } from "lucide-react";

interface Symptom {
  id: string;
  name: string;
  checked: boolean;
}

const SymptomsChecker = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Common symptoms list
  const commonSymptoms: Symptom[] = [
    { id: "fever", name: "Fever", checked: false },
    { id: "cough", name: "Cough", checked: false },
    { id: "headache", name: "Headache", checked: false },
    { id: "sore-throat", name: "Sore Throat", checked: false },
    { id: "fatigue", name: "Fatigue", checked: false },
    { id: "nausea", name: "Nausea", checked: false },
    { id: "dizziness", name: "Dizziness", checked: false },
    { id: "shortness-of-breath", name: "Shortness of Breath", checked: false },
    { id: "body-ache", name: "Body Ache", checked: false },
    { id: "chills", name: "Chills", checked: false },
  ];

  const [availableSymptoms, setAvailableSymptoms] = useState<Symptom[]>(commonSymptoms);

  // Filter symptoms based on search
  const filteredSymptoms = searchQuery
    ? availableSymptoms.filter(symptom => 
        symptom.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : availableSymptoms;

  // Toggle symptom selection
  const toggleSymptom = (symptomId: string) => {
    const updatedAvailable = availableSymptoms.map(symptom => {
      if (symptom.id === symptomId) {
        return { ...symptom, checked: !symptom.checked };
      }
      return symptom;
    });
    
    setAvailableSymptoms(updatedAvailable);
    
    // Update selected symptoms
    const updatedSelected = updatedAvailable
      .filter(symptom => symptom.checked)
      .map(symptom => ({ ...symptom }));
    
    setSelectedSymptoms(updatedSelected);
  };

  // Remove a selected symptom
  const removeSymptom = (symptomId: string) => {
    // Update available symptoms
    const updatedAvailable = availableSymptoms.map(symptom => {
      if (symptom.id === symptomId) {
        return { ...symptom, checked: false };
      }
      return symptom;
    });
    
    setAvailableSymptoms(updatedAvailable);
    
    // Update selected symptoms
    setSelectedSymptoms(prev => prev.filter(symptom => symptom.id !== symptomId));
  };

  // Check symptoms
  const checkSymptoms = () => {
    if (selectedSymptoms.length > 0) {
      setShowResults(true);
    }
  };

  // Reset checker
  const resetChecker = () => {
    setSearchQuery("");
    setAvailableSymptoms(commonSymptoms);
    setSelectedSymptoms([]);
    setShowResults(false);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Symptoms Checker</CardTitle>
        <CardDescription>
          Select your symptoms to get possible conditions and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showResults ? (
          <>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {selectedSymptoms.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium mb-2">Selected Symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map(symptom => (
                      <div 
                        key={symptom.id}
                        className="bg-healthcare-primary/10 text-healthcare-primary text-sm px-3 py-1 rounded-full flex items-center"
                      >
                        {symptom.name}
                        <button 
                          className="ml-2 focus:outline-none" 
                          onClick={() => removeSymptom(symptom.id)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border rounded-md divide-y">
                {filteredSymptoms.length > 0 ? (
                  filteredSymptoms.map(symptom => (
                    <div key={symptom.id} className="flex items-center space-x-2 p-3">
                      <Checkbox 
                        id={symptom.id} 
                        checked={symptom.checked}
                        onCheckedChange={() => toggleSymptom(symptom.id)}
                      />
                      <label 
                        htmlFor={symptom.id}
                        className="flex-grow cursor-pointer text-sm"
                      >
                        {symptom.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No symptoms found matching your search.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-healthcare-primary/5 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-lg mb-2">Possible Conditions</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Common Cold</h4>
                    <span className="text-sm text-healthcare-primary">85% match</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    A viral infection of the upper respiratory tract that affects the nose, throat, and sinuses.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Seasonal Allergies</h4>
                    <span className="text-sm text-healthcare-primary">70% match</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    An allergic reaction to pollen, dust, or other environmental triggers.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Influenza (Flu)</h4>
                    <span className="text-sm text-healthcare-primary">65% match</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    A contagious respiratory illness caused by influenza viruses.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800">Important Notice</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    This symptom checker provides general information only and is not a substitute 
                    for professional medical advice. Please consult a healthcare provider for proper diagnosis.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-800">Recommendations</h3>
                  <ul className="text-sm text-green-700 mt-1 list-disc pl-4 space-y-1">
                    <li>Rest and stay hydrated</li>
                    <li>Take over-the-counter pain relievers if needed</li>
                    <li>Use a humidifier to add moisture to the air</li>
                    <li>Gargle with salt water to relieve a sore throat</li>
                    <li>If symptoms persist for more than a week, consult a doctor</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between border-t pt-4">
        {!showResults ? (
          <>
            <Button variant="outline" onClick={resetChecker} disabled={selectedSymptoms.length === 0}>
              Reset
            </Button>
            <Button 
              onClick={checkSymptoms}
              disabled={selectedSymptoms.length === 0}
              className="bg-healthcare-primary"
            >
              Check Symptoms <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={resetChecker}>
              Check Different Symptoms
            </Button>
            <Button className="bg-healthcare-primary">
              Save Results
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default SymptomsChecker;
