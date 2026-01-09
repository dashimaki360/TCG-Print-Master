import { jsPDF } from "jspdf";

const CARD_WIDTH = 63; // mm
const CARD_HEIGHT = 88; // mm
const DEFAULT_CARD_GAP = 5; // mm
const A4_WIDTH = 210; // mm
const A4_HEIGHT = 297; // mm
const MARK_LENGTH = 3; // mm
const LINE_WIDTH = 0.1; // mm

interface PdfOptions {
    enableSpacing: boolean;
    enableCropMarks: boolean;
}

export const generateTCGPdf = async (
    grid: (string | null)[],
    options: PdfOptions = { enableSpacing: true, enableCropMarks: true }
): Promise<jsPDF> => {
    // Orientation 'p' (portrait), unit 'mm', format 'a4'
    const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
    });

    doc.setLineWidth(LINE_WIDTH);
    doc.setDrawColor(0, 0, 0); // Black

    const cardGap = options.enableSpacing ? DEFAULT_CARD_GAP : 0;

    // Calculate grid start position to center the block of 3x3
    // Total Grid Width = (3 * 63) + (2 * gap)
    // Total Grid Height = (3 * 88) + (2 * gap)
    const totalGridWidth = (CARD_WIDTH * 3) + (cardGap * 2);
    const totalGridHeight = (CARD_HEIGHT * 3) + (cardGap * 2);

    const startX = (A4_WIDTH - totalGridWidth) / 2;
    const startY = (A4_HEIGHT - totalGridHeight) / 2;

    // Process images sequentially to avoid memory spikes
    for (let index = 0; index < grid.length; index++) {
        const imageSrc = grid[index];
        if (!imageSrc) continue;

        const col = index % 3;
        const row = Math.floor(index / 3);

        const x = startX + (col * (CARD_WIDTH + cardGap));
        const y = startY + (row * (CARD_HEIGHT + cardGap));

        // Add the image
        try {
            const processedImage = await processImageForPdf(imageSrc);
            doc.addImage(processedImage, 'JPEG', x, y, CARD_WIDTH, CARD_HEIGHT);
        } catch (e) {
            console.error("Error adding image to PDF", e);
        }

        // Add Crop Marks for this card if enabled
        if (options.enableCropMarks) {
            drawCropMarks(doc, x, y);
        }
    }

    return doc;
};

// Helper: Resize and compress image
const processImageForPdf = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            // Target 600 DPI for 63mm x 88mm
            // 1 inch = 25.4mm
            // Width: (63 / 25.4) * 600 ≈ 1488
            // Height: (88 / 25.4) * 600 ≈ 2079
            const targetWidth = 1488;
            const targetHeight = 2079;

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            // High quality resizing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Fill white background to handle transparency
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, targetWidth, targetHeight);

            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            // Convert to JPEG with 0.85 quality
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = src;
    });
};

const drawCropMarks = (doc: jsPDF, x: number, y: number) => {
    // Top Left
    doc.line(x - MARK_LENGTH, y, x, y); // Horizontal
    doc.line(x, y - MARK_LENGTH, x, y); // Vertical

    // Top Right
    doc.line(x + CARD_WIDTH, y, x + CARD_WIDTH + MARK_LENGTH, y);
    doc.line(x + CARD_WIDTH, y - MARK_LENGTH, x + CARD_WIDTH, y);

    // Bottom Left
    doc.line(x - MARK_LENGTH, y + CARD_HEIGHT, x, y + CARD_HEIGHT);
    doc.line(x, y + CARD_HEIGHT, x, y + CARD_HEIGHT + MARK_LENGTH);

    // Bottom Right
    doc.line(x + CARD_WIDTH, y + CARD_HEIGHT, x + CARD_WIDTH + MARK_LENGTH, y + CARD_HEIGHT);
    doc.line(x + CARD_WIDTH, y + CARD_HEIGHT, x + CARD_WIDTH, y + CARD_HEIGHT + MARK_LENGTH);
};

export const downloadPdf = (doc: jsPDF, filename = "tcg-cards.pdf") => {
    doc.save(filename);
};
