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
        margin: 0,
        size: 'A4',
        bufferPages: true
    });

    doc.pipe(stream);

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 50;

    // Background
    if (isDark) {
        doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
    }

    // Top Accent
    if (!isDark) {
        doc.rect(0, 0, pageWidth, 6).fill(primaryColor);
    }

    // --- HEADER ---
    let y = 60;

    doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
        .font(boldFont)
        .fontSize(28)
        .text((resumeData.name || 'Your Name').toUpperCase(), margin, y, { align: 'center', width: pageWidth - 100 });

    y += 35;

    let contact = `${resumeData.email || ''}   |   ${resumeData.phone || ''}`;
    doc.fillColor(isDark ? '#9CA3AF' : '#666666').font(font).fontSize(10).text(contact, margin, y, { align: 'center', width: pageWidth - 100 });

    y += 15;

    if (resumeData.linkedin) {
        doc.fillColor(isDark ? '#3B82F6' : '#0a66c2').font(boldFont).fontSize(10).text('LinkedIn', margin, y, {
            align: 'center',
            width: pageWidth - 100,
            link: resumeData.linkedin,
            underline: true
        });
    }

    y += 30;

    doc.strokeColor(isDark ? '#1F2937' : '#EEEEEE').lineWidth(0.5).moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();

    y += 35;
    const columnStartY = y;

    // Columns
    const leftWidth = 310;
    const rightWidth = 170;
    const rightX = margin + leftWidth + 30;

    // --- SIDEBAR (RIGHT) ---
    let ry = columnStartY;

    // Education
    if (resumeData.education?.length > 0) {
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(12).text('EDUCATION', rightX, ry);
        ry += 25;
        resumeData.education.forEach(edu => {
            doc.fillColor(isDark ? '#FFFFFF' : '#333333').font(boldFont).fontSize(9).text(edu.degree || '', rightX, ry, { width: rightWidth });
            ry += doc.heightOfString(edu.degree || '', { fontSize: 9, width: rightWidth }) + 3;
            doc.fillColor(grayText = isDark ? '#9CA3AF' : '#666666').font(font).fontSize(8.5).text(edu.institution || '', rightX, ry, { width: rightWidth });
            ry += doc.heightOfString(edu.institution || '', { fontSize: 8.5, width: rightWidth }) + 3;
            doc.fillColor(isDark ? '#6B7280' : '#888888').font(font).fontSize(8).text(edu.year || '', rightX, ry);
            ry += 20;
        });
    }

    // Skills
    if (resumeData.skills?.length > 0) {
        ry += 15;
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(12).text('EXPERTISE', rightX, ry);
        ry += 25;
        resumeData.skills.forEach(skill => {
            doc.fillColor(isDark ? '#D1D5DB' : '#444444').font(font).fontSize(9).text(`• ${skill}`, rightX, ry);
            ry += 15;
        });
    }

    // --- MAIN (LEFT) ---
    let ly = columnStartY;

    // Summary
    if (resumeData.summary) {
        doc.fillColor(primaryColor).rect(margin, ly, 3, 15).fill();
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(12).text('PROFESSIONAL SUMMARY', margin + 12, ly + 1);
        ly += 25;
        doc.fillColor(isDark ? '#D1D5DB' : '#444444').font(font).fontSize(10).text(resumeData.summary, margin, ly, { width: leftWidth, align: 'justify', lineGap: 2 });
        ly += doc.heightOfString(resumeData.summary, { width: leftWidth, fontSize: 10, lineGap: 2 }) + 35;
    }

    // Experience
    if (resumeData.experience?.length > 0) {
        doc.fillColor(primaryColor).rect(margin, ly, 3, 15).fill();
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(12).text('EXPERIENCE', margin + 12, ly + 1);
        ly += 25;

        resumeData.experience.forEach(exp => {
            if (ly > pageHeight - 100) {
                doc.addPage();
                if (isDark) doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
                ly = 50;
            }

            // Role & Date
            doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(boldFont).fontSize(11).text(exp.role || '', margin, ly, { width: leftWidth - 100 });
            doc.fillColor(isDark ? '#9CA3AF' : '#888888').font(font).fontSize(9).text(exp.duration || '', margin, ly + 1, { align: 'right', width: leftWidth });

            ly += 16;
            doc.fillColor(secondaryColor).font(boldFont).fontSize(10).text(exp.company || '', margin, ly);
            ly += 15;
            doc.fillColor(isDark ? '#9CA3AF' : '#555555').font(font).fontSize(9.5).text(exp.description || '', margin, ly, { width: leftWidth, align: 'justify' });
            ly += doc.heightOfString(exp.description || '', { width: leftWidth, fontSize: 9.5 }) + 25;
        });
    }

    doc.end();
};

module.exports = { generatePDF };
