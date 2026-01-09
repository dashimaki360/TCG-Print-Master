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
                    : "border-zinc-300 hover:border-zinc-400 bg-zinc-50/5",
                className
            )}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center text-center gap-4">
                <div className={cn(
                    "p-4 rounded-full transition-colors duration-300",
                    isDragActive ? "bg-blue-100 text-blue-600" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"
                )}>
                    {isDragActive ? (
                        <Upload className="w-8 h-8" />
                    ) : (
                        <ImageIcon className="w-8 h-8" />
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-lg font-medium text-zinc-700">
                        {isDragActive ? "ドロップしてアップロード" : "画像をアップロード"}
                    </p>
                    <p className="text-sm text-zinc-500">
                        ドラッグ＆ドロップ または クリックして選択
                    </p>
                </div>

                <p className="text-xs text-zinc-400 mt-2">
                    PNG, JPG, WEBP (最大 10MB)
                </p>
            </div>
        </div>
    );
}
