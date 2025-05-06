"use client";

import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { Upload, FileUp, X } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import SubscriptionModal from "./subscriptionModal";
import { checkSubscription } from "@/app/services/api";
import { Slider } from "./ui/slider";
import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FREE_USES_LIMIT = parseInt(process.env.FREE_USES_LIMIT as string);

export function PdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [compressionValue, setCompressionValue] = useState([6]); // Default to middle value
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const storedCount = localStorage.getItem("pdfCompressUsageCount");
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
    localStorage.setItem("pdfCompressUsageCount", newCount.toString());
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Invalid file type", {
        description: "Please select a PDF file",
      });
      return;
    }

    setFile(selectedFile);
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

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (droppedFile.type !== "application/pdf") {
      toast.error("Invalid file type", {
        description: "Please drop a PDF file",
      });
      return;
    }

    setFile(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const compressPDF = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please select a PDF file to compress",
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

      const arrayBuffer = await file.arrayBuffer();

      // Calculate compression parameters based on slider value
      const value = compressionValue[0];
      // Start from level 8 compression (quality 0.24, scale 0.6) to maximum compression
      const quality = 0.24 - ((value - 1) * 0.14) / 9; // Maps 1-10 to 0.24-0.1
      const scale = 0.6 - ((value - 1) * 0.1) / 9; // Maps 1-10 to 0.6-0.5

      // Load the PDF using PDF.js
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdfDoc.numPages;

      // Create a new PDF document
      const newPdfDoc = await PDFDocument.create();

      for (let i = 0; i < numPages; i++) {
        // Get the page
        const page = await pdfDoc.getPage(i + 1);
        const viewport = page.getViewport({ scale: scale });

        // Create a canvas with device pixel ratio for better quality
        const pixelRatio = Math.min(2, window.devicePixelRatio || 1); // Cap at 2x
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width * pixelRatio;
        canvas.height = viewport.height * pixelRatio;

        const context = canvas.getContext("2d", {
          alpha: false,
          willReadFrequently: true,
        })!;

        // Scale context for device pixel ratio
        context.scale(pixelRatio, pixelRatio);

        // Set high-quality canvas rendering
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        // Fill with white background
        context.fillStyle = "white";
        context.fillRect(0, 0, viewport.width, viewport.height);

        // Render the page to canvas with better settings
        await page.render({
          canvasContext: context,
          viewport: viewport,
          background: "white",
        }).promise;

        // Convert to JPEG with quality setting
        const imgData = canvas.toDataURL("image/jpeg", quality);

        // Convert base64 to Uint8Array
        const base64 = imgData.split(",")[1];
        const imageBytes = Uint8Array.from(atob(base64), (c) =>
          c.charCodeAt(0)
        );

        // Embed the image in the new PDF
        const image = await newPdfDoc.embedJpg(imageBytes);

        // Add a page with the original dimensions
        const newPage = newPdfDoc.addPage([
          viewport.width / pixelRatio,
          viewport.height / pixelRatio,
        ]);

        // Draw the image on the page
        newPage.drawImage(image, {
          x: 0,
          y: 0,
          width: viewport.width / pixelRatio,
          height: viewport.height / pixelRatio,
        });

        setProgress(((i + 1) / numPages) * 100);
      }

      // Save with optimized settings
      const compressedPdfBytes = await newPdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 100,
      });

      const blob = new Blob([compressedPdfBytes], { type: "application/pdf" });
      const outputName = file.name.replace(".pdf", "") + "_compressed.pdf";
      saveAs(blob, outputName);

      toast.success("Success!", {
        description: "Your PDF has been compressed successfully",
      });

      if (!hasActiveSubscription) {
        incrementUsageCount();
      }
    } catch (error) {
      console.error("Error compressing PDF:", error);
      toast.error("Error", {
        description: `Failed to compress PDF: ${error}`,
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
                ${file ? "border-theme-500 bg-theme-50" : "border-gray-300"}
                ${isDragging ? "border-theme-400 bg-theme-50 scale-[1.02]" : ""}
                ${
                  !file &&
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
                    ${file ? "text-theme-500" : "text-gray-400"}
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
                  {file
                    ? file.name
                    : isDragging
                    ? "Drop your PDF file here"
                    : "Click to upload or drag and drop a PDF file"}
                </span>
              </label>
            </div>
          </div>

          {/* File List */}
          {file && (
            <div className="flex items-center justify-between p-3 bg-theme-50 rounded-lg">
              <span className="text-gray-700 break-all">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                className="text-theme-500 hover:text-theme-700 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Compression Slider */}
          {file && (
            <div className="space-y-6">
              <div className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                Select Compression Level
              </div>

              <div className="px-4">
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>Less Compression</span>
                  <span>More Compression</span>
                </div>
                <Slider
                  defaultValue={[5]}
                  value={compressionValue}
                  onValueChange={setCompressionValue}
                  max={11}
                  min={1}
                  step={1}
                  className="w-full cursor-grab"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">Higher Quality</span>
                  <span className="text-xs text-gray-500">Smaller Size</span>
                </div>
              </div>
            </div>
          )}

          {/* Compress Button and Progress */}
          <div className="space-y-4">
            <Button
              onClick={compressPDF}
              disabled={processing || !file}
              className="w-full bg-theme-600 hover:bg-theme-700 text-white h-12 text-lg"
            >
              <FileUp className="mr-2 h-5 w-5" />
              {processing ? "Processing..." : "Compress PDF"}
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
