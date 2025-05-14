
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  maxSize?: number; // Size in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = ".pdf,.docx,.doc,.jpg,.jpeg",
  maxSize = 10 // Default 10MB
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      toast({
        title: "Error",
        description: `File size exceeds ${maxSize}MB limit`,
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = acceptedFileTypes
      .split(',')
      .map(type => type.replace('.', '').toLowerCase());
      
    if (fileExt && !allowedExts.includes(fileExt)) {
      toast({
        title: "Error",
        description: "File type not supported. Please upload a PDF, Word document, or JPG image.",
        variant: "destructive",
      });
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-md p-6 text-center ${
        dragActive ? "border-primary bg-primary/5" : "border-gray-300"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        className="hidden"
        id="file-upload"
      />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-medium">
            Drag & drop your file here, or
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            PDF, Word document, or JPG (Max {maxSize}MB)
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
        >
          Browse Files
        </Button>
      </div>
    </div>
  );
};
