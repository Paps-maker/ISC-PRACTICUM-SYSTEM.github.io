
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { FileUploadProps } from "@/types";

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  acceptedFileTypes = "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
  maxSize = 5 // 5MB 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    
    // Validate file type
    const fileType = file.type;
    if (!acceptedFileTypes.includes(fileType)) {
      setError("Invalid file type. Please upload a supported document format.");
      return;
    }
    
    // Validate file size (convert maxSize to bytes)
    const fileSizeInMB = file.size / 1024 / 1024;
    if (fileSizeInMB > maxSize) {
      setError(`File is too large. Maximum size is ${maxSize}MB.`);
      return;
    }
    
    // All validations passed
    onFileSelect(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
        } flex flex-col items-center justify-center gap-2`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drag and drop your file here or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          PDF, DOC, or DOCX (Max {maxSize}MB)
        </p>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={acceptedFileTypes}
        className="hidden"
        aria-label="File upload"
      />
      
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
