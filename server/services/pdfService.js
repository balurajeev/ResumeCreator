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

    // Top Header Accent
    if (!isDark) {
        doc.rect(0, 0, pageWidth, 6).fill(primaryColor);
    }

    // --- HEADER ---
    let y = 60;

    // Name
    doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
        .font(boldFont)
        .fontSize(30)
        .text((resumeData.name || 'Your Name').toUpperCase(), margin, y, { align: 'center', width: pageWidth - (margin * 2) });

    y += 40;

    // Contact
    let contact = `${resumeData.email || ''}   |   ${resumeData.phone || ''}`;
    doc.fillColor(isDark ? '#9CA3AF' : '#666666').font(font).fontSize(10).text(contact, margin, y, { align: 'center', width: pageWidth - (margin * 2) });

    y += 18;

    // LinkedIn
    if (resumeData.linkedin) {
        doc.fillColor(isDark ? '#3B82F6' : '#0a66c2').font(boldFont).fontSize(10).text('LINKEDIN PROFILE', margin, y, {
            align: 'center',
            width: pageWidth - (margin * 2),
            link: resumeData.linkedin,
            underline: true
        });
    }

    y += 35;

    // Divider
    doc.strokeColor(isDark ? '#1F2937' : '#EEEEEE').lineWidth(0.5).moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();

    y += 40;
    const contentStartY = y;

    // --- TWO COLUMN RATIOS ---
    const leftWidth = 320;
    const rightWidth = 160;
    const rightX = margin + leftWidth + 30;

    // --- RENDER SIDEBAR (RIGHT) ---
    // We render this first to ensure it's on the first page
    let ry = contentStartY;

    // Education
    if (resumeData.education?.length > 0) {
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('EDUCATION', rightX, ry);
        ry += 28;
        resumeData.education.forEach(edu => {
            const degree = edu.degree || 'Degree';
            doc.fillColor(isDark ? '#F9FAFB' : '#111827').font(boldFont).fontSize(10).text(degree, rightX, ry, { width: rightWidth });
            ry += doc.heightOfString(degree, { fontSize: 10, width: rightWidth }) + 4;

            const inst = edu.institution || 'University';
            doc.fillColor(isDark ? '#9CA3AF' : '#666666').font(font).fontSize(9).text(inst, rightX, ry, { width: rightWidth });
            ry += doc.heightOfString(inst, { fontSize: 9, width: rightWidth }) + 4;

            doc.fillColor(isDark ? '#6B7280' : '#888888').font(boldFont).fontSize(8).text(edu.year || '', rightX, ry);
            ry += 25;
        });
    }

    // Expertise
    if (resumeData.skills?.length > 0) {
        ry += 20;
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('EXPERTISE', rightX, ry);
        ry += 28;
        resumeData.skills.forEach(skill => {
            doc.fillColor(isDark ? '#D1D5DB' : '#4B5563').font(boldFont).fontSize(9).text(`• ${String(skill).toUpperCase()}`, rightX, ry);
            ry += 18;
        });
    }

    // --- MAIN CONTENT (LEFT) ---
    let ly = contentStartY;

    // Summary
    if (resumeData.summary) {
        // Vertical bar like UI
        doc.fillColor(primaryColor).rect(margin, ly, 4, 18).fill();
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('PROFESSIONAL SUMMARY', margin + 15, ly + 2);
        ly += 32;
        doc.fillColor(isDark ? '#D1D5DB' : '#4B5563').font(font).fontSize(10.5).text(resumeData.summary, margin, ly, { width: leftWidth, align: 'justify', lineGap: 3 });
        ly += doc.heightOfString(resumeData.summary, { width: leftWidth, fontSize: 10.5, lineGap: 3 }) + 40;
    }

    // Experience
    if (resumeData.experience?.length > 0) {
        doc.fillColor(primaryColor).rect(margin, ly, 4, 18).fill();
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('EXPERIENCE', margin + 15, ly + 2);
        ly += 35;

        resumeData.experience.forEach(exp => {
            if (ly > pageHeight - 120) {
                doc.addPage();
                if (isDark) doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
                ly = 50;
            }

            // Role
            const role = exp.role || 'Role';
            doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(boldFont).fontSize(11.5).text(role, margin, ly, { width: leftWidth - 80 });

            // Duration (Top-aligned with Role)
            const dur = exp.duration || '';
            doc.fillColor(isDark ? '#9CA3AF' : '#888888').font(font).fontSize(9).text(dur, margin, ly + 2, { align: 'right', width: leftWidth });

            ly += Math.max(16, doc.heightOfString(role, { fontSize: 11.5, width: leftWidth - 80 })) + 4;

            // Company
            doc.fillColor(secondaryColor).font(boldFont).fontSize(10.5).text(exp.company || '', margin, ly);
            ly += 18;

            // Description (The big fix: strictly dynamic tracking for long texts)
            const desc = exp.description || '';
            doc.fillColor(isDark ? '#9CA3AF' : '#4B5563').font(font).fontSize(10).text(desc, margin, ly, { width: leftWidth, align: 'justify', lineGap: 2 });
            ly += doc.heightOfString(desc, { width: leftWidth, fontSize: 10, lineGap: 2 }) + 28;
        });
    }

    doc.end();
};

module.exports = { generatePDF };
