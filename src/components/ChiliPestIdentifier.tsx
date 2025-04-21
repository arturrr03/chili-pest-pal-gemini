
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Leaf, Bug } from "lucide-react";
import ImageUploader from './ImageUploader';
import ChatMessage from './ChatMessage';
import { identifyPest, getChatResponse, type GeminiResponse } from '@/utils/geminiAPI';

interface ChatHistory {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const ChiliPestIdentifier: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      message: "Halo! Saya adalah asisten identifikasi hama tanaman cabai. Kamu dapat menanyakan informasi tentang hama tanaman cabai atau mengunggah foto tanaman cabai untuk dianalisis.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analyzeResult, setAnalyzeResult] = useState<GeminiResponse | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage = inputMessage;
    setInputMessage("");
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, {
      message: userMessage,
      isUser: true,
      timestamp: new Date()
    }]);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Get response from Gemini API
      const response = await getChatResponse(userMessage);
      
      // Add AI response to chat history
      setChatHistory(prev => [...prev, {
        message: response,
        isUser: false,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message to chat history
      setChatHistory(prev => [...prev, {
        message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (base64Image: string) => {
    setUploadedImage(base64Image);
    setIsLoading(true);
    setActiveTab("analyze");
    
    try {
      const result = await identifyPest(base64Image);
      setAnalyzeResult(result);
      
      // Add the analysis to the chat history
      setChatHistory(prev => [
        ...prev, 
        {
          message: "Saya telah mengupload gambar tanaman cabai untuk dianalisis.",
          isUser: true,
          timestamp: new Date()
        },
        {
          message: result.text,
          isUser: false,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setAnalyzeResult({
        text: "Maaf, terjadi kesalahan saat menganalisis gambar. Silakan coba lagi."
      });
      
      // Add error message to chat history
      setChatHistory(prev => [...prev, {
        message: "Maaf, terjadi kesalahan saat menganalisis gambar. Silakan coba lagi.",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-leaf-200">
      <CardHeader className="bg-gradient-to-r from-leaf-500 to-chili-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-6 w-6" />
            <CardTitle>Chili Pest Identifier</CardTitle>
          </div>
          <Leaf className="h-5 w-5" />
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4">
          <TabsList className="w-full mt-2">
            <TabsTrigger value="chat" className="flex-1">
              Chat
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex-1">
              Analisis Gambar
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="p-4">
          <TabsContent value="chat" className="mt-0">
            <ScrollArea className="h-[50vh] pr-4" ref={scrollRef}>
              <div className="flex flex-col">
                {chatHistory.map((chat, index) => (
                  <ChatMessage
                    key={index}
                    message={chat.message}
                    isUser={chat.isUser}
                    timestamp={chat.timestamp}
                  />
                ))}
              </div>
            </ScrollArea>
            
            <Separator className="my-4" />
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tulis pesan..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !inputMessage.trim()}
                className="bg-chili-600 hover:bg-chili-700"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="analyze" className="mt-0 space-y-4">
            <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
            
            {uploadedImage && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Gambar Diunggah:</h4>
                <div className="relative aspect-video w-full max-h-[300px] overflow-hidden rounded-lg bg-gray-100">
                  <img 
                    src={uploadedImage} 
                    alt="Tanaman Cabai" 
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-pulse flex flex-col items-center">
                  <Bug className="h-10 w-10 text-leaf-500 mb-2" />
                  <p className="text-gray-500">Menganalisis gambar tanaman...</p>
                </div>
              </div>
            )}
            
            {analyzeResult && !isLoading && (
              <div className="border rounded-lg p-4 bg-leaf-50">
                <h3 className="text-lg font-semibold mb-2">Hasil Analisis</h3>
                <div className="space-y-2">
                  {analyzeResult.pestIdentified && (
                    <div>
                      <span className="font-medium">Hama Teridentifikasi:</span> 
                      <span className="text-chili-700">{analyzeResult.pestIdentified}</span>
                      {analyzeResult.confidence && (
                        <span className="ml-2 text-sm text-gray-500">
                          (Keyakinan: {analyzeResult.confidence}%)
                        </span>
                      )}
                    </div>
                  )}
                  
                  {analyzeResult.treatment && (
                    <div>
                      <span className="font-medium">Cara Pengendalian:</span> 
                      <p className="text-gray-700">{analyzeResult.treatment}</p>
                    </div>
                  )}
                  
                  {analyzeResult.prevention && (
                    <div>
                      <span className="font-medium">Cara Pencegahan:</span> 
                      <p className="text-gray-700">{analyzeResult.prevention}</p>
                    </div>
                  )}
                  
                  {!analyzeResult.pestIdentified && (
                    <p className="text-gray-700">{analyzeResult.text}</p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default ChiliPestIdentifier;
