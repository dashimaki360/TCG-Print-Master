import { jsPDF } from "jspdf";

const CARD_WIDTH = 63; // mm
const CARD_HEIGHT = 88; // mm
const A4_WIDTH = 210; // mm
const A4_HEIGHT = 297; // mm

export const generateTCGPdf = (imageSrc: string): jsPDF => {
    // Orientation 'p' (portrait), unit 'mm', format 'a4'
    const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
    });

    // Calculate center position
    const x = (A4_WIDTH - CARD_WIDTH) / 2;
    const y = (A4_HEIGHT - CARD_HEIGHT) / 2;

    // Add the image
    // 'PNG' or 'JPEG' depending on the source. dataURL usually has the type.
    // We'll trust jsPDF to detect format from dataURL if possible, or force PNG if ours is PNG.
    // buffer from crop-image is PNG.
    doc.addImage(imageSrc, 'PNG', x, y, CARD_WIDTH, CARD_HEIGHT);

    // Add Crop Marks (Tonbo)
    // Simple corner marks
    const markLength = 3; // 3mm lines
    const lineWidth = 0.1; // Thin lines

    doc.setLineWidth(lineWidth);
    doc.setDrawColor(0, 0, 0); // Black

    // Top Left
    // Horizontal line
    doc.line(x - markLength, y, x, y);
    // Vertical line
    doc.line(x, y - markLength, x, y);

    // Top Right
    doc.line(x + CARD_WIDTH, y, x + CARD_WIDTH + markLength, y);
    doc.line(x + CARD_WIDTH, y - markLength, x + CARD_WIDTH, y);

    // Bottom Left
    doc.line(x - markLength, y + CARD_HEIGHT, x, y + CARD_HEIGHT);
    doc.line(x, y + CARD_HEIGHT, x, y + CARD_HEIGHT + markLength);

    // Bottom Right
    doc.line(x + CARD_WIDTH, y + CARD_HEIGHT, x + CARD_WIDTH + markLength, y + CARD_HEIGHT);
    doc.line(x + CARD_WIDTH, y + CARD_HEIGHT, x + CARD_WIDTH, y + CARD_HEIGHT + markLength);

    // Optional: Add a very light gray rect to show the A4 bounds if checking on screen? No, keep it clean for print.

    return doc;
};

export const downloadPdf = (doc: jsPDF, filename = "tcg-card.pdf") => {
    doc.save(filename);
};
