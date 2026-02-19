import React from 'react';
import { Download, Share2, Layout as LayoutIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const ResumePreview = ({ data, onExportPDF, onExportDOCX, theme }) => {
    if (!data.name && !data.summary) {
        return (
            <div className="card p-12 text-center text-gray-500 flex flex-col items-center justify-center min-h-[400px]">
                <LayoutIcon className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg">Your professional resume preview will appear here.</p>
                <p className="text-sm mt-2 opacity-60">Start typing or upload a file to see the magic.</p>
            </div>
        );
    }

    const shareToLinkedIn = () => {
        const summary = `Check out my professional profile! Optimized using AI Resume Creator. ${data.summary?.substring(0, 100)}...`;
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(summary)}`;
        window.open(url, '_blank');
    };

    const isDark = theme.darkMode;
    const fontClass = theme.font === 'serif' ? 'font-serif' : 'font-sans';

    return (
        <div className="sticky top-6">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                <button onClick={onExportPDF} className="btn-primary flex-1 flex items-center justify-center gap-2 whitespace-nowrap">
                    <Download className="w-4 h-4" /> PDF
                </button>
                <button onClick={onExportDOCX} className="btn-secondary flex-1 flex items-center justify-center gap-2 whitespace-nowrap">
                    <Download className="w-4 h-4" /> DOCX
                </button>
                <button onClick={shareToLinkedIn} className="bg-white text-linkedin-blue p-2 rounded-full shadow-sm hover:shadow-md transition-all border border-gray-100" title="Share to LinkedIn">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            <motion.div
                key={theme.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`card p-8 min-h-[842px] shadow-2xl transition-all duration-500 border-t-[6px] ${theme.colors.border} ${isDark ? 'bg-gray-900 text-gray-100 border-none' : 'bg-white text-gray-800'} ${fontClass}`}
            >
                {/* Header Section */}
                <div className={`text-center mb-8 pb-8 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                    <h1 className={`text-4xl font-extrabold tracking-tight uppercase mb-2 ${isDark ? 'text-white' : theme.colors.secondary}`}>
                        {data.name || 'Your Name'}
                    </h1>
                    <div className={`flex flex-wrap justify-center gap-4 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {data.email && <span className="flex items-center gap-1">{data.email}</span>}
                        {data.phone && <span className="flex items-center gap-1">| {data.phone}</span>}
                        {data.linkedin && <span className={`flex items-center gap-1 font-bold ${theme.colors.secondary}`}>| {data.linkedin}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Left/Main Column */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* Summary */}
                        {data.summary && (
                            <section>
                                <h2 className={`text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${theme.colors.secondary}`}>
                                    <div className={`w-2 h-4 ${theme.colors.primary} rounded-full`}></div>
                                    Professional Summary
                                </h2>
                                <p className={`leading-relaxed text-sm ${isDark ? 'text-gray-300' : 'text-gray-600 italic'}`}>
                                    "{data.summary}"
                                </p>
                            </section>
                        )}

                        {/* Experience */}
                        {data.experience?.length > 0 && (
                            <section>
                                <h2 className={`text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${theme.colors.secondary}`}>
                                    <div className={`w-2 h-4 ${theme.colors.primary} rounded-full`}></div>
                                    Experience
                                </h2>
                                <div className="space-y-6">
                                    {data.experience.map((exp, i) => (
                                        <div key={i} className="relative pl-6 border-l-2 border-gray-100 last:border-transparent">
                                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${theme.colors.primary}`}></div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>{exp.role}</h3>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold self-start ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                                    {exp.duration}
                                                </span>
                                            </div>
                                            <div className={`text-sm font-semibold mb-2 ${theme.colors.secondary}`}>{exp.company}</div>
                                            <p className={`text-sm leading-snug whitespace-pre-line ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right/Sidebar Column */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        {/* Education */}
                        {data.education?.length > 0 && (
                            <section>
                                <h2 className={`text-sm font-black uppercase tracking-widest mb-4 ${theme.colors.secondary}`}>Education</h2>
                                <div className="space-y-4">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>{edu.degree}</h3>
                                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{edu.institution}</div>
                                            <div className="text-[10px] font-bold text-gray-400 mt-1">{edu.year}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Skills */}
                        {data.skills?.length > 0 && (
                            <section>
                                <h2 className={`text-sm font-black uppercase tracking-widest mb-4 ${theme.colors.secondary}`}>Expertise</h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.map((skill, i) => (
                                        <span key={i} className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-600 border border-gray-100'}`}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ResumePreview;
