import { FileText, MessageSquare, Download, Bot } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Agent UI Challenge
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload text files, process them with AI agents, and download the
          results. Built with Next.js, FastAPI, and OpenRouter integration.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Upload .txt files up to 10MB for AI processing and analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/upload">
              <Button className="w-full">Start Upload</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Chat with Agent</CardTitle>
            <CardDescription>
              Interactive conversation with AI agent about your uploaded files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chat">
              <Button className="w-full" variant="outline">
                Start Chat
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Download Results</CardTitle>
            <CardDescription>
              Process files and download AI-generated analysis and summaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/download">
              <Button className="w-full" variant="secondary">
                View Downloads
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Technology Stack */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>
            This challenge demonstrates modern full-stack development with AI
            integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <h4 className="font-medium">Frontend</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Next.js 14</li>
                <li>• React 18</li>
                <li>• Tailwind CSS</li>
                <li>• Shadcn UI</li>
              </ul>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Backend</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• FastAPI</li>
                <li>• Python 3.11+</li>
                <li>• Async/Await</li>
                <li>• File Processing</li>
              </ul>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">AI Integration</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• OpenRouter API</li>
                <li>• Agno Framework</li>
                <li>• Streaming Chat</li>
                <li>• Multiple Models</li>
              </ul>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Features</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• File Upload</li>
                <li>• Real-time Chat</li>
                <li>• File Processing</li>
                <li>• Download System</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions for Developers */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="text-orange-800 dark:text-orange-200">
            🚧 Developer Instructions
          </CardTitle>
          <CardDescription className="text-orange-700 dark:text-orange-300">
            Areas marked with TODO are intended for candidates to implement
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-orange-700 dark:text-orange-300 space-y-2">
          <p>
            • Complete the chat interface implementation in <code>/chat</code>
          </p>
          <p>• Add error handling and loading states throughout the app</p>
          <p>• Enhance the file processing pipeline with additional features</p>
          <p>• Implement conversation history and export functionality</p>
          <p>• Add unit tests and API integration tests</p>
        </CardContent>
      </Card>
    </div>
  );
}
