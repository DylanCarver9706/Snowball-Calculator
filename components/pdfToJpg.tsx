"use client";

import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Upload, FileUp, Download, X } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import SubscriptionModal from "./subscriptionModal";
import { checkSubscription } from "@/app/services/api";
import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ConvertedPage {
  number: number;
  blob: Blob;
  width: number;
  height: number;
}

const FREE_USES_LIMIT = parseInt(process.env.FREE_USES_LIMIT as string);

export function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedPages, setConvertedPages] = useState<ConvertedPage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const { user, isSignedIn } = useUser();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  useEffect(() => {
    const storedCount = localStorage.getItem("pdfToJpgUsageCount");
    if (storedCount) {
      setUsageCount(parseInt(storedCount));
    }
  }, []);

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    try {
      if (!user?.publicMetadata?.stripeSubscriptionId) {
        setHasActiveSubscription(false);
        return;
      }

      const responseJson = await checkSubscription(
        user.publicMetadata.stripeSubscriptionId as string
      );

      const activeSubscription =
        responseJson.isActive === true ||
        (responseJson.isActive === false &&
          responseJson.currentPeriodEnd * 1000 > Date.now());

      setHasActiveSubscription(activeSubscription);

      if (user && activeSubscription) {
        localStorage.removeItem("pdfToJpgUsageCount");
        setUsageCount(0);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setHasActiveSubscription(false);
    }
  };

  const incrementUsageCount = () => {
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem("pdfToJpgUsageCount", newCount.toString());
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile?.type !== "application/pdf") {
      toast.error("Invalid file type", {
        description: "Please upload a PDF file",
      });
      return;
    }
    setFile(selectedFile);
    setConvertedPages([]);
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
    if (droppedFile?.type !== "application/pdf") {
      toast.error("Invalid file type", {
        description: "Please upload a PDF file",
      });
      return;
    }
    setFile(droppedFile);
    setConvertedPages([]);
  };

  const removeFile = () => {
    setFile(null);
    setConvertedPages([]);
  };

  const convertToJpg = async () => {
    if (!file) return;

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
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      const newPages: ConvertedPage[] = [];

      // Load the PDF using PDF.js
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();

        // Get the PDF.js page
        const pdfJsPage = await pdf.getPage(i + 1);

        // Set viewport with 2x scale for better quality
        const viewport = pdfJsPage.getViewport({ scale: 2.0 });

        // Create canvas with proper dimensions
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d")!;

        // Render PDF page to canvas
        await pdfJsPage.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Convert canvas to JPG blob
        const jpgBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
            },
            "image/jpeg",
            0.9 // Quality setting for JPEG (0.9 = 90% quality)
          );
        });

        newPages.push({
          number: i + 1,
          blob: jpgBlob,
          width: viewport.width,
          height: viewport.height,
        });

        setProgress(((i + 1) / pageCount) * 100);
      }

      setConvertedPages(newPages);

      toast.success("Success!", {
        description: "Your PDF has been converted to JPG images",
      });

      if (!hasActiveSubscription) {
        incrementUsageCount();
      }
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Error", {
        description: `Failed to convert PDF: ${error}`,
      });
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const downloadSinglePage = (page: ConvertedPage) => {
    saveAs(page.blob, `${file?.name.split(".")[0]}_page_${page.number}.jpg`);
  };

  const downloadAllPagesZip = async () => {
    const zip = new JSZip();

    convertedPages.forEach((page) => {
      zip.file(
        `${file?.name.split(".")[0]}_page_${page.number}.jpg`,
        page.blob
      );
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${file?.name.split(".")[0]}_all_pages.zip`);
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

          {/* Convert Button and Progress */}
          {file && (
            <div className="space-y-4">
              <Button
                onClick={convertToJpg}
                disabled={processing}
                className="w-full bg-theme-600 hover:bg-theme-700 text-white h-12 text-lg"
              >
                <FileUp className="mr-2 h-5 w-5" />
                {processing ? "Processing..." : "Convert to JPG"}
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
          )}

          {/* Converted Pages Results */}
          {convertedPages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center text-gray-900">
                Converted Pages
              </h3>
              <Button
                onClick={downloadAllPagesZip}
                className="w-full bg-theme-600 hover:bg-theme-700 text-white h-12 text-lg"
              >
                <Download className="mr-2 h-5 w-5" />
                Download All Pages as ZIP
              </Button>

              <div className="grid grid-cols-2 gap-2">
                {convertedPages.map((page) => (
                  <Button
                    key={page.number}
                    onClick={() => downloadSinglePage(page)}
                    variant="outline"
                    className="w-full border-theme-200 hover:bg-theme-50 text-theme-600"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Page {page.number}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
      <SubscriptionModal
        open={showSubscribeModal}
        onOpenChange={setShowSubscribeModal}
      />
    </div>
  );
}
