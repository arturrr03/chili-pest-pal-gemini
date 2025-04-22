
import ChiliPestIdentifier from '../components/ChiliPestIdentifier';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-leaf-50 to-white py-10 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-leaf-800 mb-4">
            Chili Pest Pal <span className="text-chili-600">Gemini</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Asisten cerdas berbasis AI Gemini untuk mengidentifikasi hama tanaman cabai dan memberikan solusi pengendalian yang tepat.
          </p>
        </div>
        
        <ChiliPestIdentifier />
        
        <footer className="text-center mt-16 text-sm text-gray-500">
          <p>© 2024 Chili Pest Pal - Powered by Gemini 1.5 Flash</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
