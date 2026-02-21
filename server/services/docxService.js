const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, BorderStyle, AlignmentType, ShadingType, ExternalHyperlink,
    TableLayoutType
} = require('docx');
const { getHex } = require('./themeHelper');

const generateDOCX = async (resumeData) => {
    try {
        console.log('DOCX Service: Starting generation for', resumeData.name);

        const theme = resumeData.theme || {};
        const primaryColor = getHex(theme.colors?.primary || 'bg-linkedin-blue').replace('#', '');
        const secondaryColor = getHex(theme.colors?.secondary || 'text-linkedin-blue').replace('#', '');
        const isDark = theme.darkMode;
        const font = theme.font === 'serif' ? 'Times New Roman' : 'Arial';

        const bgColor = isDark ? '111827' : 'FFFFFF';
        const textColor = isDark ? 'FFFFFF' : '333333';
        const grayText = isDark ? '9CA3AF' : '666666';
        const timelineColor = isDark ? '374151' : 'E5E7EB';

        const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
        const education = Array.isArray(resumeData.education) ? resumeData.education : [];
        const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];

        const doc = new Document({
            background: { color: bgColor },
            styles: {
                default: {
                    document: {
                        run: {
                            size: 20,
                            font: font,
                            color: textColor,
                        },
                    },
                },
            },
            sections: [{
                properties: {
                    page: {
                        margin: { top: 720, bottom: 720, left: 720, right: 720 },
                    },
                },
                children: [
                    // Header
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: (resumeData.name || 'Resume').toUpperCase(),
                                bold: true,
                                size: 40,
                                color: secondaryColor,
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 200, after: 100 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${resumeData.email || ''}  |  ${resumeData.phone || ''}  |  `,
                                color: grayText,
                                size: 18,
                            }),
                            ...(resumeData.linkedin ? [
                                new ExternalHyperlink({
                                    children: [
                                        new TextRun({
                                            text: "LinkedIn Profile",
                                            color: isDark ? "3B83F6" : "0a66c2",
                                            underline: true,
                                            size: 18,
                                        }),
                                    ],
                                    link: resumeData.linkedin,
                                }),
                            ] : []),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 500 },
                    }),

                    // Main Layout Table
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        columnWidths: [6500, 3500],
                        layout: TableLayoutType.FIXED,
                        borders: {
                            top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                            insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    // Left Column
                                    new TableCell({
                                        width: { size: 65, type: WidthType.PERCENTAGE },
                                        margins: { right: 200 },
                                        children: [
                                            // Summary
                                            ...(resumeData.summary ? [
                                                new Paragraph({
                                                    children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, color: secondaryColor, size: 22 })],
                                                    border: { left: { color: primaryColor, space: 10, style: BorderStyle.SINGLE, size: 24 } },
                                                    spacing: { before: 200, after: 150 },
                                                }),
                                                new Paragraph({
                                                    children: [new TextRun({ text: resumeData.summary })],
                                                    spacing: { after: 300 },
                                                    alignment: AlignmentType.JUSTIFY,
                                                }),
                                            ] : []),

                                            // Experience Header
                                            new Paragraph({
                                                children: [new TextRun({ text: 'EXPERIENCE', bold: true, color: secondaryColor, size: 22 })],
                                                border: { left: { color: primaryColor, space: 10, style: BorderStyle.SINGLE, size: 24 } },
                                                spacing: { before: 300, after: 150 },
                                            }),

                                            // Experience Items with Timeline simulation
                                            ...experience.flatMap((exp, index) => [
                                                // Role row — bullet hangs left, text indented
                                                new Paragraph({
                                                    children: [
                                                        new TextRun({ text: "● ", color: primaryColor, size: 20 }),
                                                        new TextRun({ text: String(exp.role || ''), bold: true, size: 20, color: textColor }),
                                                    ],
                                                    indent: { left: 280, hanging: 220 },
                                                    spacing: { before: 140, after: 40 },
                                                    border: { left: { color: timelineColor, space: 8, style: BorderStyle.SINGLE, size: 10 } },
                                                }),
                                                // Company + Duration on same line
                                                new Paragraph({
                                                    children: [
                                                        new TextRun({ text: String(exp.company || ''), bold: true, color: secondaryColor, size: 18 }),
                                                        new TextRun({ text: `\t${String(exp.duration || '')}`, color: grayText, size: 16 }),
                                                    ],
                                                    tabStops: [{ type: 'right', position: 5800 }],
                                                    indent: { left: 280 },
                                                    spacing: { before: 0, after: 60 },
                                                    border: { left: { color: timelineColor, space: 8, style: BorderStyle.SINGLE, size: 10 } },
                                                }),
                                                // Description lines
                                                ...(String(exp.description || '')).split('\n').filter(l => l.trim()).map(line => (
                                                    new Paragraph({
                                                        children: [new TextRun({ text: line.trim(), size: 18 })],
                                                        indent: { left: 280 },
                                                        spacing: { before: 0, after: 60 },
                                                        alignment: AlignmentType.JUSTIFY,
                                                        border: { left: { color: timelineColor, space: 8, style: BorderStyle.SINGLE, size: 10 } },
                                                    })
                                                )),
                                                // Spacer between items — keep line only between items
                                                new Paragraph({
                                                    children: [new TextRun({ text: "" })],
                                                    spacing: { before: 0, after: 80 },
                                                    border: { left: (index < experience.length - 1) ? { color: timelineColor, space: 8, style: BorderStyle.SINGLE, size: 10 } : { style: BorderStyle.NONE } }
                                                }),
                                            ]),
                                        ],
                                    }),
                                    // Right Column
                                    new TableCell({
                                        width: { size: 35, type: WidthType.PERCENTAGE },
                                        margins: { left: 200 },
                                        children: [
                                            // Education
                                            new Paragraph({
                                                children: [new TextRun({ text: 'EDUCATION', bold: true, color: secondaryColor, size: 22 })],
                                                spacing: { before: 200, after: 150 },
                                            }),
                                            ...education.flatMap(edu => [
                                                new Paragraph({
                                                    children: [new TextRun({ text: String(edu.degree || ''), bold: true, size: 18, color: textColor })],
                                                }),
                                                new Paragraph({
                                                    children: [new TextRun({ text: String(edu.institution || ''), size: 16, color: grayText })],
                                                }),
                                                new Paragraph({
                                                    children: [new TextRun({ text: String(edu.year || ''), size: 14, color: grayText, bold: true })],
                                                    spacing: { after: 200 },
                                                }),
                                            ]),

                                            // Expertise
                                            new Paragraph({
                                                children: [new TextRun({ text: 'EXPERTISE', bold: true, color: secondaryColor, size: 22 })],
                                                spacing: { before: 400, after: 150 },
                                            }),
                                            ...skills.map(skill => (
                                                new Paragraph({
                                                    children: [new TextRun({ text: `• ${String(skill).toUpperCase()}`, size: 15, bold: true })],
                                                    spacing: { before: 50, after: 50 },
                                                })
                                            )),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);
        return buffer;
    } catch (error) {
        console.error('DOCX Service: Error generating document:', error);
        throw error;
    }
};

module.exports = { generateDOCX };
