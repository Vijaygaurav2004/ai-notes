import { NextResponse } from 'next/server';

// Enable CORS for local development
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  console.log('POST /api/summarize - Request received');
  
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured in environment variables');
      return NextResponse.json(
        { message: 'API configuration error. Please contact the administrator.' },
        { status: 500, headers: corsHeaders }
      );
    }

    const { content } = await request.json();
    console.log('Request content length:', content?.length || 0);

    if (!content) {
      return NextResponse.json(
        { message: 'Content is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('Calling Gemini API with API key:', 
      process.env.GEMINI_API_KEY?.substring(0, 5) + '...');

    // Call Gemini API for summarization
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert summarizer with exceptional skills in distilling information into clear, concise, and insightful summaries.

Please create a thoughtful, well-crafted summary of the following text. The summary should:
- Capture the core ideas and key points
- Be concise yet comprehensive (2-3 sentences)
- Use engaging language that's easy to understand
- Preserve the original tone and intent of the content
- Highlight any important insights or conclusions

Here's the text to summarize:

${content}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 250,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || `API error: ${response.status}`;
      } catch (e) {
        errorMessage = `Failed to generate summary. Status: ${response.status}, Response: ${errorText.substring(0, 100)}`;
      }
      
      console.error('Gemini API error:', errorMessage);
      
      // Return appropriate status based on response
      let status = response.status;
      if (status === 401 || status === 403) {
        return NextResponse.json(
          { message: 'API authentication error. Please check API key configuration.' },
          { status, headers: corsHeaders }
        );
      }
      
      return NextResponse.json(
        { message: errorMessage },
        { status, headers: corsHeaders }
      );
    }

    const data = await response.json();
    // Extract the summary from Gemini response format
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated.';
    console.log('Summary generated successfully');

    return NextResponse.json({ summary }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Summarization error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}