const PDFDocument = require('pdfkit');
const { getHex } = require('./themeHelper');

const generatePDF = (resumeData, stream) => {
    const theme = resumeData.theme || {};
    const primaryColor = getHex(theme.colors?.primary);
    const secondaryColor = getHex(theme.colors?.secondary);
    const isDark = theme.darkMode;
    const font = theme.font === 'serif' ? 'Times-Roman' : 'Helvetica';
    const boldFont = theme.font === 'serif' ? 'Times-Bold' : 'Helvetica-Bold';
    const grayColor = isDark ? '#9CA3AF' : '#666666';

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
    doc.fillColor(grayColor).font(font).fontSize(10).text(contact, margin, y, { align: 'center', width: pageWidth - 100 });

    y += 15;

    if (resumeData.linkedin) {
        doc.fillColor(isDark ? '#3B82F6' : '#0a66c2').font(boldFont).fontSize(10).text('LINKEDIN PROFILE', margin, y, {
            align: 'center',
            width: pageWidth - 100,
            link: resumeData.linkedin,
            underline: true
        });
    }

    y += 30;

    doc.strokeColor(isDark ? '#1F2937' : '#EEEEEE').lineWidth(0.5).moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();

    y += 40;
    const contentStartY = y;

    // Column Settings
    const leftWidth = 310;
    const rightWidth = 160;
    const rightX = margin + leftWidth + 30;

    // --- SIDEBAR (RIGHT) ---
    let ry = contentStartY;

    if (resumeData.education?.length > 0) {
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('EDUCATION', rightX, ry);
        ry += 25;
        resumeData.education.forEach(edu => {
            doc.fillColor(isDark ? '#F9FAFB' : '#111827').font(boldFont).fontSize(10).text(edu.degree || '', rightX, ry, { width: rightWidth });
            ry += doc.heightOfString(edu.degree || '', { fontSize: 10, width: rightWidth }) + 4;
            doc.fillColor(grayColor).font(font).fontSize(9).text(edu.institution || '', rightX, ry, { width: rightWidth });
            ry += doc.heightOfString(edu.institution || '', { fontSize: 9, width: rightWidth }) + 4;
            doc.fillColor(isDark ? '#6B7280' : '#888888').font(font).fontSize(8).text(edu.year || '', rightX, ry);
            ry += 20;
        });
    }

    if (resumeData.skills?.length > 0) {
        ry += 15;
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('EXPERTISE', rightX, ry);
        ry += 25;
        resumeData.skills.forEach(skill => {
            doc.fillColor(isDark ? '#D1D5DB' : '#444444').font(font).fontSize(9).text(`• ${String(skill).toUpperCase()}`, rightX, ry);
            ry += 15;
        });
    }

    // --- MAIN (LEFT) ---
    let ly = contentStartY;

    if (resumeData.summary) {
        doc.fillColor(primaryColor).rect(margin, ly, 4, 18).fill();
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('PROFESSIONAL SUMMARY', margin + 15, ly + 2);
        ly += 30;
        doc.fillColor(isDark ? '#D1D5DB' : '#444444').font(font).fontSize(10.5).text(resumeData.summary, margin, ly, { width: leftWidth, align: 'justify' });
        ly += doc.heightOfString(resumeData.summary, { width: leftWidth, fontSize: 10.5 }) + 35;
    }

    if (resumeData.experience?.length > 0) {
        doc.fillColor(primaryColor).rect(margin, ly, 4, 18).fill();
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('EXPERIENCE', margin + 15, ly + 2);
        ly += 35;

        resumeData.experience.forEach(exp => {
            if (ly > pageHeight - 100) {
                doc.addPage();
                if (isDark) doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
                ly = 50;
            }

            doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(boldFont).fontSize(11).text(exp.role || '', margin, ly, { width: leftWidth - 100 });
            doc.fillColor(grayColor).font(font).fontSize(9).text(exp.duration || '', margin, ly + 2, { align: 'right', width: leftWidth });

            ly += 16;
            doc.fillColor(secondaryColor).font(boldFont).fontSize(10.5).text(exp.company || '', margin, ly);
            ly += 18;
            doc.fillColor(isDark ? '#9CA3AF' : '#555555').font(font).fontSize(10).text(exp.description || '', margin, ly, { width: leftWidth, align: 'justify' });
            ly += doc.heightOfString(exp.description || '', { width: leftWidth, fontSize: 10 }) + 28;
        });
    }

    doc.end();
};

module.exports = { generatePDF };
