const PDFDocument = require('pdfkit');
const { getHex } = require('./themeHelper');

const generatePDF = (resumeData, stream) => {
    try {
        console.log('PDF Service: Starting generation for', resumeData.name);

        const theme = resumeData.theme || {};
        const primaryColor = getHex(theme.colors?.primary);
        const secondaryColor = getHex(theme.colors?.secondary);
        const isDark = theme.darkMode;
        const font = theme.font === 'serif' ? 'Times-Roman' : 'Helvetica';
        const boldFont = theme.font === 'serif' ? 'Times-Bold' : 'Helvetica-Bold';
        const grayColor = isDark ? '#9CA3AF' : '#666666';
        const timelineColor = isDark ? '#374151' : '#E5E7EB';

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

        // Name
        const nameText = String(resumeData.name || 'Your Name').toUpperCase();
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor)
            .font(boldFont)
            .fontSize(28)
            .text(nameText, margin, y, { align: 'center', width: pageWidth - 100 });

        y += 35;

        // Contact
        let contact = `${String(resumeData.email || '')}   |   ${String(resumeData.phone || '')}`;
        doc.fillColor(grayColor).font(font).fontSize(10).text(contact, margin, y, { align: 'center', width: pageWidth - 100 });

        y += 18;

        // LinkedIn
        if (resumeData.linkedin) {
            doc.fillColor(isDark ? '#3B82F6' : '#0a66c2').font(boldFont).fontSize(10).text('LINKEDIN PROFILE', margin, y, {
                align: 'center',
                width: pageWidth - 100,
                link: resumeData.linkedin,
                underline: true
            });
        }

        y += 30;

        // Divider line
        doc.strokeColor(isDark ? '#1F2937' : '#EEEEEE').lineWidth(0.5).moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();

        y += 40;
        const contentStartY = y;

        // Column Config
        const leftWidth = 310;
        const rightWidth = 160;
        const rightX = margin + leftWidth + 30;

        // --- SIDEBAR (RIGHT) ---
        let ry = contentStartY;

        // Education
        if (resumeData.education && resumeData.education.length > 0) {
            doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('EDUCATION', rightX, ry);
            ry += 25;
            resumeData.education.forEach(edu => {
                const degree = String(edu.degree || '');
                doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(boldFont).fontSize(10).text(degree, rightX, ry, { width: rightWidth });
                ry += doc.heightOfString(degree, { fontSize: 10, width: rightWidth }) + 4;

                const inst = String(edu.institution || '');
                doc.fillColor(grayColor).font(font).fontSize(9).text(inst, rightX, ry, { width: rightWidth });
                ry += doc.heightOfString(inst, { fontSize: 9, width: rightWidth }) + 4;

                doc.fillColor(isDark ? '#6B7280' : '#888888').font(font).fontSize(8).text(String(edu.year || ''), rightX, ry);
                ry += 20;
            });
        }

        // Expertise
        if (resumeData.skills && resumeData.skills.length > 0) {
            ry += 15;
            doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('EXPERTISE', rightX, ry);
            ry += 25;
            resumeData.skills.forEach(skill => {
                doc.fillColor(isDark ? '#D1D5DB' : '#444444').font(font).fontSize(9.5).text(`• ${String(skill).toUpperCase()}`, rightX, ry);
                ry += 16;
            });
        }

        // --- MAIN CONTENT (LEFT) ---
        let ly = contentStartY;

        // Summary
        if (resumeData.summary) {
            doc.fillColor(primaryColor).rect(margin, ly, 4, 18).fill();
            doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('PROFESSIONAL SUMMARY', margin + 15, ly + 2);
            ly += 30;
            const summaryText = String(resumeData.summary);
            doc.fillColor(isDark ? '#D1D5DB' : '#444444').font(font).fontSize(10.5).text(summaryText, margin, ly, { width: leftWidth, align: 'justify', lineGap: 2 });
            ly += doc.heightOfString(summaryText, { width: leftWidth, fontSize: 10.5, lineGap: 2 }) + 35;
        }

        // Experience
        if (resumeData.experience && resumeData.experience.length > 0) {
            doc.fillColor(primaryColor).rect(margin, ly, 4, 18).fill();
            doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('EXPERIENCE', margin + 15, ly + 2);
            ly += 35;

            const timelineX = margin + 2;
            const expStartX = margin + 30; // Increased spacing for circles
            const itemLeftWidth = leftWidth - 30; // Reduced width to avoid overlap

            resumeData.experience.forEach((exp, index) => {
                const role = String(exp.role || '');
                const duration = String(exp.duration || '');
                const company = String(exp.company || '');
                const description = String(exp.description || '');

                // Safety padding check for duration
                const durTextSize = 8;
                const durWidth = doc.widthOfString(duration, { fontSize: durTextSize }) + 10;
                const roleWidthLimit = itemLeftWidth - durWidth - 10;

                // Pre-check height to avoid split blocks
                const roleHeight = doc.heightOfString(role, { fontSize: 11, width: roleWidthLimit, font: boldFont });
                const companyHeight = 18;
                const descHeight = doc.heightOfString(description, { fontSize: 10, width: itemLeftWidth, align: 'justify', lineGap: 1.5 });
                // Calculate how much space this item REALLY needs (Header + bit of margin)
                const headerHeight = roleHeight + companyHeight + 5;
                const totalItemHeight = headerHeight + descHeight + 10;

                // Only break the page if there isn't even room for the role title alone
                if (ly + roleHeight + 10 > pageHeight - 30) {
                    doc.addPage();
                    if (isDark) doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
                    ly = 50;
                }

                // Calculate where this item ends (for the timeline line)
                // We cap the line at the page bottom if the item is huge
                const lineEndY = Math.min(ly + totalItemHeight, pageHeight - 30);

                // Vertical Line Segment (Continuous look)
                doc.strokeColor(timelineColor).lineWidth(1).moveTo(timelineX, ly).lineTo(timelineX, lineEndY).stroke();

                // Blue Circle Bullet (Centered vertically with first line of role)
                doc.fillColor(primaryColor).circle(timelineX, ly + 6, 4).fill();

                // Duration Pill (Right aligned relative to role)
                doc.fillColor(isDark ? '#1F2937' : '#F3F4F6').rect(margin + leftWidth - durWidth, ly - 2, durWidth, 14, 7).fill();
                doc.fillColor(grayColor).font(font).fontSize(durTextSize).text(duration, margin + leftWidth - durWidth + 5, ly + 1.5);

                // Role Text
                doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(boldFont).fontSize(11).text(role, expStartX, ly, { width: roleWidthLimit });

                ly += roleHeight + 2;

                // Company
                doc.fillColor(secondaryColor).font(boldFont).fontSize(10.5).text(company, expStartX, ly);
                ly += 14;

                // Description
                doc.fillColor(isDark ? '#9CA3AF' : '#555555').font(font).fontSize(10).text(description, expStartX, ly, { width: itemLeftWidth, align: 'justify', lineGap: 1 });

                ly += descHeight + 10;
            });
        }

        doc.end();
        console.log('PDF Service: Generation finalized');
    } catch (error) {
        console.error('PDF Service: Error generating document:', error);
        throw error;
    }
};

module.exports = { generatePDF };
