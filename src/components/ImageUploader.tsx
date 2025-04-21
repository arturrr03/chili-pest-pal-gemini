
import React, { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (base64Image: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);
  
  const handleFile = useCallback((file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        onImageUpload(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);
  
  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
        dragActive ? "border-leaf-500 bg-leaf-50" : "border-gray-300",
        isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-leaf-400"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={isLoading}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="w-full h-full flex flex-col items-center cursor-pointer">
        <Leaf className="h-12 w-12 text-leaf-500 mb-2" />
        <div className="text-xl font-medium mb-1 text-gray-700">
          Upload Gambar Tanaman Cabai
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Tarik dan lepas gambar di sini, atau klik untuk memilih gambar
        </p>
        <Button 
          disabled={isLoading}
          className="bg-leaf-600 hover:bg-leaf-700"
        >
          {isLoading ? "Menganalisis..." : "Pilih Gambar"}
        </Button>
      </label>
    </div>
  );
};

import { cn } from "@/lib/utils";

export default ImageUploader;
