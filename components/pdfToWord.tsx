"use client";

import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { Upload, FileUp, X } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import SubscriptionModal from "./subscriptionModal";
import { checkSubscription } from "@/app/services/api";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph, TextRun } from "docx";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FREE_USES_LIMIT = parseInt(process.env.FREE_USES_LIMIT as string);

export function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const storedCount = localStorage.getItem("pdfToWordUsageCount");
    setUsageCount(storedCount ? parseInt(storedCount) : 0);

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
        localStorage.removeItem("pdfToWordUsageCount");
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
    localStorage.setItem("pdfToWordUsageCount", newCount.toString());
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

  const convertToWord = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please select a PDF file to convert",
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
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdfDoc.numPages;

      let fullText = "";
      let currentProgress = 0;

      // Extract text from each page
      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");

        fullText += pageText + "\\n\\n"; // Add double line breaks between pages

        currentProgress = (i / numPages) * 100;
        setProgress(currentProgress);
      }

      // Convert text to DOCX format
      const docx = await generateDocx(fullText);

      // Save the file
      const blob = new Blob([docx], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const outputName = file.name.replace(".pdf", "") + ".docx";
      saveAs(blob, outputName);

      toast.success("Success!", {
        description: "Your PDF has been converted to Word successfully",
      });

      if (!hasActiveSubscription) {
        incrementUsageCount();
      }
    } catch (error) {
      console.error("Error converting PDF:", error);
      toast.error("Error", {
        description: `Failed to convert PDF: ${error}`,
      });
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  // Helper function to generate DOCX content
  const generateDocx = async (text: string) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: text.split("\\n").map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 24, // 12pt font
                  }),
                ],
              })
          ),
        },
      ],
    });

    return await Packer.toBuffer(doc);
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
          <div className="space-y-4">
            <Button
              onClick={convertToWord}
              disabled={processing || !file}
              className="w-full bg-theme-600 hover:bg-theme-700 text-white h-12 text-lg"
            >
              <FileUp className="mr-2 h-5 w-5" />
              {processing ? "Converting..." : "Convert to Word"}
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
