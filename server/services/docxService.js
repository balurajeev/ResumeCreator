const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, BorderStyle, AlignmentType, ShadingType, ExternalHyperlink,
    TableLayoutType
} = require('docx');
const { getHex } = require('./themeHelper');

const generateDOCX = async (resumeData) => {
    const theme = resumeData.theme || {};
    const primaryColor = getHex(theme.colors?.primary || 'bg-linkedin-blue').replace('#', '');
    const secondaryColor = getHex(theme.colors?.secondary || 'text-linkedin-blue').replace('#', '');
    const isDark = theme.darkMode;

    // Switch to standard fonts for better compatibility
    const font = theme.font === 'serif' ? 'Times New Roman' : 'Arial';
    const bgColor = isDark ? '111827' : 'FFFFFF';
    const textColor = isDark ? 'FFFFFF' : '333333';
    const grayText = isDark ? '9CA3AF' : '666666';

    const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
    const education = Array.isArray(resumeData.education) ? resumeData.education : [];
    const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];

    const doc = new Document({
        background: { color: bgColor },
        styles: {
            default: {
                document: {
                    run: {
                        size: 20, // 10pt
                        font: font,
                        color: textColor,
                    },
                },
            },
        },
        sections: [{
            properties: {
                page: {
                    margin: { top: 720, bottom: 720, left: 720, right: 720 }, // 0.5 inch margins
                },
            },
            children: [
                // Header (Single column for simplicity and to avoid issues)
                new Paragraph({
                    children: [
                        new TextRun({
                            text: (resumeData.name || 'Resume').toUpperCase(),
                            bold: true,
                            size: 44, // 22pt
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
                                        text: "LinkedIn",
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
                    spacing: { after: 400 },
                }),

                // Two Column Layout
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    columnWidths: [6500, 3500], // Explicitly set column widths
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

                                        // Experience
                                        new Paragraph({
                                            children: [new TextRun({ text: 'EXPERIENCE', bold: true, color: secondaryColor, size: 22 })],
                                            border: { left: { color: primaryColor, space: 10, style: BorderStyle.SINGLE, size: 24 } },
                                            spacing: { before: 300, after: 150 },
                                        }),
                                        ...experience.flatMap(exp => [
                                            new Paragraph({
                                                children: [new TextRun({ text: exp.role || 'Role', bold: true, size: 20, color: textColor })],
                                                spacing: { before: 150 },
                                            }),
                                            new Paragraph({
                                                children: [
                                                    new TextRun({ text: exp.company || 'Company', bold: true, color: secondaryColor, size: 18 }),
                                                    new TextRun({ text: `\t${exp.duration || ''}`, color: grayText, size: 16 }),
                                                ],
                                                tabStops: [{ type: 'right', position: 6000 }], // Adjusted for 65% width
                                                spacing: { after: 100 },
                                            }),
                                            new Paragraph({
                                                text: exp.description || '',
                                                spacing: { after: 350 },
                                                alignment: AlignmentType.JUSTIFY,
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
                                                children: [new TextRun({ text: edu.degree || '', bold: true, size: 18, color: textColor })],
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: edu.institution || '', size: 16, color: grayText })],
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: edu.year || '', size: 14, color: grayText, bold: true })],
                                                spacing: { after: 200 },
                                            }),
                                        ]),

                                        // Skills
                                        new Paragraph({
                                            children: [new TextRun({ text: 'EXPERTISE', bold: true, color: secondaryColor, size: 22 })],
                                            spacing: { before: 400, after: 150 },
                                        }),
                                        ...skills.map(skill => (
                                            new Paragraph({
                                                children: [new TextRun({ text: `• ${skill}`, size: 16 })],
                                                spacing: { before: 40, after: 40 },
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

    return await Packer.toBuffer(doc);
};

module.exports = { generateDOCX };
