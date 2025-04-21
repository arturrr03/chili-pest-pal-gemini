
import React from 'react';
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  return (
    <div className={cn(
      "flex items-start gap-3 mb-4",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className={cn(
        "h-8 w-8",
        isUser ? "bg-chili-600" : "bg-leaf-600"
      )}>
        <span className="text-xs font-semibold text-white">
          {isUser ? "Anda" : "AI"}
        </span>
      </Avatar>
      
      <div className={cn(
        "py-2 px-3 rounded-lg max-w-[80%]",
        isUser ? "bg-chili-100 text-gray-800" : "bg-leaf-100 text-gray-800"
      )}>
        <p className="text-sm whitespace-pre-wrap">{message}</p>
        <span className="text-xs text-gray-500 mt-1 block">
          {timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
