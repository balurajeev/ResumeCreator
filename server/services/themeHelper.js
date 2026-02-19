const colorMap = {
    'bg-linkedin-blue': '#0a66c2',
    'text-linkedin-blue': '#0a66c2',
    'border-linkedin-blue': '#0a66c2',
    'bg-gradient-to-r from-purple-600 to-blue-500': '#9333ea', // Simplified to first color
    'text-purple-600': '#9333ea',
    'border-purple-600': '#9333ea',
    'bg-gray-800': '#1f2937',
    'text-gray-800': '#1f2937',
    'border-gray-800': '#1f2937',
    'bg-emerald-600': '#059669',
    'text-emerald-500': '#10b981',
    'border-emerald-600': '#059669',
    'bg-navy-900': '#000080',
    'text-navy-900': '#000080',
    'border-navy-900': '#000080',
    'bg-coral-500': '#ff7f50',
    'text-coral-500': '#ff7f50',
    'border-coral-500': '#ff7f50',
    'bg-cyan-600': '#0891b2',
    'text-cyan-600': '#0891b2',
    'border-cyan-600': '#0891b2',
    'bg-amber-600': '#d97706',
    'text-amber-600': '#d97706',
    'border-amber-600': '#d97706',
    'bg-teal-600': '#0d9488',
    'text-teal-600': '#0d9488',
    'border-teal-600': '#0d9488',
    'bg-rose-600': '#e11d48',
    'text-rose-600': '#e11d48',
    'border-rose-600': '#e11d48',
    'bg-indigo-700': '#4338ca',
    'text-indigo-700': '#4338ca',
    'border-indigo-700': '#4338ca',
};

const getHex = (tailwindClass) => colorMap[tailwindClass] || '#000000';

module.exports = { getHex };
