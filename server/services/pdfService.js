const PDFDocument = require('pdfkit');
const { getHex } = require('./themeHelper');

const generatePDF = (resumeData, stream) => {
    const theme = resumeData.theme || {};
    const primaryColor = getHex(theme.colors?.primary);
    const secondaryColor = getHex(theme.colors?.secondary);
    const isDark = theme.darkMode;
    const font = theme.font === 'serif' ? 'Times-Roman' : 'Helvetica';
    const boldFont = theme.font === 'serif' ? 'Times-Bold' : 'Helvetica-Bold';

    const doc = new PDFDocument({
        margin: 50,
        size: 'A4'
    });

    doc.pipe(stream);

    // Background for dark mode (optional, but might be too ink-heavy for print)
    // For now, let's just stick to themed text and accents for better printability

    // Header
    doc.fillColor(secondaryColor).font(boldFont).fontSize(28).text(resumeData.name || 'Resume', { align: 'center' });
    doc.fillColor('#666666').font(font).fontSize(10).text(`${resumeData.email || ''} | ${resumeData.phone || ''} | ${resumeData.linkedin || ''}`, { align: 'center' });
    doc.moveDown(2);

    // Accent line
    doc.strokeColor(primaryColor).lineWidth(2).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    // Summary
    if (resumeData.summary) {
        doc.fillColor(secondaryColor).font(boldFont).fontSize(14).text('PROFESSIONAL SUMMARY', { characterSpacing: 1 });
        doc.moveDown(0.5);
        doc.fillColor('#333333').font(font).fontSize(11).text(resumeData.summary, { align: 'justify', lineGap: 2 });
        doc.moveDown();
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
        doc.fillColor(secondaryColor).font(boldFont).fontSize(14).text('EXPERIENCE', { characterSpacing: 1 });
        doc.moveDown(1);

        resumeData.experience.forEach(exp => {
            doc.fillColor('#000000').font(boldFont).fontSize(12).text(exp.role);
            doc.fillColor(secondaryColor).font(boldFont).fontSize(11).text(exp.company);
            doc.fillColor('#999999').font(font).fontSize(9).text(exp.duration, { align: 'right' });
            doc.moveUp();
            doc.moveDown(0.5);
            doc.fillColor('#444444').font(font).fontSize(10).text(exp.description, { lineGap: 1 });
            doc.moveDown();
        });
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
        doc.fillColor(secondaryColor).font(boldFont).fontSize(14).text('EDUCATION', { characterSpacing: 1 });
        doc.moveDown(0.5);

        resumeData.education.forEach(edu => {
            doc.fillColor('#000000').font(boldFont).fontSize(11).text(edu.degree);
            doc.fillColor('#444444').font(font).fontSize(10).text(`${edu.institution} (${edu.year})`);
            doc.moveDown(0.5);
        });
        doc.moveDown();
    }

    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
        doc.fillColor(secondaryColor).font(boldFont).fontSize(14).text('SKILLS', { characterSpacing: 1 });
        doc.moveDown(0.5);
        doc.fillColor('#444444').font(font).fontSize(10).text(resumeData.skills.join('  •  '));
    }

    doc.end();
};

module.exports = { generatePDF };
