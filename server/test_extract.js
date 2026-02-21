const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
    try {
        const filePath = 'C:\\Users\\Balu\\Downloads\\Test\\Balagopal_Architect.pdf';
        const dataBuffer = fs.readFileSync(filePath);
        const uint8Array = new Uint8Array(dataBuffer);
        const instance = new pdf.PDFParse(uint8Array);
        const result = await instance.getText();

        console.log('--- EXTRACTED TEXT ---');
        console.log(result.text);
        console.log('--- END ---');
    } catch (error) {
        console.error('Error:', error);
    }
}

extract();
