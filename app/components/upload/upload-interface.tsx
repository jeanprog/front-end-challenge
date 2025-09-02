
'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useFileStore } from '@/store/useFileStore'

interface UploadedFile {
  file_id: string
  filename: string
  size: number
  upload_time: string
  status: string
}

export default function UploadInterface() {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
   const { files, addFile, removeFile } = useFileStore()
  const { toast } = useToast()

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validate file
    if (!file.name.toLowerCase().endsWith('.txt')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a .txt file',
        variant: 'destructive',
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB',
        variant: 'destructive',
      })
      return
    }

    await uploadFile(file)
  }

   const uploadFile = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Upload failed')

      const result: UploadedFile = await response.json()
      addFile(result)  // 🔹 armazenando no store

      toast({ title: 'Upload successful', description: `${file.name} uploaded!` })
    } catch (error) {
      console.error(error)
      toast({ title: 'Upload failed', description: 'Please try again', variant: 'destructive' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

 /*  const uploadFile = async (file: File) => {
    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result: UploadedFile = await response.json()
      setUploadedFiles(prev => [result, ...prev])
      
      toast({
        title: 'Upload successful',
        description: `${file.name} has been uploaded and is ready for processing`,
      })

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: 'Please try again or check your file',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  } */

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString()
  }


  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card 
        className={`transition-all duration-300 ${
          dragOver 
            ? 'border-primary bg-primary/5 shadow-lg' 
            : 'hover:shadow-md'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Text File
          </CardTitle>
          <CardDescription>
            Drag and drop a .txt file or click to browse (max 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
              dragOver 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <FileText className="w-8 h-8" />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">
                {dragOver ? 'Drop your file here' : 'Select a file to upload'}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports .txt files up to 10MB
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                size="lg"
              >
                {uploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Uploaded Files ({uploadedFiles.length})
            </CardTitle>
            <CardDescription>
              Files ready for processing and analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div 
                  key={file.file_id} 
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{file.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {formatDate(file.upload_time)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Ready
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.file_id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
