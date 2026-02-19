import React, { useState } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import FileUploader from './components/FileUploader';
import { uploadResume, rewriteResume, exportPDF, exportDOCX } from './api';
import { Sparkles, Loader2, FileText, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { themes } from './themes';

function App() {
    const [resumeData, setResumeData] = useState({
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        summary: '',
        experience: [],
        education: [],
        skills: []
    });
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('manual'); // 'manual' or 'upload'
    const [selectedTheme, setSelectedTheme] = useState(themes[0]);

    const handleUpload = async (file) => {
        setLoading(true);
        try {
            const { text } = await uploadResume(file);
            const aiData = await rewriteResume(text);
            setResumeData(aiData);
            setMode('manual'); // Switch to manual after upload to allow editing
        } catch (error) {
            alert('Failed to process resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAIRewrite = async () => {
        setLoading(true);
        try {
            const textToRewrite = JSON.stringify(resumeData);
            const aiData = await rewriteResume(textToRewrite);
            setResumeData(aiData);
        } catch (error) {
            alert('AI Rewrite failed. Check your API key or connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linkedin-light">
            <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight">AI Resume Pro</span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setMode('manual')}
                            className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${mode === 'manual' ? 'bg-linkedin-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Build Manually
                        </button>
                        <button
                            onClick={() => setMode('upload')}
                            className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${mode === 'upload' ? 'bg-linkedin-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Upload Resume
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Theme Selector */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Layout className="w-4 h-4" /> Pick a Layout Style
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => setSelectedTheme(theme)}
                                className={`flex-shrink-0 w-32 group transition-all ${selectedTheme.id === theme.id ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                            >
                                <div className={`h-20 rounded-lg mb-2 border-2 transition-all ${selectedTheme.id === theme.id ? 'border-linkedin-blue shadow-lg' : 'border-transparent shadow-sm'} overflow-hidden`}>
                                    <div className={`h-4 ${theme.colors.primary}`}></div>
                                    <div className="p-2 space-y-1 bg-white h-full">
                                        <div className="h-1 bg-gray-100 w-full rounded"></div>
                                        <div className="h-1 bg-gray-100 w-3/4 rounded"></div>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold block text-center truncate ${selectedTheme.id === theme.id ? 'text-linkedin-blue' : 'text-gray-600'}`}>
                                    {theme.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Input */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                        <AnimatePresence mode="wait">
                            {mode === 'upload' ? (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="card p-6">
                                        <h2 className="text-xl font-bold mb-4">Smart Resume Import</h2>
                                        <p className="text-gray-600 mb-6">Upload your existing resume and let our AI optimize it professionally.</p>
                                        <FileUploader onUploadSuccess={handleUpload} />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="manual"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <div className="flex items-center gap-2 text-linkedin-blue">
                                            <Sparkles className="w-5 h-5 font-bold" />
                                            <span className="font-bold">Resume AI Assistant</span>
                                        </div>
                                        <button
                                            onClick={handleAIRewrite}
                                            disabled={loading}
                                            className="btn-primary py-1.5 flex items-center gap-2 text-sm"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                            Rewrite with AI
                                        </button>
                                    </div>
                                    <ResumeForm data={resumeData} setData={setResumeData} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Preview */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        <ResumePreview
                            data={resumeData}
                            onExportPDF={() => exportPDF({ ...resumeData, theme: selectedTheme })}
                            onExportDOCX={() => exportDOCX({ ...resumeData, theme: selectedTheme })}
                            theme={selectedTheme}
                        />
                    </div>
                </div>
            </main>

            {loading && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-linkedin-blue animate-spin" />
                        <p className="font-bold text-gray-700">AI is working its magic...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
