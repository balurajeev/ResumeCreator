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

            const timelineX = margin + 2; // Center of the 4px vertical bar
            const expStartX = margin + 25; // Indent content for timeline
            const itemLeftWidth = leftWidth - 15;

            // Pre-calculate heights for the connecting line
            const experienceEntries = [];
            let currentLy = ly;

            resumeData.experience.forEach((exp, index) => {
                if (currentLy > pageHeight - 120) {
                    currentLy = 50;
                }
                const startY = currentLy;

                // Estimate height
                const roleHeight = Math.max(16, doc.heightOfString(String(exp.role || ''), { fontSize: 11, width: itemLeftWidth - 100 }));
                const descHeight = doc.heightOfString(String(exp.description || ''), { width: itemLeftWidth, fontSize: 10, lineGap: 1.5 });
                const totalHeight = 16 + 18 + descHeight + 28;

                experienceEntries.push({ ...exp, y: startY, height: totalHeight });
                currentLy += totalHeight;
            });

            // Draw Timeline Line
            if (experienceEntries.length > 1) {
                doc.strokeColor(timelineColor).lineWidth(1.5)
                    .moveTo(timelineX, experienceEntries[0].y + 5)
                    .lineTo(timelineX, experienceEntries[experienceEntries.length - 1].y + 5)
                    .stroke();
            }

            resumeData.experience.forEach((exp, index) => {
                if (ly > pageHeight - 120) {
                    doc.addPage();
                    if (isDark) doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
                    ly = 50;

                    // Redraw line on new page if needed (simplified for repo version)
                    doc.strokeColor(timelineColor).lineWidth(1.5)
                        .moveTo(timelineX, ly)
                        .lineTo(timelineX, pageHeight - 50)
                        .stroke();
                }

                // Blue Circle Bullet
                doc.fillColor(primaryColor).circle(timelineX, ly + 5, 4).fill();

                // Role
                const role = String(exp.role || '');
                doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(boldFont).fontSize(11).text(role, expStartX, ly, { width: itemLeftWidth - 100 });

                // Duration Pill
                const dur = String(exp.duration || '');
                const durWidth = doc.widthOfString(dur, { fontSize: 8.5 }) + 10;
                doc.fillColor(isDark ? '#1F2937' : '#F3F4F6').rect(margin + leftWidth - durWidth, ly - 2, durWidth, 14, 7).fill();
                doc.fillColor(grayColor).font(font).fontSize(8.5).text(dur, margin + leftWidth - durWidth + 5, ly + 1);

                ly += Math.max(16, doc.heightOfString(role, { fontSize: 11, width: itemLeftWidth - 100 })) + 4;

                // Company
                doc.fillColor(secondaryColor).font(boldFont).fontSize(10.5).text(String(exp.company || ''), expStartX, ly);
                ly += 18;

                // Description
                const desc = String(exp.description || '');
                doc.fillColor(isDark ? '#9CA3AF' : '#555555').font(font).fontSize(10).text(desc, expStartX, ly, { width: itemLeftWidth, align: 'justify', lineGap: 1.5 });
                ly += doc.heightOfString(desc, { width: itemLeftWidth, fontSize: 10, lineGap: 1.5 }) + 28;
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
