
import dynamic from 'next/dynamic';
import { ChatSkeleton } from '@/components/chat/chat-skeleton';

const ChatInterface = dynamic(
  () => import('@/components/chat/chat-interface'),
  {
    ssr: false,
    loading: () => <ChatSkeleton />,
  }
);


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Bot, AlertCircle } from 'lucide-react'
import ErrorBoundary from '@/components/error-boundary'

export default function ChatPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
          <MessageSquare className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Chat with AI Agent
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a conversation with our AI agent about your uploaded files or ask general questions.
        </p>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto">
        <ErrorBoundary>
          <ChatInterface />
        </ErrorBoundary>
      </div>

      {/* Instructions for Developers */}
      <Card className="max-w-4xl mx-auto border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            TODO: Chat Implementation
          </CardTitle>
          <CardDescription className="text-yellow-700 dark:text-yellow-300">
            This section needs to be completed by candidates
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-yellow-700 dark:text-yellow-300 space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">Required Features to Implement:</h4>
            <ul className="space-y-1 pl-4">
              <li>• Real-time message streaming from the backend</li>
              <li>• File context integration (reference uploaded files in chat)</li>
              <li>• Conversation history management</li>
              <li>• Error handling for API failures</li>
              <li>• Loading states and typing indicators</li>
              <li>• Message formatting and syntax highlighting</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Technical Requirements:</h4>
            <ul className="space-y-1 pl-4">
              <li>• Use the streaming endpoint: <code>/api/chat/stream/{`{conversationId}`}</code></li>
              <li>• Implement proper WebSocket or Server-Sent Events</li>
              <li>• Handle conversation state management</li>
              <li>• Add proper TypeScript types</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
