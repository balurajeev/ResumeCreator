import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const FileUploader = ({ onUploadSuccess }) => {
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            onUploadSuccess(file);
        }
    }, [onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        multiple: false
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-linkedin-blue bg-blue-50' : 'border-gray-300 hover:border-linkedin-blue'
                }`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-linkedin-blue mb-4" />
                <p className="text-lg font-semibold">Drop your existing resume here</p>
                <p className="text-gray-500 text-sm mt-2">Supports PDF (AI will extract and rewrite it)</p>
            </div>
        </div>
    );
};

export default FileUploader;
