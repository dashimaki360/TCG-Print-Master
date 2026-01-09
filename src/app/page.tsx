'use client';

import React, { useState } from 'react';
import { ImageUploader } from '@/components/image-uploader';
import { generateTCGPdf, downloadPdf } from '@/lib/pdf-generator';
import { Download, RotateCcw, Sparkles, Plus, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [library, setLibrary] = useState<string[]>([]);
  const [grid, setGrid] = useState<(string | null)[]>(Array(9).fill(null));
  const [selectedLibraryIndex, setSelectedLibraryIndex] = useState<number | null>(null);

  // Layout Options
  const [enableSpacing, setEnableSpacing] = useState(true);
  const [enableCropMarks, setEnableCropMarks] = useState(true);

  // If library is empty, we show the initial upload screen. 
  // Otherwise we show the layout editor.
  // UPDATE: User requested to always show layout editor.
  // const isLayoutMode = library.length > 0;

  const handleImageSelect = (src: string) => {
    setLibrary([...library, src]);
    // If it's the first image, automatically select it for convenience
    if (library.length === 0) {
      setSelectedLibraryIndex(0);
    }
  };

  const handleGridClick = (index: number) => {
    if (selectedLibraryIndex !== null) {
      // Place selected image
      const newGrid = [...grid];
      newGrid[index] = library[selectedLibraryIndex];
      setGrid(newGrid);
    }
  };

  const handleClearSlot = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const newGrid = [...grid];
    newGrid[index] = null;
    setGrid(newGrid);
  };

  const handleDownload = () => {
    // We need to update pdf-generator to accept the grid
    // For now we pass the grid to the generator (which we will update next)
    // @ts-ignore - Temporary ignore until we update the function signature
    const doc = generateTCGPdf(grid, { enableSpacing, enableCropMarks });
    downloadPdf(doc, 'tcg-layout.pdf');
  };

  const clearAll = () => {
    if (confirm('すべての配置とライブラリをリセットしますか？')) {
      setLibrary([]);
      setGrid(Array(9).fill(null));
      setSelectedLibraryIndex(null);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center select-none">
      {/* Header */}
      <header className="flex flex-col items-center gap-4 text-center max-w-2xl mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-full">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
            TCG Print Master
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl flex flex-col items-center gap-8">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">

          {/* Left Column: Library */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm h-full max-h-[calc(100vh-200px)] overflow-y-auto">
              <h3 className="font-bold text-zinc-700 dark:text-zinc-200 mb-4 flex items-center justify-between">
                ライブラリ
                <span className="text-xs font-normal text-zinc-500">{library.length}枚</span>
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {library.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedLibraryIndex(i)}
                    className={cn(
                      "relative aspect-[63/88] rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-[1.02]",
                      selectedLibraryIndex === i
                        ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg"
                        : "border-transparent hover:border-zinc-300"
                    )}
                  >
                    <img src={img} alt={`Library ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}

                {/* Add New Button (Small uploader) */}
                <div className="aspect-[63/88]">
                  <ImageUploader
                    onImageSelect={handleImageSelect}
                    className="w-full h-full p-2 border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-lg min-h-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center: A4 Grid Preview */}
          <div className="lg:col-span-6 flex flex-col items-center gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-900 p-8 rounded-xl shadow-inner overflow-auto max-w-full">
              {/* A4 Container (Scaled down CSS representation) */}
              {/* A4 is 210mm x 297mm. 3x3 grid. Card 63x88mm. */}
              {/* We use a relative container with fixed aspect ratio A4 */}
              <div
                className={cn(
                  "bg-white shadow-2xl relative mx-auto grid grid-cols-3 grid-rows-3 content-center justify-center transition-all",
                  enableSpacing ? "gap-2" : "gap-0"
                )}
                style={{
                  width: '300px', // Display size
                  height: '424px', // 300 * 1.414 (A4 ratio)
                  padding: '20px 10px' // Approximate margins
                }}
              >
                {grid.map((slotImg, i) => (
                  <div
                    key={i}
                    onClick={() => handleGridClick(i)}
                    className={cn(
                      "relative border border-dashed rounded transition-colors flex items-center justify-center group",
                      slotImg ? "border-transparent" : "border-zinc-200 hover:border-blue-300 bg-zinc-50 hover:bg-blue-50/10"
                    )}
                    style={{
                      width: '90px', // 63mm approx scaled
                      height: '125px', // 88mm approx scaled
                    }}
                  >
                    {slotImg ? (
                      <>
                        <img src={slotImg} alt={`Slot ${i}`} className="w-full h-full object-cover rounded-sm" />
                        <button
                          onClick={(e) => handleClearSlot(e, i)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <Plus className="w-4 h-4 text-zinc-300 pointer-events-none" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-zinc-400">
              ライブラリから画像を選択し、配置したい場所をクリックしてください。
            </p>
          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-zinc-800 dark:text-zinc-100 mb-2">アクション</h3>
                <p className="text-sm text-zinc-500">
                  設定を確認してPDFを出力します。
                </p>
              </div>

              <button
                onClick={handleDownload}
                disabled={grid.every(s => s === null)}
                className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Download className="w-5 h-5" />
                PDF作成
              </button>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={enableSpacing}
                    onChange={(e) => setEnableSpacing(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">隙間あり (5mm)</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={enableCropMarks}
                    onChange={(e) => setEnableCropMarks(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">トンボ (切り取り線)</span>
                </label>
              </div>

              <div className="h-px bg-zinc-100 dark:bg-zinc-700" />

              <button
                onClick={clearAll}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 text-zinc-600 dark:text-zinc-300 rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                リセット
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
              <h4 className="font-bold text-blue-700 dark:text-blue-300 text-sm mb-1">ヒント</h4>
              <ul className="text-xs text-blue-600/80 dark:text-blue-400/80 space-y-1 ml-4 list-disc">
                <li>同じ画像を複数の場所に配置できます。</li>
                <li>配置済みの画像をクリックすると上書きされます。</li>
                <li>A4用紙（100%）で印刷してください。</li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-auto pt-12 pb-4 text-center text-xs text-zinc-400 dark:text-zinc-600">
        <p>© 2026 TCG Print Master. Local Client-Side Processing Only.</p>
      </footer>
    </div>
  );
}
