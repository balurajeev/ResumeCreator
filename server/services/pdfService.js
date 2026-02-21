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
        doc.rect(0, 0, pageWidth, 8).fill(primaryColor);
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

    // LinkedIn Link
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

    // Horizontal Line
    doc.strokeColor(isDark ? '#1F2937' : '#EEEEEE')
        .lineWidth(0.5)
        .moveTo(margin, currentY)
        .lineTo(pageWidth - margin, currentY)
        .stroke();

    currentY += 40;
    const contentStartY = currentY;

    // --- TWO COLUMN LAYOUT PARAMETERS ---
    const leftColX = margin;
    const leftColWidth = (pageWidth - margin * 2) * 0.62;

    const rightColX = leftColX + leftColWidth + 35;
    const rightColWidth = (pageWidth - margin * 2) * 0.38 - 35;

    // --- RENDER SIDEBAR (On Page 1) ---
    const renderSidebar = (startY) => {
        let y = startY;

        // Education
        if (resumeData.education && resumeData.education.length > 0) {
            doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
                .font(boldFont)
                .fontSize(13)
                .text('EDUCATION', rightColX, y, { characterSpacing: 1 });

            y += 30;

            resumeData.education.forEach(edu => {
                doc.fillColor(isDark ? '#F9FAFB' : '#111827').font(boldFont).fontSize(10).text(edu.degree || '', rightColX, y, { width: rightColWidth });
                y += doc.heightOfString(edu.degree || '', { fontSize: 10, width: rightColWidth }) + 4;

                doc.fillColor(isDark ? '#9CA3AF' : '#666666').font(font).fontSize(9).text(edu.institution || '', rightColX, y, { width: rightColWidth });
                y += 12;

                doc.fillColor(isDark ? '#4B5563' : '#9CA3AF').font(boldFont).fontSize(8).text(edu.year || '', rightColX, y);
                y += 25;
            });
        }

        // Expertise
        if (resumeData.skills && resumeData.skills.length > 0) {
            y += 10;
            doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
                .font(boldFont)
                .fontSize(13)
                .text('EXPERTISE', rightColX, y, { characterSpacing: 1 });

            y += 30;

            resumeData.skills.forEach(skill => {
                doc.fillColor(isDark ? '#1F2937' : '#F9FAFB').rect(rightColX, y, rightColWidth, 16).fill();
                doc.fillColor(isDark ? '#D1D5DB' : '#4B5563').font(boldFont).fontSize(8).text((skill || '').toUpperCase(), rightColX + 5, y + 4, { width: rightColWidth - 10 });
                y += 20;
            });
        }
    };

    renderSidebar(contentStartY);

    // --- RENDER MAIN CONTENT ---
    let leftY = contentStartY;

    // Summary
    if (resumeData.summary) {
        doc.fillColor(primaryColor).rect(leftColX, leftY, 4, 18).fill();
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
            .font(boldFont)
            .fontSize(13)
            .text('PROFESSIONAL SUMMARY', leftColX + 15, leftY + 2, { characterSpacing: 1 });

        leftY += 30;
        doc.fillColor(isDark ? '#D1D5DB' : '#4B5563')
            .font(font)
            .fontSize(10)
            .text(resumeData.summary, leftColX, leftY, { width: leftColWidth, align: 'justify', lineGap: 3 });

        leftY += doc.heightOfString(resumeData.summary, { width: leftColWidth, fontSize: 10, lineGap: 3 }) + 40;
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
        doc.fillColor(primaryColor).rect(leftColX, leftY, 4, 18).fill();
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
            .font(boldFont)
            .fontSize(13)
            .text('EXPERIENCE', leftColX + 15, leftY + 2, { characterSpacing: 1 });

        leftY += 35;

        resumeData.experience.forEach((exp) => {
            if (leftY > pageHeight - 80) {
                doc.addPage();
                if (isDark) doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
                leftY = 50;
                // Note: We don't re-render sidebar on page 2 to match standard resume layouts 
                // but we could if needed.
            }

            // Role
            doc.fillColor(isDark ? '#F9FAFB' : '#111827')
                .font(boldFont)
                .fontSize(11)
                .text(exp.role || '', leftColX, leftY, { width: leftColWidth * 0.65 });

            // Duration
            doc.fillColor(isDark ? '#6B7280' : '#888888')
                .font(font)
                .fontSize(9)
                .text(exp.duration || '', leftColX, leftY + 2, { align: 'right', width: leftColWidth });

            leftY += Math.max(16, doc.heightOfString(exp.role || '', { fontSize: 11, width: leftColWidth * 0.65 })) + 2;

            // Company
            doc.fillColor(secondaryColor).font(boldFont).fontSize(10).text(exp.company || '', leftColX, leftY);
            leftY += 15;

            // Description
            doc.fillColor(isDark ? '#9CA3AF' : '#444444').font(font).fontSize(10).text(exp.description || '', leftColX, leftY, {
                width: leftColWidth,
                lineGap: 2,
                align: 'justify'
            });
            leftY += doc.heightOfString(exp.description || '', { width: leftColWidth, fontSize: 10, lineGap: 2 }) + 25;
        });
    }

    doc.end();
};

module.exports = { generatePDF };
