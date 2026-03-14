const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, BorderStyle, AlignmentType, TableLayoutType
} = require('docx');
const { getHex } = require('./themeHelper');

const createHeader = (resumeData, themeOptions, alignment = AlignmentType.CENTER) => {
    const { secondaryColor, grayText, isDark } = themeOptions;
    return [
        new Paragraph({
            children: [
                new TextRun({ text: (resumeData.name || 'Resume').toUpperCase(), bold: true, size: 40, color: secondaryColor }),
            ],
            alignment: alignment,
            spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: `${resumeData.email || ''}  |  ${resumeData.phone || ''}  |  ${resumeData.maritalStatus ? resumeData.maritalStatus + '  |  ' : ''}`,
                    color: grayText,
                    size: 18,
                }),
                // LinkedIn link omitted in DOCX for simplicity in minimal/classic or could be added back
            ],
            alignment: alignment,
            spacing: { after: 500 },
        })
    ];
};

const renderTwoColumnDOCX = (resumeData, themeOptions) => {
    const { primaryColor, secondaryColor, textColor, grayText, timelineColor, isDark } = themeOptions;
    const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
    const education = Array.isArray(resumeData.education) ? resumeData.education : [];
    const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];

    return [
        ...createHeader(resumeData, themeOptions),
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
                        new TableCell({
                            width: { size: 65, type: WidthType.PERCENTAGE },
                            margins: { right: 200 },
                            children: [
                                ...(resumeData.summary ? [
                                    new Paragraph({
                                        children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, color: secondaryColor, size: 22 })],
                                        border: { left: { color: primaryColor, space: 10, style: BorderStyle.SINGLE, size: 24 } },
                                        spacing: { before: 200, after: 150 },
                                    }),
                                    new Paragraph({ children: [new TextRun({ text: resumeData.summary })], spacing: { after: 300 }, alignment: AlignmentType.JUSTIFY }),
                                ] : []),
                                new Paragraph({
                                    children: [new TextRun({ text: 'EXPERIENCE', bold: true, color: secondaryColor, size: 22 })],
                                    border: { left: { color: primaryColor, space: 10, style: BorderStyle.SINGLE, size: 24 } },
                                    spacing: { before: 300, after: 150 },
                                }),
                                ...experience.flatMap((exp, index) => [
                                    new Paragraph({
                                        children: [
                                            new TextRun({ text: "● ", color: primaryColor, size: 20 }),
                                            new TextRun({ text: String(exp.role || ''), bold: true, size: 20, color: textColor }),
                                        ],
                                        indent: { left: 280, hanging: 220 },
                                        spacing: { before: 140, after: 40 },
                                        border: { left: { color: timelineColor, space: 8, style: BorderStyle.SINGLE, size: 10 } },
                                    }),
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
                                    ...(String(exp.description || '')).split('\n').filter(l => l.trim()).map(line => (
                                        new Paragraph({
                                            children: [new TextRun({ text: line.trim(), size: 18 })],
                                            indent: { left: 280 },
                                            spacing: { before: 0, after: 60 },
                                            alignment: AlignmentType.JUSTIFY,
                                            border: { left: { color: timelineColor, space: 8, style: BorderStyle.SINGLE, size: 10 } },
                                        })
                                    )),
                                    new Paragraph({ children: [new TextRun({ text: "" })], spacing: { before: 0, after: 80 }, border: { left: (index < experience.length - 1) ? { color: timelineColor, space: 8, style: BorderStyle.SINGLE, size: 10 } : { style: BorderStyle.NONE } } }),
                                ]),
                            ],
                        }),
                        new TableCell({
                            width: { size: 35, type: WidthType.PERCENTAGE },
                            margins: { left: 200 },
                            children: [
                                new Paragraph({ children: [new TextRun({ text: 'EDUCATION', bold: true, color: secondaryColor, size: 22 })], spacing: { before: 200, after: 150 } }),
                                ...education.flatMap(edu => [
                                    new Paragraph({ children: [new TextRun({ text: String(edu.degree || ''), bold: true, size: 18, color: textColor })] }),
                                    new Paragraph({ children: [new TextRun({ text: String(edu.institution || ''), size: 16, color: grayText })] }),
                                    new Paragraph({ children: [new TextRun({ text: String(edu.year || ''), size: 14, color: grayText, bold: true })], spacing: { after: 200 } }),
                                ]),
                                new Paragraph({ children: [new TextRun({ text: 'EXPERTISE', bold: true, color: secondaryColor, size: 22 })], spacing: { before: 400, after: 150 } }),
                                ...skills.map(skill => (
                                    new Paragraph({
                                        children: [new TextRun({ text: "• ", size: 15, bold: true }), new TextRun({ text: String(skill).toUpperCase(), size: 15, bold: true })],
                                        indent: { left: 180, hanging: 180 },
                                        spacing: { before: 50, after: 50 },
                                    })
                                )),
                            ],
                        }),
                    ],
                }),
            ],
        })
    ];
};

const renderMinimalDOCX = (resumeData, themeOptions) => {
    const { primaryColor, secondaryColor, textColor, grayText, isDark } = themeOptions;
    const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
    const education = Array.isArray(resumeData.education) ? resumeData.education : [];
    const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];

    const children = [
        ...createHeader(resumeData, themeOptions, AlignmentType.LEFT),
        ...(resumeData.summary ? [
            new Paragraph({ children: [new TextRun({ text: resumeData.summary, size: 20 })], spacing: { after: 400 }, alignment: AlignmentType.LEFT })
        ] : []),
    ];

    if (experience.length > 0) {
        children.push(
            new Paragraph({
                children: [new TextRun({ text: 'Experience', bold: true, color: secondaryColor, size: 28 })],
                border: { bottom: { color: isDark ? '374151' : 'E5E7EB', space: 5, style: BorderStyle.SINGLE, size: 10 } },
                spacing: { before: 200, after: 200 },
            })
        );
        experience.forEach(exp => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: String(exp.role || ''), bold: true, size: 22, color: textColor }),
                        new TextRun({ text: `\t${String(exp.duration || '')}`, color: grayText, size: 18, bold: true }),
                    ],
                    tabStops: [{ type: 'right', position: 9000 }],
                    spacing: { after: 50 },
                }),
                new Paragraph({ children: [new TextRun({ text: String(exp.company || ''), color: grayText, size: 20 })], spacing: { after: 100 } }),
                ...(String(exp.description || '')).split('\n').filter(l => l.trim()).map(line => (
                    new Paragraph({ children: [new TextRun({ text: line.trim(), size: 20 })], spacing: { after: 80 } })
                )),
                new Paragraph({ spacing: { after: 150 } })
            );
        });
    }

    if (education.length > 0) {
        children.push(
            new Paragraph({
                children: [new TextRun({ text: 'Education', bold: true, color: secondaryColor, size: 28 })],
                border: { bottom: { color: isDark ? '374151' : 'E5E7EB', space: 5, style: BorderStyle.SINGLE, size: 10 } },
                spacing: { before: 200, after: 200 },
            })
        );
        education.forEach(edu => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: String(edu.degree || ''), bold: true, size: 22, color: textColor }),
                        new TextRun({ text: `\t${String(edu.year || '')}`, color: grayText, size: 18, bold: true }),
                    ],
                    tabStops: [{ type: 'right', position: 9000 }],
                    spacing: { after: 50 },
                }),
                new Paragraph({ children: [new TextRun({ text: String(edu.institution || ''), color: grayText, size: 20 })], spacing: { after: 200 } }),
            );
        });
    }

    if (skills.length > 0) {
        children.push(
            new Paragraph({
                children: [new TextRun({ text: 'Skills', bold: true, color: secondaryColor, size: 28 })],
                border: { bottom: { color: isDark ? '374151' : 'E5E7EB', space: 5, style: BorderStyle.SINGLE, size: 10 } },
                spacing: { before: 200, after: 200 },
            }),
            new Paragraph({
                children: [new TextRun({ text: skills.join('   •   '), size: 20, color: grayText })],
                spacing: { after: 200 },
            })
        );
    }

    return children;
};

const renderClassicDOCX = (resumeData, themeOptions) => {
    const { primaryColor, secondaryColor, textColor, grayText, isDark } = themeOptions;
    const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
    const education = Array.isArray(resumeData.education) ? resumeData.education : [];
    const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];

    const children = [
        ...createHeader(resumeData, themeOptions, AlignmentType.CENTER),
        new Paragraph({
            border: { top: { color: primaryColor, space: 10, style: BorderStyle.SINGLE, size: 24 } },
            spacing: { before: 100, after: 200 },
        }),
    ];

    if (resumeData.summary) {
        children.push(
            new Paragraph({ children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, color: secondaryColor, size: 24 })], alignment: AlignmentType.CENTER, spacing: { after: 150 } }),
            new Paragraph({ children: [new TextRun({ text: resumeData.summary, size: 20 })], spacing: { after: 400 }, alignment: AlignmentType.JUSTIFY })
        );
    }

    if (experience.length > 0) {
        children.push(
            new Paragraph({ children: [new TextRun({ text: 'EXPERIENCE', bold: true, color: secondaryColor, size: 24 })], alignment: AlignmentType.CENTER, spacing: { after: 200 } })
        );
        experience.forEach(exp => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: String(exp.role || ''), bold: true, size: 22, color: textColor }),
                        new TextRun({ text: `\t${String(exp.duration || '')}`, color: grayText, size: 18, bold: true }),
                    ],
                    tabStops: [{ type: 'right', position: 9000 }],
                    spacing: { after: 50 },
                }),
                new Paragraph({ children: [new TextRun({ text: String(exp.company || ''), bold: true, color: secondaryColor, size: 20 })], spacing: { after: 100 } }),
                ...(String(exp.description || '')).split('\n').filter(l => l.trim()).map(line => (
                    new Paragraph({
                        children: [new TextRun({ text: line.trim(), size: 20 })],
                        indent: { left: 360 },
                        spacing: { after: 80 },
                        alignment: AlignmentType.JUSTIFY
                    })
                )),
                new Paragraph({ spacing: { after: 150 } })
            );
        });
    }

    if (education.length > 0) {
        children.push(
            new Paragraph({ children: [new TextRun({ text: 'EDUCATION', bold: true, color: secondaryColor, size: 24 })], alignment: AlignmentType.CENTER, spacing: { after: 200 } })
        );
        education.forEach(edu => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: String(edu.degree || ''), bold: true, size: 22, color: textColor }),
                        new TextRun({ text: `\t${String(edu.year || '')}`, color: grayText, size: 18, bold: true }),
                    ],
                    tabStops: [{ type: 'right', position: 9000 }],
                    spacing: { after: 50 },
                }),
                new Paragraph({ children: [new TextRun({ text: String(edu.institution || ''), color: grayText, size: 20 })], spacing: { after: 200 } }),
            );
        });
    }

    if (skills.length > 0) {
        children.push(
            new Paragraph({ children: [new TextRun({ text: 'CORE COMPETENCIES', bold: true, color: secondaryColor, size: 24 })], alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
            new Paragraph({ children: [new TextRun({ text: skills.join('   •   '), size: 20, bold: true, color: grayText })], alignment: AlignmentType.CENTER, spacing: { after: 200 } })
        );
    }

    return children;
};

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

        const themeOptions = { primaryColor, secondaryColor, textColor, grayText, timelineColor, isDark, font };

        let children = [];
        if (theme.layout === 'minimal') {
            children = renderMinimalDOCX(resumeData, themeOptions);
        } else if (theme.layout === 'classic') {
            children = renderClassicDOCX(resumeData, themeOptions);
        } else {
            children = renderTwoColumnDOCX(resumeData, themeOptions);
        }

        const doc = new Document({
            background: { color: bgColor },
            styles: { default: { document: { run: { size: 20, font: font, color: textColor } } } },
            sections: [{ properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } }, children }]
        });

        const buffer = await Packer.toBuffer(doc);
        return buffer;
    } catch (error) {
        console.error('DOCX Service: Error generating document:', error);
        throw error;
    }
};

module.exports = { generateDOCX };
