
import UploadInterface from '@/components/upload/upload-interface'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Upload } from 'lucide-react'
import ErrorBoundary from '@/components/error-boundary'

export default function UploadPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Upload Text File
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload a .txt file to process with our AI agent. Files are analyzed for insights, summaries, and key findings.
        </p>
      </div>

      {/* Upload Interface */}
      <div className="max-w-2xl mx-auto">
        <ErrorBoundary>
          <UploadInterface />
        </ErrorBoundary>
      </div>

      {/* Requirements */}
      <Card className="max-w-2xl mx-auto bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            File Requirements
          </CardTitle>
          <CardDescription>
            Please ensure your file meets these requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Supported Format</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Plain text files (.txt)</li>
                <li>• UTF-8 encoding preferred</li>
                <li>• No binary content</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Size Limits</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Maximum 10MB file size</li>
                <li>• Minimum 1 byte content</li>
                <li>• No empty files</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
