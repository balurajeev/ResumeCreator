const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = require('docx');
const { getHex } = require('./themeHelper');

const generateDOCX = async (resumeData) => {
    const theme = resumeData.theme || {};
    const primaryColor = getHex(theme.colors?.primary).replace('#', '');
    const secondaryColor = getHex(theme.colors?.secondary).replace('#', '');
    const font = theme.font === 'serif' ? 'Playfair Display' : 'Inter';

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        size: 22, // 11pt
                        font: font,
                        color: '333333',
                    },
                },
            },
        },
        sections: [{
            children: [
                // Header
                new Paragraph({
                    children: [
                        new TextRun({
                            text: resumeData.name || 'Resume',
                            bold: true,
                            size: 36, // 18pt
                            color: secondaryColor,
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${resumeData.email || ''}  |  ${resumeData.phone || ''}  |  ${resumeData.linkedin || ''}`,
                            color: '666666',
                            size: 20, // 10pt
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                }),

                // Summary
                ...(resumeData.summary ? [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'PROFESSIONAL SUMMARY',
                                bold: true,
                                color: secondaryColor,
                                size: 28,
                            }),
                        ],
                        border: {
                            bottom: {
                                color: primaryColor,
                                space: 1,
                                style: BorderStyle.SINGLE,
                                size: 12,
                            },
                        },
                        spacing: { before: 400, after: 200 },
                    }),
                    new Paragraph({
                        text: resumeData.summary,
                        spacing: { after: 400 },
                    }),
                ] : []),

                // Experience
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'EXPERIENCE',
                            bold: true,
                            color: secondaryColor,
                            size: 28,
                        }),
                    ],
                    border: {
                        bottom: {
                            color: primaryColor,
                            space: 1,
                            style: BorderStyle.SINGLE,
                            size: 12,
                        },
                    },
                    spacing: { before: 400, after: 200 },
                }),
                ...(resumeData.experience || []).flatMap(exp => [
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.role, bold: true, size: 24, color: '000000' }),
                            new TextRun({ text: `\t${exp.duration}`, color: '999999', size: 18 }),
                        ],
                        tabStops: [
                            {
                                type: 'right',
                                position: 9000,
                            },
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.company, bold: true, color: secondaryColor }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        text: exp.description,
                        spacing: { after: 300 },
                    }),
                ]),

                // Education
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'EDUCATION',
                            bold: true,
                            color: secondaryColor,
                            size: 28,
                        }),
                    ],
                    border: {
                        bottom: {
                            color: primaryColor,
                            space: 1,
                            style: BorderStyle.SINGLE,
                            size: 12,
                        },
                    },
                    spacing: { before: 400, after: 200 },
                }),
                ...(resumeData.education || []).flatMap(edu => [
                    new Paragraph({
                        children: [
                            new TextRun({ text: edu.degree, bold: true, color: '000000' }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${edu.institution} (${edu.year})` }),
                        ],
                        spacing: { after: 200 },
                    }),
                ]),

                // Skills
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'SKILLS',
                            bold: true,
                            color: secondaryColor,
                            size: 28,
                        }),
                    ],
                    border: {
                        bottom: {
                            color: primaryColor,
                            space: 1,
                            style: BorderStyle.SINGLE,
                            size: 12,
                        },
                    },
                    spacing: { before: 400, after: 200 },
                }),
                new Paragraph({
                    text: (resumeData.skills || []).join('  •  '),
                }),
            ],
        }],
    });

    return await Packer.toBuffer(doc);
};

module.exports = { generateDOCX };
