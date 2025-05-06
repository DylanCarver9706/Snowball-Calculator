import { PdfMerge } from "@/components/pdfMerge";

export default function MergePDF() {
  return (
    <>
      <main className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Merge PDF files
            </h1>
            <p className="text-xl text-gray-600">
              Combine multiple PDF files into a single document in any order.
            </p>
          </div>

          <PdfMerge />
        </div>
      </main>
    </>
  );
}
