import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:50004/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await apiClient.post('/resume/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const rewriteResume = async (text) => {
    const response = await apiClient.post('/resume/rewrite', { text });
    return response.data;
};

export const exportPDF = async (data) => {
    const response = await apiClient.post('/resume/export-pdf', data, {
        responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'resume.pdf');
    document.body.appendChild(link);
    link.click();
};

export const exportDOCX = async (data) => {
    const response = await apiClient.post('/resume/export-docx', data, {
        responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'resume.docx');
    document.body.appendChild(link);
    link.click();
};
