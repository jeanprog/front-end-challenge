"use client";

import * as React from "react";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

// Definindo a interface da Message
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  formatTimestamp: (createdAt: Date) => string;
}

// Componente memoizado
export const ChatMessage: React.FC<ChatMessageProps> = React.memo(
  ({ message, isStreaming = false, formatTimestamp }) => {
    return (
      <div
        className={`flex gap-3 ${
          message.role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        {message.role === "assistant" && (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
        )}

        <div
          className={`max-w-[80%] space-y-1 ${
            message.role === "user" ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`inline-block px-4 py-2 rounded-lg ${
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            } ${isStreaming ? "animate-pulse" : ""}`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          <p className="text-xs text-muted-foreground px-1">
            {formatTimestamp(message.createdAt)}
          </p>
        </div>

        {message.role === "user" && (
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>
    );
  }
);

ChatMessage.displayName = "ChatMessage";
