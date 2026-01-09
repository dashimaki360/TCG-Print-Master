'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
    onImageSelect: (imageUrl: string) => void;
    className?: string;
}

export function ImageUploader({ onImageSelect, className }: ImageUploaderProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.result) {
                    onImageSelect(reader.result as string);
                }
            };

            reader.readAsDataURL(file);
        }
    }, [onImageSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1,
        multiple: false
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative flex flex-col items-center justify-center w-full max-w-xl p-12 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer group",
                isDragActive
                    ? "border-blue-500 bg-blue-50/10 scale-[1.02]"
                    : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/5 dark:bg-zinc-900/50",
                className
            )}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center text-center gap-4">
                <div className={cn(
                    "p-4 rounded-full transition-colors duration-300",
                    isDragActive ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                )}>
                    {isDragActive ? (
                        <Upload className="w-8 h-8" />
                    ) : (
                        <ImageIcon className="w-8 h-8" />
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
                        {isDragActive ? "ドロップしてアップロード" : "画像をアップロード"}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        ドラッグ＆ドロップ または クリックして選択
                    </p>
                </div>

                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
                    PNG, JPG, WEBP (最大 10MB)
                </p>
            </div>
        </div>
    );
}
