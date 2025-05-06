"use client";

import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import {
  Upload,
  FileUp,
  X,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import SubscriptionModal from "./subscriptionModal";
import { checkSubscription } from "@/app/services/api";

const FREE_USES_LIMIT = parseInt(process.env.FREE_USES_LIMIT as string);

export function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const storedCount = localStorage.getItem("pdfMergeUsageCount");
    setUsageCount(storedCount ? parseInt(storedCount) : 0);

    const checkSubscriptionStatus = async () => {
      if (user?.publicMetadata?.stripeSubscriptionId) {
        try {
          const data = await checkSubscription(
            user.publicMetadata.stripeSubscriptionId as string
          );
          setHasActiveSubscription(data.isActive);
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
    };

    if (isSignedIn) {
      checkSubscriptionStatus();
    }
  }, [user, isSignedIn]);

  const incrementUsageCount = () => {
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem("pdfMergeUsageCount", newCount.toString());
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).filter((file) => {
      if (file.type !== "application/pdf") {
        toast.error("Invalid file type", {
          description: `${file.name} is not a PDF file`,
        });
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => {
      if (file.type !== "application/pdf") {
        toast.error("Invalid file type", {
          description: `${file.name} is not a PDF file`,
        });
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      const draggedFile = newFiles[draggedIndex];
      newFiles.splice(draggedIndex, 1);
      newFiles.splice(index, 0, draggedFile);
      return newFiles;
    });

    setDraggedIndex(index);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedIndex(null);
  };

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    handleDragStart(index);
  };

  const handleTouchMove = (e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const fileElement = elements.find(
      (el) => el.getAttribute("data-file-index") !== null
    );
    if (fileElement) {
      const targetIndex = parseInt(
        fileElement.getAttribute("data-file-index") || "0"
      );
      handleDragEnter(targetIndex);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setDraggedIndex(null);
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= files.length) return;

    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error("Not enough files", {
        description: "Please add at least 2 PDF files to merge",
      });
      return;
    }

    if (isSignedIn && !hasActiveSubscription) {
      setShowSubscribeModal(true);
      return;
    }

    if (!isSignedIn && usageCount >= FREE_USES_LIMIT) {
      setShowSubscribeModal(true);
      return;
    }

    try {
      setProcessing(true);
      setProgress(0);

      const mergedPdf = await PDFDocument.create();
      const totalFiles = files.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        pages.forEach((page) => mergedPdf.addPage(page));

        setProgress(((i + 1) / totalFiles) * 100);
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

      // Use the first file's name for the output
      const outputName = files[0].name.replace(".pdf", "") + "_merged.pdf";
      saveAs(blob, outputName);

      toast.success("Success!", {
        description: "Your PDFs have been merged successfully",
      });

      if (!hasActiveSubscription) {
        incrementUsageCount();
      }
    } catch (error) {
      toast.error("Error", {
        description: `Failed to merge PDFs: ${error}`,
      });
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <Card className="p-8 bg-white shadow-lg">
        <div className="space-y-8">
          {/* Upload Section */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`
                w-full 
                border-2 
                border-dashed 
                rounded-lg 
                p-12
                min-h-[200px]
                flex
                flex-col
                items-center
                justify-center
                transition-all
                duration-200
                ease-in-out
                ${
                  files.length > 0
                    ? "border-theme-500 bg-theme-50"
                    : "border-gray-300"
                }
                ${isDragging ? "border-theme-400 bg-theme-50 scale-[1.02]" : ""}
                ${
                  !files.length &&
                  !isDragging &&
                  "hover:border-theme-300 hover:bg-theme-50"
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                id="pdf-upload"
                disabled={processing}
                className="hidden"
                multiple
              />
              <label
                htmlFor="pdf-upload"
                className={`
                  flex 
                  flex-col 
                  items-center 
                  justify-center 
                  cursor-pointer 
                  space-y-4
                  transition-transform
                  duration-200
                  ${isDragging ? "scale-110" : ""}
                `}
              >
                <Upload
                  className={`
                    w-16 
                    h-16 
                    transition-colors 
                    duration-200
                    ${files.length > 0 ? "text-theme-500" : "text-gray-400"}
                    ${isDragging ? "text-theme-500" : ""}
                  `}
                />
                <span
                  className={`
                    text-lg
                    text-center
                    transition-colors
                    duration-200
                    ${isDragging ? "text-theme-500" : "text-gray-600"}
                  `}
                >
                  {files.length > 0
                    ? `${files.length} PDF${
                        files.length === 1 ? "" : "s"
                      } selected`
                    : isDragging
                    ? "Drop your PDF files here"
                    : "Click to upload or drag and drop PDF files"}
                </span>
              </label>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                Beginning of merged PDF
              </div>

              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    data-file-index={index}
                    className={`
                      flex items-stretch justify-between p-3 bg-theme-50 rounded-lg
                      transition-all duration-200 ease-in-out
                      ${draggedIndex === index ? "opacity-50" : "opacity-100"}
                      transform
                      cursor-move md:touch-none
                    `}
                    draggable="true"
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDragEnd}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex items-stretch min-w-0 flex-1 mr-2">
                      {/* Desktop drag handle */}
                      <div className="hidden md:flex items-center">
                        <GripVertical className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                      </div>

                      {/* Mobile arrow buttons */}
                      <div className="flex md:hidden items-stretch flex-col justify-between mr-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-gray-600 flex-shrink-0"
                          onClick={() => moveFile(index, index - 1)}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-gray-600 flex-shrink-0"
                          onClick={() => moveFile(index, index + 1)}
                          disabled={index === files.length - 1}
                        >
                          <ChevronDown className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="flex items-center">
                        <span className="text-gray-700 break-all">
                          {file.name}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="text-theme-500 hover:text-theme-700 flex-shrink-0 self-center"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                End of merged PDF
              </div>
            </div>
          )}

          {/* Merge Button and Progress */}
          <div className="space-y-4">
            <Button
              onClick={mergePDFs}
              disabled={processing || files.length < 2}
              className="w-full bg-theme-600 hover:bg-theme-700 text-white h-12 text-lg"
            >
              <FileUp className="mr-2 h-5 w-5" />
              {processing ? "Processing..." : "Merge PDFs"}
            </Button>

            {processing && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-center text-sm text-gray-600">
                  {Math.round(progress)}%
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <SubscriptionModal
        open={showSubscribeModal}
        onOpenChange={setShowSubscribeModal}
      />
    </div>
  );
}
