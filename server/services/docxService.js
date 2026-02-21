const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType, ExternalHyperlink } = require('docx');
const { getHex } = require('./themeHelper');

const generateDOCX = async (resumeData) => {
    const theme = resumeData.theme || {};
    const primaryColor = getHex(theme.colors?.primary).replace('#', '');
    const secondaryColor = getHex(theme.colors?.secondary).replace('#', '');
    const isDark = theme.darkMode;
    const font = theme.font === 'serif' ? 'Playfair Display' : 'Inter';
    const bgColor = isDark ? '111827' : 'FFFFFF';
    const textColor = isDark ? 'FFFFFF' : '333333';
    const grayText = isDark ? '9CA3AF' : '666666';

    const doc = new Document({
        background: { color: bgColor },
        styles: {
            default: {
                document: {
                    run: {
                        size: 21, // ~10.5pt
                        font: font,
                        color: textColor,
                    },
                },
            },
        },
        sections: [{
            children: [
                // header: Name
                new Paragraph({
                    children: [
                        new TextRun({
                            text: (resumeData.name || 'Resume').toUpperCase(),
                            bold: true,
                            size: 48, // 24pt
                            color: secondaryColor,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200, after: 100 },
                }),
                // header: Contact details with link
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${resumeData.email || ''}  |  ${resumeData.phone || ''}  |  `,
                            color: grayText,
                            size: 19,
                        }),
                        ...(resumeData.linkedin ? [
                            new ExternalHyperlink({
                                children: [
                                    new TextRun({
                                        text: "Click here",
                                        style: "Hyperlink",
                                        color: "0a66c2",
                                        underline: true,
                                        size: 19,
                                    }),
                                ],
                                link: resumeData.linkedin,
                            }),
                        ] : []),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 600 },
                }),

                // Two Column Layout via Table
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE },
                        insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                // Left Column (Main)
                                new TableCell({
                                    width: { size: 65, type: WidthType.PERCENTAGE },
                                    margins: { right: 400 },
                                    children: [
                                        // Summary
                                        ...(resumeData.summary ? [
                                            new Paragraph({
                                                children: [
                                                    new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, color: secondaryColor, size: 25 }),
                                                ],
                                                border: { left: { color: primaryColor, space: 8, style: BorderStyle.SINGLE, size: 24 } },
                                                spacing: { before: 200, after: 150 },
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: `"${resumeData.summary}"`, italic: true, size: 21, color: grayText })],
                                                spacing: { after: 400 },
                                                alignment: AlignmentType.JUSTIFY,
                                            }),
                                        ] : []),

                                        // Experience
                                        new Paragraph({
                                            children: [
                                                new TextRun({ text: 'EXPERIENCE', bold: true, color: secondaryColor, size: 25 }),
                                            ],
                                            border: { left: { color: primaryColor, space: 8, style: BorderStyle.SINGLE, size: 24 } },
                                            spacing: { before: 400, after: 150 },
                                        }),
                                        ...(resumeData.experience || []).flatMap(exp => [
                                            new Paragraph({
                                                children: [new TextRun({ text: exp.role, bold: true, size: 23, color: textColor })],
                                                spacing: { before: 200 },
                                            }),
                                            new Paragraph({
                                                children: [
                                                    new TextRun({ text: exp.company, bold: true, color: secondaryColor, size: 19 }),
                                                    new TextRun({ text: `\t${exp.duration}`, color: grayText, size: 16 }),
                                                ],
                                                tabStops: [{ type: 'right', position: 7500 }],
                                                spacing: { after: 100 },
                                            }),
                                            new Paragraph({
                                                text: exp.description,
                                                spacing: { after: 400 },
                                                alignment: AlignmentType.JUSTIFY,
                                            }),
                                        ]),
                                    ],
                                }),
                                // Right Column (Sidebar)
                                new TableCell({
                                    width: { size: 35, type: WidthType.PERCENTAGE },
                                    margins: { left: 400 },
                                    children: [
                                        // Education
                                        new Paragraph({
                                            children: [new TextRun({ text: 'EDUCATION', bold: true, color: secondaryColor, size: 23 })],
                                            spacing: { before: 200, after: 200 },
                                        }),
                                        ...(resumeData.education || []).flatMap(edu => [
                                            new Paragraph({
                                                children: [new TextRun({ text: edu.degree, bold: true, size: 19, color: textColor })],
                                                spacing: { before: 100 },
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: edu.institution, size: 17, color: grayText })],
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: edu.year, size: 16, color: grayText, bold: true })],
                                                spacing: { after: 300 },
                                            }),
                                        ]),

                                        // Skills
                                        new Paragraph({
                                            children: [new TextRun({ text: 'EXPERTISE', bold: true, color: secondaryColor, size: 23 })],
                                            spacing: { before: 500, after: 200 },
                                        }),
                                        ...(resumeData.skills || []).map(skill => (
                                            new Paragraph({
                                                children: [
                                                    new TextRun({
                                                        text: `  ${skill.toUpperCase()}  `,
                                                        size: 15,
                                                        color: textColor,
                                                        bold: true
                                                    }),
                                                ],
                                                shading: {
                                                    type: ShadingType.CLEAR,
                                                    color: isDark ? '1F2937' : 'F3F4F6',
                                                    fill: isDark ? '1F2937' : 'F3F4F6',
                                                },
                                                spacing: { before: 80, after: 80 },
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
