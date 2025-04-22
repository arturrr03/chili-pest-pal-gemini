// Gemini API integration for Chili Pest Identifier
const API_KEY = "AIzaSyBDRTKdgBkadnzm4WzwbXmZh7nHbUUmB90";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export interface GeminiResponse {
  text: string;
  pestIdentified?: string;
  confidence?: number;
  treatment?: string;
  prevention?: string;
}

export async function identifyPest(imageBase64: string): Promise<GeminiResponse> {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Identifikasi hama yang ada pada tanaman cabai dalam gambar ini. Berikan informasi tentang nama hama, cara pengendalian, dan pencegahannya. Berikan respons dalam bahasa Indonesia tanpa menggunakan simbol bintang atau asterisk. Format respons: nama hama, tingkat keyakinan (0-100%), cara pengendalian, dan cara pencegahan."
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64.split(",")[1]
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 800,
        }
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Error calling Gemini API");
    }

    // Remove any asterisks from the result text
    let result = data.candidates[0].content.parts[0].text.replace(/\*/g, '');
    
    // Parse result to extract structured data
    const pestMatch = result.match(/nama hama:\s*(.+?)(?:\n|$)/i);
    const confidenceMatch = result.match(/keyakinan:\s*(\d+)%/i);
    const treatmentMatch = result.match(/cara pengendalian:\s*(.+?)(?:\n|$)/i);
    const preventionMatch = result.match(/cara pencegahan:\s*(.+?)(?:\n|$)/i);

    return {
      text: result,
      pestIdentified: pestMatch ? pestMatch[1].trim() : undefined,
      confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : undefined,
      treatment: treatmentMatch ? treatmentMatch[1].trim() : undefined,
      prevention: preventionMatch ? preventionMatch[1].trim() : undefined
    };
  } catch (error) {
    console.error("Error identifying pest:", error);
    return {
      text: "Maaf, terjadi kesalahan saat mengidentifikasi hama. Silakan coba lagi."
    };
  }
}

export async function getChatResponse(message: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Pertanyaan tentang hama tanaman cabai: ${message}. 
                Berikan respons dalam bahasa Indonesia yang informatif dan bermanfaat.
                Jangan menggunakan simbol bintang (*) dalam jawaban.
                Jika pertanyaannya tidak terkait dengan hama tanaman cabai, beri tahu pengguna bahwa kamu adalah asisten khusus untuk identifikasi dan informasi hama tanaman cabai.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        }
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Error calling Gemini API");
    }

    // Remove any asterisks from the response
    const responseText = data.candidates[0].content.parts[0].text.replace(/\*/g, '');

    return responseText;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.";
  }
};
