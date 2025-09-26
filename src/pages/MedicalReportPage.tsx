import Navigation from "@/components/Navigation";
import MedicalReportAnalyzer from "@/components/diagnosis/MedicalReportAnalyzer";

const MedicalReportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <MedicalReportAnalyzer />
      </div>
    </div>
  );
};

export default MedicalReportPage;
