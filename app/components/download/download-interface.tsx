"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, FileText, Zap, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFileStore, UploadedFile } from "@/store/useFileStore";

interface OutputFile {
  filename: string;
  size: number;
  created: string;
  modified: string;
}

interface ProcessedFile {
  file_id: string;
  output_filename: string;
  processing_status: string;
  summary: string;
  processed_at: string;
}

export default function DownloadInterface() {
  const [fileId, setFileId] = useState("");
  const [processingInstructions, setProcessingInstructions] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [availableFiles, setAvailableFiles] = useState<OutputFile[]>([]);
  const { files } = useFileStore(); // arquivos do upload
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableFiles();
  }, []);

  const fetchAvailableFiles = async () => {
    try {
      const response = await fetch("/api/download/list");
      if (response.ok) {
        const data = await response.json();
        setAvailableFiles(data.files || []);
      }
    } catch (error) {
      console.error("Failed to fetch available files:", error);
    }
  };

  const processFile = async () => {
    if (!fileId.trim()) {
      toast({
        title: "File ID required",
        description: "Please enter a file ID to process",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/download/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_id: fileId,
          processing_instructions: processingInstructions || undefined,
        }),
      });
      if (!response.ok) throw new Error("Processing failed");
      const result: ProcessedFile = await response.json();
      setProcessedFiles((prev) => [result, ...prev]);

      toast({
        title: "Processing completed",
        description: `File has been processed and is ready for download`,
      });

      await fetchAvailableFiles();
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing failed",
        description: "Please check the file ID and try again",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadFile = async (filename: string) => {
    try {
      const response = await fetch(`/api/download/file/${filename}`);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download started",
        description: `${filename} is being downloaded`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const handleSelectUploadedFile = (fileId: string) => {
    setFileId(fileId);
    toast({
      title: "UUID set",
      description: `File UUID ${fileId} selected for processing`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Uploaded Files List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Uploaded Files ({files.length})
            </CardTitle>
            <CardDescription>
              Click a file to set its UUID for processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.file_id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{file.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} •{" "}
                        {formatDate(file.upload_time)}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSelectUploadedFile(file.file_id)}
                  >
                    Copy UUID
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Process File */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Process File with AI
          </CardTitle>
          <CardDescription>
            Enter a file ID from your uploads to process it with our AI agent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fileId">File ID</Label>
            <Input
              id="fileId"
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              placeholder="Enter the file ID from your upload"
              disabled={processing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">
              Processing Instructions (Optional)
            </Label>
            <Textarea
              id="instructions"
              value={processingInstructions}
              onChange={(e) => setProcessingInstructions(e.target.value)}
              placeholder="Provide specific instructions for how you want the file to be analyzed..."
              rows={3}
              disabled={processing}
            />
          </div>

          <Button
            onClick={processFile}
            disabled={processing || !fileId.trim()}
            className="w-full"
          >
            {processing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Process File
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recently Processed Files */}
      {processedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Recently Processed ({processedFiles.length})
            </CardTitle>
            <CardDescription>Files processed in this session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedFiles.map((file, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{file.output_filename}</p>
                      <p className="text-sm text-muted-foreground">
                        Processed: {formatDate(file.processed_at)}
                      </p>
                    </div>
                    <Button onClick={() => downloadFile(file.output_filename)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  {file.summary && (
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm font-medium mb-1">Summary:</p>
                      <p className="text-sm text-muted-foreground">
                        {file.summary}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Files */}
      {availableFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Available Downloads ({availableFiles.length})
            </CardTitle>
            <CardDescription>
              All processed files available for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableFiles.map((file) => (
                <div
                  key={file.filename}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{file.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {formatDate(file.created)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(file.filename)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Files Message */}
      {availableFiles.length === 0 && processedFiles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Download className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">No processed files yet</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a file first, then process it to see download options
                  here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
