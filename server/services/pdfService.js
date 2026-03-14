const PDFDocument = require('pdfkit');
const { getHex } = require('./themeHelper');

const renderTwoColumnLayout = (doc, resumeData, themeOptions) => {
    const { primaryColor, secondaryColor, isDark, font, boldFont, grayColor, timelineColor, pageWidth, pageHeight, margin } = themeOptions;
    let y = 60;
    // Name
    const nameText = String(resumeData.name || 'Your Name').toUpperCase();
    doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(28).text(nameText, margin, y, { align: 'center', width: pageWidth - 100 });
    y += 35;
    // Contact & Marital Status
    let contact = `${String(resumeData.email || '')}   |   ${String(resumeData.phone || '')}`;
    if (resumeData.maritalStatus) contact += `   |   ${String(resumeData.maritalStatus)}`;
    doc.fillColor(grayColor).font(font).fontSize(10).text(contact, margin, y, { align: 'center', width: pageWidth - 100 });
    y += 18;
    // LinkedIn
    if (resumeData.linkedin) {
        doc.fillColor(isDark ? '#3B82F6' : '#0a66c2').font(boldFont).fontSize(10).text('LINKEDIN PROFILE', margin, y, { align: 'center', width: pageWidth - 100, link: resumeData.linkedin, underline: true });
    }
    y += 30;
    // Divider
    doc.strokeColor(isDark ? '#1F2937' : '#EEEEEE').lineWidth(0.5).moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();
    y += 40;
    const contentStartY = y;
    const leftWidth = 310;
    const rightWidth = 160;
    const rightX = margin + leftWidth + 30;

    // --- SIDEBAR (RIGHT) ---
    let ry = contentStartY;
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
    if (resumeData.skills && resumeData.skills.length > 0) {
        ry += 15;
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('EXPERTISE', rightX, ry);
        ry += 25;
        resumeData.skills.forEach(skill => {
            const skillText = `• ${String(skill).toUpperCase()}`;
            doc.fillColor(isDark ? '#D1D5DB' : '#444444').font(font).fontSize(9.5).text(skillText, rightX, ry, { width: rightWidth });
            ry = doc.y + 6;
        });
    }

    // --- MAIN CONTENT (LEFT) ---
    let ly = contentStartY;
    if (resumeData.summary) {
        doc.fillColor(primaryColor).rect(margin, ly, 4, 18).fill();
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('PROFESSIONAL SUMMARY', margin + 15, ly + 2);
        ly += 30;
        const summaryText = String(resumeData.summary);
        doc.fillColor(isDark ? '#D1D5DB' : '#444444').font(font).fontSize(10.5).text(summaryText, margin, ly, { width: leftWidth, align: 'justify', lineGap: 2 });
        ly += doc.heightOfString(summaryText, { width: leftWidth, fontSize: 10.5, lineGap: 2 }) + 35;
    }
    if (resumeData.experience && resumeData.experience.length > 0) {
        doc.fillColor(primaryColor).rect(margin, ly, 4, 18).fill();
        doc.fillColor(isDark ? '#FFFFFF' : secondaryColor).font(boldFont).fontSize(13).text('EXPERIENCE', margin + 15, ly + 2);
        ly += 35;
        const timelineX = margin + 2;
        const expStartX = margin + 30;
        const itemLeftWidth = leftWidth - 30;
        resumeData.experience.forEach((exp) => {
            const role = String(exp.role || '');
            const duration = String(exp.duration || '');
            const company = String(exp.company || '');
            const description = String(exp.description || '');
            const durTextSize = 8;
            const durWidth = doc.widthOfString(duration, { fontSize: durTextSize }) + 10;
            const roleWidthLimit = itemLeftWidth - durWidth - 10;
            const roleHeight = doc.heightOfString(role, { fontSize: 11, width: roleWidthLimit, font: boldFont });
            const companyHeight = 18;
            const descHeight = doc.heightOfString(description, { fontSize: 10, width: itemLeftWidth, align: 'justify', lineGap: 1.5 });
            const headerHeight = roleHeight + companyHeight + 5;
            const totalItemHeight = headerHeight + descHeight + 10;
            if (ly + roleHeight + 10 > pageHeight - 30) {
                doc.addPage();
                if (isDark) doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
                ly = 50;
            }
            const lineEndY = Math.min(ly + totalItemHeight, pageHeight - 30);
            doc.strokeColor(timelineColor).lineWidth(1).moveTo(timelineX, ly).lineTo(timelineX, lineEndY).stroke();
            doc.fillColor(primaryColor).circle(timelineX, ly + 6, 4).fill();
            doc.fillColor(isDark ? '#1F2937' : '#F3F4F6').rect(margin + leftWidth - durWidth, ly - 2, durWidth, 14, 7).fill();
            doc.fillColor(grayColor).font(font).fontSize(durTextSize).text(duration, margin + leftWidth - durWidth + 5, ly + 1.5);
            doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(boldFont).fontSize(11).text(role, expStartX, ly, { width: roleWidthLimit });
            ly = doc.y + 2;
            doc.fillColor(secondaryColor).font(boldFont).fontSize(10.5).text(company, expStartX, ly);
            ly = doc.y + 4;
            doc.fillColor(isDark ? '#9CA3AF' : '#555555').font(font).fontSize(10).text(description, expStartX, ly, { width: itemLeftWidth, align: 'justify', lineGap: 1 });
            ly = doc.y + 12;
        });
    }
};

const renderMinimalLayout = (doc, resumeData, themeOptions) => {
    const { primaryColor, secondaryColor, isDark, font, boldFont, grayColor, pageWidth, pageHeight, margin } = themeOptions;
    let y = 60;
    const contentWidth = pageWidth - (margin * 2);

    // Name left aligned
    const nameText = String(resumeData.name || 'Your Name');
    doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(font).fontSize(36).text(nameText, margin, y, { width: contentWidth });
    y = doc.y + 10;

    // Contact mapping
    const contactParts = [];
    if (resumeData.email) contactParts.push(resumeData.email);
    if (resumeData.phone) contactParts.push(resumeData.phone);
    if (resumeData.linkedin) contactParts.push(resumeData.linkedin);
    if (resumeData.maritalStatus) contactParts.push(resumeData.maritalStatus);

    doc.fillColor(grayColor).font(font).fontSize(10).text(contactParts.join('  •  '), margin, y, { width: contentWidth });
    y = doc.y + 30;

    if (resumeData.summary) {
        doc.fillColor(isDark ? '#D1D5DB' : '#444444').font(font).fontSize(10.5).text(String(resumeData.summary), margin, y, { width: contentWidth, align: 'left', lineGap: 2 });
        y = doc.y + 30;
    }

    const checkPageBreak = (neededHeight) => {
        if (y + neededHeight > pageHeight - margin) {
            doc.addPage();
            if (isDark) doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
            y = margin;
        }
    };

    if (resumeData.experience && resumeData.experience.length > 0) {
        checkPageBreak(50);
        doc.fillColor(secondaryColor).font(boldFont).fontSize(14).text('Experience', margin, y);
        y = doc.y + 4;
        doc.strokeColor(isDark ? '#374151' : '#E5E7EB').lineWidth(1).moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();
        y += 15;

        // Left column for dates, right for content
        const dateWidth = 80;
        const detailX = margin + dateWidth + 15;
        const detailWidth = contentWidth - dateWidth - 15;

        resumeData.experience.forEach((exp) => {
            const role = String(exp.role || '');
            const company = String(exp.company || '');
            const duration = String(exp.duration || '');
            const description = String(exp.description || '');

            const roleHeight = doc.heightOfString(role, { fontSize: 11, font: boldFont, width: detailWidth });
            checkPageBreak(roleHeight + 20);

            // Date
            doc.fillColor(grayColor).font(font).fontSize(9).text(duration, margin, y + 2, { width: dateWidth });

            // Content
            let curY = y;
            doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(boldFont).fontSize(11).text(role, detailX, curY, { width: detailWidth });
            curY = doc.y + 2;
            doc.fillColor(grayColor).font(font).fontSize(10).text(company, detailX, curY, { width: detailWidth });
            curY = doc.y + 6;
            doc.fillColor(isDark ? '#D1D5DB' : '#444444').font(font).fontSize(10).text(description, detailX, curY, { width: detailWidth, align: 'left', lineGap: 1.5 });

            y = doc.y + 20;
        });
    }

    if (resumeData.education && resumeData.education.length > 0) {
        checkPageBreak(50);
        doc.fillColor(secondaryColor).font(boldFont).fontSize(14).text('Education', margin, y);
        y = doc.y + 4;
        doc.strokeColor(isDark ? '#374151' : '#E5E7EB').lineWidth(1).moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();
        y += 15;

        const dateWidth = 80;
        const detailX = margin + dateWidth + 15;
        const detailWidth = contentWidth - dateWidth - 15;

        resumeData.education.forEach((edu) => {
            checkPageBreak(40);
            doc.fillColor(grayColor).font(font).fontSize(9).text(String(edu.year || ''), margin, y + 2, { width: dateWidth });
            let curY = y;
            doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(boldFont).fontSize(11).text(String(edu.degree || ''), detailX, curY, { width: detailWidth });
            curY = doc.y + 2;
            doc.fillColor(grayColor).font(font).fontSize(10).text(String(edu.institution || ''), detailX, curY, { width: detailWidth });
            y = doc.y + 15;
        });
    }

    if (resumeData.skills && resumeData.skills.length > 0) {
        checkPageBreak(50);
        doc.fillColor(secondaryColor).font(boldFont).fontSize(14).text('Skills', margin, y);
        y = doc.y + 4;
        doc.strokeColor(isDark ? '#374151' : '#E5E7EB').lineWidth(1).moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();
        y += 15;

        doc.fillColor(isDark ? '#D1D5DB' : '#444444').font(font).fontSize(10).text(resumeData.skills.join('  •  '), margin, y, { width: contentWidth, lineGap: 4 });
    }
};

const renderClassicLayout = (doc, resumeData, themeOptions) => {
    const { primaryColor, secondaryColor, isDark, font, boldFont, grayColor, pageWidth, pageHeight, margin } = themeOptions;
    let y = 60;
    const contentWidth = pageWidth - (margin * 2);

    // Name Centered
    const nameText = String(resumeData.name || 'Your Name').toUpperCase();
    doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(boldFont).fontSize(26).text(nameText, margin, y, { align: 'center', width: contentWidth });
    y = doc.y + 6;

    const contactParts = [];
    if (resumeData.email) contactParts.push(resumeData.email);
    if (resumeData.phone) contactParts.push(resumeData.phone);
    if (resumeData.linkedin) contactParts.push(resumeData.linkedin);
    if (resumeData.maritalStatus) contactParts.push(resumeData.maritalStatus);

    doc.fillColor(grayColor).font(font).fontSize(10).text(contactParts.join('   |   '), margin, y, { align: 'center', width: contentWidth });
    y = doc.y + 15;

    doc.strokeColor(primaryColor).lineWidth(2).moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();
    y += 20;

    const checkPageBreak = (neededHeight) => {
        if (y + neededHeight > pageHeight - margin) {
            doc.addPage();
            if (isDark) doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
            y = margin;
        }
    };

    if (resumeData.summary) {
        checkPageBreak(50);
        doc.fillColor(secondaryColor).font(boldFont).fontSize(12).text('PROFESSIONAL SUMMARY', margin, y, { align: 'center', width: contentWidth });
        y = doc.y + 10;
        doc.fillColor(isDark ? '#D1D5DB' : '#333333').font(font).fontSize(10.5).text(String(resumeData.summary), margin, y, { width: contentWidth, align: 'justify', lineGap: 2 });
        y = doc.y + 25;
    }

    if (resumeData.experience && resumeData.experience.length > 0) {
        checkPageBreak(50);
        doc.fillColor(secondaryColor).font(boldFont).fontSize(12).text('EXPERIENCE', margin, y, { align: 'center', width: contentWidth });
        y = doc.y + 15;

        resumeData.experience.forEach((exp) => {
            const role = String(exp.role || '');
            const company = String(exp.company || '');
            const duration = String(exp.duration || '');
            const description = String(exp.description || '');

            checkPageBreak(40);

            // Role and Duration on same line
            doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(boldFont).fontSize(11).text(role, margin, y);
            const durWidth = doc.widthOfString(duration, { fontSize: 10, font: font });
            doc.fillColor(grayColor).font(font).fontSize(10).text(duration, pageWidth - margin - durWidth, y);
            y = doc.y + 2;

            doc.fillColor(secondaryColor).font(boldFont).fontSize(10).text(company, margin, y);
            y = doc.y + 6;

            const descX = margin + 15;
            const descWidth = contentWidth - 15;
            doc.strokeColor(isDark ? '#374151' : '#E5E7EB').lineWidth(1).moveTo(margin + 5, y).lineTo(margin + 5, y + doc.heightOfString(description, { width: descWidth, fontSize: 10 })).stroke();

            doc.fillColor(isDark ? '#D1D5DB' : '#333333').font(font).fontSize(10).text(description, descX, y, { width: descWidth, align: 'justify', lineGap: 1.5 });
            y = doc.y + 20;
        });
    }

    if (resumeData.education && resumeData.education.length > 0) {
        checkPageBreak(50);
        doc.fillColor(secondaryColor).font(boldFont).fontSize(12).text('EDUCATION', margin, y, { align: 'center', width: contentWidth });
        y = doc.y + 15;

        resumeData.education.forEach((edu) => {
            checkPageBreak(40);
            doc.fillColor(isDark ? '#FFFFFF' : '#111827').font(boldFont).fontSize(11).text(String(edu.degree || ''), margin, y);
            const yearWidth = doc.widthOfString(String(edu.year || ''), { fontSize: 10, font: font });
            doc.fillColor(grayColor).font(font).fontSize(10).text(String(edu.year || ''), pageWidth - margin - yearWidth, y);
            y = doc.y + 2;

            doc.fillColor(isDark ? '#D1D5DB' : '#555555').font(font).fontSize(10).text(String(edu.institution || ''), margin, y);
            y = doc.y + 15;
        });
    }

    if (resumeData.skills && resumeData.skills.length > 0) {
        checkPageBreak(50);
        doc.fillColor(secondaryColor).font(boldFont).fontSize(12).text('CORE COMPETENCIES', margin, y, { align: 'center', width: contentWidth });
        y = doc.y + 10;
        doc.fillColor(isDark ? '#D1D5DB' : '#333333').font(boldFont).fontSize(10).text(resumeData.skills.join('  •  '), margin, y, { align: 'center', width: contentWidth, lineGap: 4 });
    }
};

const generatePDF = (resumeData, stream) => {
    try {
        console.log('PDF Service: Starting generation for', resumeData.name);

        const theme = resumeData.theme || { layout: 'two-column' };
        const primaryColor = getHex(theme.colors?.primary);
        const secondaryColor = getHex(theme.colors?.secondary);
        const isDark = theme.darkMode;
        const font = theme.font === 'serif' ? 'Times-Roman' : 'Helvetica';
        const boldFont = theme.font === 'serif' ? 'Times-Bold' : 'Helvetica-Bold';
        const grayColor = isDark ? '#9CA3AF' : '#666666';
        const timelineColor = isDark ? '#374151' : '#E5E7EB';

        const doc = new PDFDocument({ margin: 0, size: 'A4', bufferPages: true });
        doc.pipe(stream);

        const margin = 50;
        const pageWidth = 595.28;
        const pageHeight = 841.89;

        doc.on('pageAdded', () => {
            if (isDark) doc.rect(0, 0, doc.page.width, doc.page.height).fill('#111827');
            doc.x = margin + 30; // safety for two-column timeline
            doc.y = 50;
        });

        if (isDark) {
            doc.rect(0, 0, pageWidth, pageHeight).fill('#111827');
        }

        if (!isDark && theme.layout === 'two-column') {
            doc.rect(0, 0, pageWidth, 6).fill(primaryColor);
        }

        const themeOptions = { primaryColor, secondaryColor, isDark, font, boldFont, grayColor, timelineColor, pageWidth, pageHeight, margin };

        if (theme.layout === 'minimal') {
            renderMinimalLayout(doc, resumeData, themeOptions);
        } else if (theme.layout === 'classic') {
            renderClassicLayout(doc, resumeData, themeOptions);
        } else {
            renderTwoColumnLayout(doc, resumeData, themeOptions);
        }

        doc.end();
        console.log('PDF Service: Generation finalized');
    } catch (error) {
        console.error('PDF Service: Error generating document:', error);
        throw error;
    }
};

module.exports = { generatePDF };
