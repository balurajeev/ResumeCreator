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
        size: 'A4'
    });

    doc.pipe(stream);

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 40;

    // Full page background for Dark Mode
    if (isDark) {
        doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
    }

    // Top border style (accent)
    if (!isDark) {
        doc.rect(0, 0, pageWidth, 8).fill(primaryColor);
    }

    // --- HEADER ---
    let currentY = 50;

    // Name (Matching UI's bold large look)
    doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
        .font(boldFont)
        .fontSize(36)
        .text((resumeData.name || 'Your Name').toUpperCase(), margin, currentY, {
            align: 'center',
            width: pageWidth - (margin * 2),
            characterSpacing: 1
        });

    currentY += 45;

    // Contact Info (Phone/Email)
    let contactInfo = `${resumeData.email || ''}   |   ${resumeData.phone || ''}`;
    doc.fillColor(isDark ? '#9CA3AF' : '#666666')
        .font(font)
        .fontSize(11)
        .text(contactInfo, margin, currentY, { align: 'center', width: pageWidth - (margin * 2) });

    currentY += 18;

    // LinkedIn Link (Blue like UI)
    if (resumeData.linkedin) {
        doc.fillColor(isDark ? '#3B82F6' : '#0a66c2')
            .font(boldFont)
            .fontSize(11)
            .text('Click here', margin, currentY, {
                align: 'center',
                width: pageWidth - (margin * 2),
                link: resumeData.linkedin,
                underline: true
            });
    }

    currentY += 35;

    // Horizontal Line
    doc.strokeColor(isDark ? '#1F2937' : '#E5E7EB')
        .lineWidth(0.5)
        .moveTo(margin, currentY)
        .lineTo(pageWidth - margin, currentY)
        .stroke();

    currentY += 40;

    // --- TWO COLUMN LAYOUT PARAMETERS ---
    const leftColWidth = (pageWidth - margin * 2) * 0.62;
    const rightColWidth = (pageWidth - margin * 2) * 0.38 - 30;
    const leftColX = margin;
    const rightColX = leftColX + leftColWidth + 30;

    // LEFT COLUMN (Main Content)
    let leftY = currentY;

    // Summary
    if (resumeData.summary) {
        // Blue Bar Accent
        doc.rect(leftColX, leftY, 5, 20).fill(primaryColor);
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
            .font(boldFont)
            .fontSize(14)
            .text('PROFESSIONAL SUMMARY', leftColX + 15, leftY + 3, { characterSpacing: 1 });

        leftY += 35;
        doc.fillColor(isDark ? '#D1D5DB' : '#4B5563')
            .font(font)
            .fontSize(11)
            .text(`"${resumeData.summary}"`, leftColX, leftY, { width: leftColWidth, align: 'justify', lineGap: 3, oblique: true });

        leftY += doc.heightOfString(`"${resumeData.summary}"`, { width: leftColWidth, fontSize: 11, lineGap: 3 }) + 45;
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
        doc.rect(leftColX, leftY, 5, 20).fill(primaryColor);
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
            .font(boldFont)
            .fontSize(14)
            .text('EXPERIENCE', leftColX + 15, leftY + 3, { characterSpacing: 1 });

        leftY += 40;

        resumeData.experience.forEach((exp) => {
            // Check for page break
            if (leftY > pageHeight - 80) {
                doc.addPage();
                if (isDark) doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
                leftY = margin + 20;
            }

            // Timeline Circle
            doc.circle(leftColX - 12, leftY + 8, 5).fill(primaryColor);

            // Role
            doc.fillColor(isDark ? '#F9FAFB' : '#111827')
                .font(boldFont)
                .fontSize(13)
                .text(exp.role, leftColX, leftY, { width: leftColWidth * 0.7 });

            // Duration (Right aligned pill shadow)
            const durationWidth = 100;
            doc.fillColor(isDark ? '#1F2937' : '#F3F4F6')
                .roundedRect(leftColX + leftColWidth - durationWidth, leftY, durationWidth, 18, 9)
                .fill();
            doc.fillColor(isDark ? '#9CA3AF' : '#6B7280')
                .font(boldFont)
                .fontSize(8.5)
                .text(exp.duration, leftColX + leftColWidth - durationWidth, leftY + 5, { align: 'center', width: durationWidth });

            leftY += Math.max(22, doc.heightOfString(exp.role, { fontSize: 13, width: leftColWidth * 0.7 }));

            // Company
            doc.fillColor(secondaryColor).font(boldFont).fontSize(11).text(exp.company, leftColX, leftY, { width: leftColWidth });
            leftY += 22;

            // Description
            doc.fillColor(isDark ? '#9CA3AF' : '#4B5563').font(font).fontSize(10.5).text(exp.description, leftColX, leftY, { width: leftColWidth, lineGap: 3, align: 'justify' });
            leftY += doc.heightOfString(exp.description, { width: leftColWidth, fontSize: 10.5, lineGap: 3 }) + 35;
        });
    }

    // RIGHT COLUMN (Sidebar)
    let rightY = currentY;

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
            .font(boldFont)
            .fontSize(14)
            .text('EDUCATION', rightColX, rightY, { characterSpacing: 1 });

        rightY += 35;

        resumeData.education.forEach(edu => {
            doc.fillColor(isDark ? '#F9FAFB' : '#111827').font(boldFont).fontSize(11).text(edu.degree, rightColX, rightY, { width: rightColWidth });
            rightY += doc.heightOfString(edu.degree, { fontSize: 11, width: rightColWidth }) + 5;

            doc.fillColor(isDark ? '#9CA3AF' : '#666666').font(font).fontSize(10).text(edu.institution, rightColX, rightY, { width: rightColWidth });
            rightY += 15;

            doc.fillColor(isDark ? '#4B5563' : '#9CA3AF').font(boldFont).fontSize(9).text(edu.year, rightColX, rightY, { width: rightColWidth });
            rightY += 30;
        });
    }

    // Skills / Expertise
    if (resumeData.skills && resumeData.skills.length > 0) {
        rightY += 15;
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
            .font(boldFont)
            .fontSize(14)
            .text('EXPERTISE', rightColX, rightY, { characterSpacing: 1 });

        rightY += 35;

        resumeData.skills.forEach(skill => {
            // Background for skill pill
            doc.fillColor(isDark ? '#1F2937' : '#F9FAFB')
                .rect(rightColX, rightY, rightColWidth, 20)
                .fill();

            doc.fillColor(isDark ? '#D1D5DB' : '#4B5563')
                .font(boldFont)
                .fontSize(9)
                .text(skill.toUpperCase(), rightColX + 10, rightY + 6, { width: rightColWidth - 20 });

            rightY += 25;
        });
    }

    doc.end();
};

module.exports = { generatePDF };
