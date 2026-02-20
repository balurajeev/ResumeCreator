const pdf = require('pdf-parse');
const fs = require('fs');

const extractTextFromPDF = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.error('Parser Error: File not found at path:', filePath);
            throw new Error('File not found for extraction');
        }

        const dataBuffer = fs.readFileSync(filePath);

        // Convert Buffer to Uint8Array as required by newer pdf-parse
        const uint8Array = new Uint8Array(dataBuffer);

        // Instantiate PDFParse class
        const instance = new pdf.PDFParse(uint8Array);

        // Extract text using getText() method
        const result = await instance.getText();
        return result.text;
    } catch (error) {
        console.error('Internal Error parsing PDF:', error.message);
        throw error;
    }
};

module.exports = { extractTextFromPDF };
