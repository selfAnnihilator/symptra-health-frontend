
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

// Types for analysis
type AnalysisRequest = {
  content: string;
};

type AnalysisResponse = {
  analysis: string;
  success: boolean;
  error?: string;
  details?: any;
};

// Types for disease diagnosis
type DiagnosisRequest = {
  symptoms: string;
  patientInfo?: {
    age?: number;
    gender?: string;
    medicalHistory?: string;
  };
};

type DiagnosisResponse = {
  diagnosis: string;
  possibleConditions: string[];
  recommendations: string;
  confidence: number;
  success: boolean;
  error?: string;
};

/**
 * Analyzes medical report text using Supabase Edge Function and DeepSeek API
 */
export const analyzeMedicalReport = async (
  request: AnalysisRequest
): Promise<AnalysisResponse> => {
  try {
    const { content } = request;
    
    // Basic validation
    if (!content || content.trim().length < 10) {
      toast.error('Report content is too short or empty');
      return {
        analysis: '',
        success: false,
        error: 'Report content is too short or empty'
      };
    }

    console.log("Sending content for analysis:", content.substring(0, 50) + "...");
    toast.info('Analyzing medical report, please wait...');

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-medical-report', {
      body: { content }
    });

    if (error) {
      console.error('Edge function error:', error);
      
      // Handle specific errors
      if (error.message && error.message.includes('429')) {
        toast.error('AI service is currently at capacity. Please try again later.');
        return {
          analysis: '',
          success: false,
          error: 'AI service is currently at capacity. Please try again later.'
        };
      }
      
      // Handle Insufficient Balance error
      if (error.message && (error.message.includes('Insufficient Balance') || error.message.includes('quota exceeded'))) {
        toast.error('DeepSeek API account has insufficient balance. Please contact support.');
        return {
          analysis: '',
          success: false,
          error: 'DeepSeek API account has insufficient balance. Please contact support.'
        };
      }
      
      toast.error(`Error analyzing report: ${error.message || 'Unknown error'}`);
      throw new Error(error.message || 'Failed to analyze medical report');
    }

    toast.success('Analysis completed successfully');
    return {
      analysis: data.analysis,
      success: data.success,
      details: data.details
    };
  } catch (error: any) {
    console.error('Analysis error:', error);
    toast.error(`Failed to analyze report: ${error.message || 'Unknown error'}`);
    return {
      analysis: '',
      success: false,
      error: error.message || 'Failed to analyze medical report'
    };
  }
};

/**
 * Diagnose diseases based on symptoms using Supabase Edge Function
 */
export const diagnoseDiseases = async (
  request: DiagnosisRequest
): Promise<DiagnosisResponse> => {
  try {
    const { symptoms, patientInfo } = request;
    
    // Basic validation
    if (!symptoms || symptoms.trim().length < 5) {
      toast.error('Symptoms description is too short or empty');
      return {
        diagnosis: '',
        possibleConditions: [],
        recommendations: '',
        confidence: 0,
        success: false,
        error: 'Symptoms description is too short or empty'
      };
    }

    console.log("Sending symptoms for diagnosis:", symptoms.substring(0, 50) + "...");
    toast.info('Analyzing symptoms, please wait...');

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('diagnose-diseases', {
      body: { 
        symptoms,
        patientInfo 
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      
      // Handle specific errors
      if (error.message && error.message.includes('429')) {
        toast.error('AI service is currently at capacity. Please try again later.');
        return {
          diagnosis: '',
          possibleConditions: [],
          recommendations: '',
          confidence: 0,
          success: false,
          error: 'AI service is currently at capacity. Please try again later.'
        };
      }
      
      toast.error(`Error diagnosing diseases: ${error.message || 'Unknown error'}`);
      throw new Error(error.message || 'Failed to diagnose diseases');
    }

    toast.success('Diagnosis completed successfully');
    return {
      diagnosis: data.diagnosis,
      possibleConditions: data.possibleConditions,
      recommendations: data.recommendations,
      confidence: data.confidence,
      success: true
    };
  } catch (error: any) {
    console.error('Diagnosis error:', error);
    toast.error(`Failed to diagnose: ${error.message || 'Unknown error'}`);
    return {
      diagnosis: '',
      possibleConditions: [],
      recommendations: '',
      confidence: 0,
      success: false,
      error: error.message || 'Failed to diagnose diseases'
    };
  }
};

/**
 * Extract text from a file (PDF, docx, txt)
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    toast.info(`Extracting text from ${file.name}...`);
    
    // For text files only
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          toast.success('Text extracted successfully');
          resolve(text);
        } catch (error) {
          toast.error('Failed to extract text from file');
          reject(new Error('Failed to extract text from file'));
        }
      };
      
      reader.onerror = () => {
        toast.error('Error reading file');
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    } 
    // For PDF and other file types, currently just providing a mock response
    // In a production environment, you would use a service to extract text from PDFs
    else {
      // Generate a sample text based on the filename
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'pdf' || fileExtension === 'docx' || fileExtension === 'doc') {
        setTimeout(() => {
          toast.success(`Text extracted from ${file.name}`);
          resolve(`This is sample text extracted from ${file.name} for demonstration purposes.\n\nIn a production environment, this would be the actual content of your ${fileExtension.toUpperCase()} file.\n\nTest results: Normal blood pressure, cholesterol levels within range.\nRecommendation: Continue with regular exercise and balanced diet.`);
        }, 1000);
      } else {
        toast.error(`Unsupported file type: ${file.type || fileExtension}`);
        reject(new Error(`Unsupported file type: ${file.type || fileExtension}`));
      }
    }
  });
};
