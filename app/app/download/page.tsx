
import DownloadInterface from '@/components/download/download-interface'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText, Zap } from 'lucide-react'
import ErrorBoundary from '@/components/error-boundary'

export default function DownloadPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
          <Download className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Download Processed Files
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Process your uploaded files with AI and download the analyzed results, summaries, and insights.
        </p>
      </div>

      {/* Download Interface */}
      <div className="max-w-4xl mx-auto">
        <ErrorBoundary>
          <DownloadInterface />
        </ErrorBoundary>
      </div>

      {/* Processing Information */}
      <Card className="max-w-4xl mx-auto bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI Processing Features
          </CardTitle>
          <CardDescription>
            Our AI agent analyzes your files and provides comprehensive insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Content Analysis
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automatic content summarization</li>
                <li>• Key topics and themes identification</li>
                <li>• Important insights extraction</li>
                <li>• Sentiment and tone analysis</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Smart Processing
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Context-aware analysis</li>
                <li>• Suggested actions and next steps</li>
                <li>• Structured output formatting</li>
                <li>• Custom processing instructions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
