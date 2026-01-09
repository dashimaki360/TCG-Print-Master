'use client';

import React, { useState } from 'react';
import { ImageUploader } from '@/components/image-uploader';
import { generateTCGPdf, downloadPdf } from '@/lib/pdf-generator';
import { Download, RotateCcw, Sparkles } from 'lucide-react';

export default function Home() {
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleImageSelect = (src: string) => {
    setImageSrc(src);
    setStep('preview');
  };

  const handleDownload = () => {
    if (imageSrc) {
      const doc = generateTCGPdf(imageSrc);
      downloadPdf(doc, 'my-tcg-card.pdf');
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 flex flex-col items-center">
      {/* Header */}
      <header className="flex flex-col items-center gap-4 text-center max-w-2xl mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center justify-center p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-full mb-2">
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          TCG Print Master
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          あなたのAIアートを、実物カードサイズ (63×88mm) で完璧に印刷。
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl flex flex-col items-center">
        {step === 'upload' && (
          <div className="w-full flex justify-center animate-in zoom-in-95 duration-500">
            <ImageUploader onImageSelect={handleImageSelect} />
          </div>
        )}

        {step === 'preview' && imageSrc && (
          <div className="w-full flex flex-col items-center gap-8 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">準備完了！</h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                プレビューを確認してPDFをダウンロードしてください。
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-center justify-center w-full">
              {/* Card Preview */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white dark:bg-zinc-800 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl">
                  {/* Display at roughly real physical size on screen or just visually pleasing size */}
                  <img
                    src={imageSrc}
                    alt="Card Preview"
                    className="w-[240px] h-auto rounded-lg shadow-inner object-cover"
                    style={{ aspectRatio: '63/88' }}
                  />
                </div>
                <p className="mt-4 text-center text-sm font-medium text-zinc-500">
                  印刷サイズ: 63mm × 88mm (自動リサイズ)
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 w-full max-w-xs">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Download className="w-6 h-6" />
                  PDFをダウンロード
                </button>

                <p className="text-xs text-center text-zinc-400 dark:text-zinc-500 px-4">
                  A4用紙に印刷する際は「実際のサイズ(100%)」を選択してください。
                </p>

                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

                <button
                  onClick={() => {
                    setStep('upload');
                    setImageSrc(null);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  最初からやり直す
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-center text-sm text-zinc-400 dark:text-zinc-600">
        <p>© 2024 TCG Print Master. Local Client-Side Processing Only.</p>
      </footer>
    </div>
  );
}
