
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();
    
    // Basic validation
    if (!content || content.trim().length < 10) {
      console.log("Validation failed: Content too short or empty");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Report content is too short or empty' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing medical report content (${content.length} chars) with Gemini API...`);
    
    if (!geminiApiKey) {
      console.error("Missing Gemini API key in environment variables");
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Gemini API key is not configured on the server'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Use Gemini API to analyze the medical report
    console.log("Sending request to Gemini API...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a highly specialized medical AI assistant. Analyze the provided medical report and provide:
            1. A summary of the findings
            2. Key health indicators and their meanings
            3. Potential concerns that should be discussed with a healthcare provider
            4. Recommended follow-up steps
            
            Structure your response clearly with headings and bullet points where appropriate.
            Include a disclaimer that this analysis is not a medical diagnosis and should not replace professional medical advice.
            
            Now analyze the following report:
            ${content}`
          }]
        }],
        generationConfig: {
          temperature: 0.3, // More deterministic responses for medical content
          maxOutputTokens: 2000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || 'Gemini API request failed';
      
      console.error('Gemini API error:', errorMessage, errorData);
      
      // Handle specific error scenarios
      if (errorMessage.includes("quota") || errorMessage.includes("exceeded") || errorMessage.includes("limit") || errorMessage.includes("Insufficient")) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Gemini API quota exceeded or insufficient balance. Please try again later or contact support.'
          }),
          { 
            status: 429, // Too Many Requests
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      // For development/debugging purposes, provide more detailed error information
      return new Response(
        JSON.stringify({
          success: false,
          error: `Gemini API Error: ${errorMessage}`,
          details: errorData
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log("Gemini API response received successfully");
    
    const analysis = data.candidates[0].content.parts[0].text;
    
    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysis
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Gemini analysis error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to analyze medical report',
        stack: error.stack // Include stack trace for debugging
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
