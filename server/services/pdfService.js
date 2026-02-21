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

    // Full page background for Dark Mode
    if (isDark) {
        doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
    }

    // Top border accent
    if (!isDark) {
        doc.rect(0, 0, pageWidth, 6).fill(primaryColor);
    }

    // --- HEADER ---
    let currentY = 55;

    // Name
    doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
        .font(boldFont)
        .fontSize(32)
        .text((resumeData.name || 'Your Name').toUpperCase(), margin, currentY, {
            align: 'center',
            width: pageWidth - (margin * 2),
            characterSpacing: 0.5
        });

    currentY += 40;

    // Contact Info
    let contactInfo = `${resumeData.email || ''}   |   ${resumeData.phone || ''}`;
    doc.fillColor(isDark ? '#9CA3AF' : '#666666')
        .font(font)
        .fontSize(10.5)
        .text(contactInfo, margin, currentY, { align: 'center', width: pageWidth - (margin * 2) });

    currentY += 16;

    // LinkedIn
    if (resumeData.linkedin) {
        doc.fillColor(isDark ? '#3B82F6' : '#0a66c2')
            .font(boldFont)
            .fontSize(10)
            .text('Click here', margin, currentY, {
                align: 'center',
                width: pageWidth - (margin * 2),
                link: resumeData.linkedin,
                underline: true
            });
    }

    currentY += 30;

    doc.strokeColor(isDark ? '#1F2937' : '#EEEEEE')
        .lineWidth(0.5)
        .moveTo(margin, currentY)
        .lineTo(pageWidth - margin, currentY)
        .stroke();

    currentY += 40;
    const contentStartY = currentY;

    // --- TWO COLUMN PARAMETERS ---
    const leftColX = margin;
    const leftColWidth = (pageWidth - margin * 2) * 0.65;

    const rightColX = leftColX + leftColWidth + 30;
    const rightColWidth = (pageWidth - margin * 2) * 0.35 - 30;

    // Helper for Section Headers
    const renderHeader = (text, x, y, hasBar = false) => {
        if (hasBar) {
            doc.fillColor(primaryColor).rect(x, y, 4, 18).fill();
            doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
                .font(boldFont)
                .fontSize(13)
                .text(text.toUpperCase(), x + 15, y + 2, { characterSpacing: 1 });
        } else {
            doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
                .font(boldFont)
                .fontSize(13)
                .text(text.toUpperCase(), x, y, { characterSpacing: 1 });
        }
        return y + 30;
    };

    // --- RENDER SIDEBAR (Right Column) ---
    let rightY = contentStartY;

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
        rightY = renderHeader('EDUCATION', rightColX, rightY, false);
        resumeData.education.forEach(edu => {
            doc.fillColor(isDark ? '#F9FAFB' : '#111827').font(boldFont).fontSize(10).text(edu.degree || '', rightColX, rightY, { width: rightColWidth });
            rightY += doc.heightOfString(edu.degree || '', { fontSize: 10, width: rightColWidth }) + 4;

            doc.fillColor(isDark ? '#9CA3AF' : '#666666').font(font).fontSize(9).text(edu.institution || '', rightColX, rightY, { width: rightColWidth });
            rightY += doc.heightOfString(edu.institution || '', { fontSize: 9, width: rightColWidth }) + 4;

            doc.fillColor(isDark ? '#4B5563' : '#9CA3AF').font(boldFont).fontSize(8).text(edu.year || '', rightColX, rightY);
            rightY += 25;
        });
    }

    // Expertise
    if (resumeData.skills && resumeData.skills.length > 0) {
        rightY += 10;
        rightY = renderHeader('EXPERTISE', rightColX, rightY, false);
        resumeData.skills.forEach(skill => {
            doc.fillColor(isDark ? '#1F2937' : '#F9FAFB').rect(rightColX, rightY, rightColWidth, 16).fill();
            doc.fillColor(isDark ? '#D1D5DB' : '#4B5563').font(boldFont).fontSize(8).text((skill || '').toUpperCase(), rightColX + 5, rightY + 4, { width: rightColWidth - 10 });
            rightY += 20;
        });
    }

    // --- RENDER MAIN CONTENT (Left Column) ---
    let leftY = contentStartY;

    // Summary
    if (resumeData.summary) {
        leftY = renderHeader('PROFESSIONAL SUMMARY', leftColX, leftY, true);
        doc.fillColor(isDark ? '#D1D5DB' : '#4B5563')
            .font(font)
            .fontSize(10)
            .text(resumeData.summary, leftColX, leftY, { width: leftColWidth, align: 'justify', lineGap: 3 });
        leftY += doc.heightOfString(resumeData.summary, { width: leftColWidth, fontSize: 10, lineGap: 3 }) + 40;
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
        leftY = renderHeader('EXPERIENCE', leftColX, leftY, true);
        resumeData.experience.forEach((exp) => {
            if (leftY > pageHeight - 100) {
                doc.addPage();
                if (isDark) doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
                leftY = 50;
            }

            // Role & Duration
            const role = exp.role || 'Role';
            const duration = exp.duration || '';

            doc.fillColor(isDark ? '#F9FAFB' : '#111827').font(boldFont).fontSize(11).text(role, leftColX, leftY, { width: leftColWidth * 0.7 });
            doc.fillColor(isDark ? '#6B7280' : '#888888').font(font).fontSize(9).text(duration, leftColX, leftY + 2, { align: 'right', width: leftColWidth });

            leftY += Math.max(16, doc.heightOfString(role, { fontSize: 11, width: leftColWidth * 0.7 })) + 2;

            // Company
            doc.fillColor(secondaryColor).font(boldFont).fontSize(10).text(exp.company || '', leftColX, leftY);
            leftY += 15;

            // Description
            const desc = exp.description || '';
            doc.fillColor(isDark ? '#9CA3AF' : '#444444').font(font).fontSize(10).text(desc, leftColX, leftY, { width: leftColWidth, lineGap: 2, align: 'justify' });
            leftY += doc.heightOfString(desc, { width: leftColWidth, fontSize: 10, lineGap: 2 }) + 25;
        });
    }

    doc.end();
};

module.exports = { generatePDF };
