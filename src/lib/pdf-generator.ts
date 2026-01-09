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

export const generateTCGPdf = (
    grid: (string | null)[],
    options: PdfOptions = { enableSpacing: true, enableCropMarks: true }
): jsPDF => {
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

    grid.forEach((imageSrc, index) => {
        if (!imageSrc) return;

        const col = index % 3;
        const row = Math.floor(index / 3);

        const x = startX + (col * (CARD_WIDTH + cardGap));
        const y = startY + (row * (CARD_HEIGHT + cardGap));

        // Add the image
        try {
            doc.addImage(imageSrc, 'PNG', x, y, CARD_WIDTH, CARD_HEIGHT);
        } catch (e) {
            console.error("Error adding image to PDF", e);
        }

        // Add Crop Marks for this card if enabled
        if (options.enableCropMarks) {
            drawCropMarks(doc, x, y);
        }
    });

    return doc;
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
