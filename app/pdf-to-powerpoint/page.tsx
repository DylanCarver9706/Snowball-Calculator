import { PdfToPowerPoint } from "@/components/pdfToPowerPoint";

export default function PdfToPowerPointPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-b from-white to-gray-100">
      <div className="w-full">
        <h1 className="text-4xl font-bold text-center mb-4">
          Convert PDF to PowerPoint
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Transform your PDF documents into editable PowerPoint presentations
          while preserving layout and images
        </p>
        <PdfToPowerPoint />
      </div>
    </main>
  );
}
