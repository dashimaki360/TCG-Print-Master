'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { ZoomIn, ZoomOut, RotateCw, Check, X } from 'lucide-react';
import getCroppedImg from '@/lib/crop-image';
import { cn } from '@/lib/utils';

// I will implement simple Button and Slider inline or just use standard HTML elements styled with Tailwind for now to avoid dependency hell if I didn't install shadcn.
// The user prompt didn't ask for shadcn, just Tailwind. I will build custom styled inputs.

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedImage: string) => void;
    onCancel: () => void;
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation
            );
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="relative w-full h-[500px] bg-zinc-900">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={63 / 88}
                    onCropChange={onCropChange}
                    onCropComplete={onCropCompleteHandler}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    showGrid={true}
                    classes={{
                        containerClassName: "rounded-t-2xl",
                    }}
                />
            </div>

            <div className="p-6 space-y-6 bg-white dark:bg-zinc-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Zoom Control */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <span className="flex items-center gap-2"><ZoomIn className="w-4 h-4" /> ズーム</span>
                            <span>{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700 accent-blue-600"
                        />
                    </div>

                    {/* Rotation Control */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            <span className="flex items-center gap-2"><RotateCw className="w-4 h-4" /> 回転</span>
                            <span>{rotation}°</span>
                        </div>
                        <input
                            type="range"
                            value={rotation}
                            min={0}
                            max={360}
                            step={1}
                            aria-labelledby="Rotation"
                            onChange={(e) => setRotation(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700 accent-purple-600"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                        onClick={onCancel}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                        キャンセル
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isProcessing}
                        className={cn(
                            "flex items-center gap-2 px-8 py-2.5 text-sm font-medium text-white rounded-full shadow-lg transition-all",
                            isProcessing
                                ? "bg-zinc-400 cursor-wait"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/25 hover:scale-105"
                        )}
                    >
                        {isProcessing ? (
                            <span>処理中...</span>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                決定する
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
