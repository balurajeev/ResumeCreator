const { PDFParse } = require('pdf-parse');
const fs = require('fs');

const extractTextFromPDF = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.error('Parser Error: File not found at path:', filePath);
            throw new Error('File not found for extraction');
        }

        const dataBuffer = fs.readFileSync(filePath);

        // pdf-parse v2.x requires a Uint8Array (not a raw Buffer)
        const uint8Array = new Uint8Array(dataBuffer);
        const instance = new PDFParse(uint8Array);
        const result = await instance.getText();
        return result.text;
    } catch (error) {
        console.error('Internal Error parsing PDF:', error.message);
        throw error;
    }
};

module.exports = { extractTextFromPDF };
