import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const ResumeForm = ({ data, setData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const addExperience = () => {
        setData({
            ...data,
            experience: [...data.experience, { company: '', role: '', duration: '', description: '' }]
        });
    };

    const removeExperience = (index) => {
        const newExp = data.experience.filter((_, i) => i !== index);
        setData({ ...data, experience: newExp });
    };

    const updateExperience = (index, field, value) => {
        const newExp = [...data.experience];
        newExp[index][field] = value;
        setData({ ...data, experience: newExp });
    };

    const addEducation = () => {
        setData({
            ...data,
            education: [...data.education, { institution: '', degree: '', year: '' }]
        });
    };

    const removeEducation = (index) => {
        const newEdu = data.education.filter((_, i) => i !== index);
        setData({ ...data, education: newEdu });
    };

    const updateEducation = (index, field, value) => {
        const newEdu = [...data.education];
        newEdu[index][field] = value;
        setData({ ...data, education: newEdu });
    };

    return (
        <div className="space-y-6">
            <div className="card p-6">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="input-field" name="name" placeholder="Full Name" value={data.name} onChange={handleChange} />
                    <input className="input-field" name="email" placeholder="Email" value={data.email} onChange={handleChange} />
                    <input className="input-field" name="phone" placeholder="Phone" value={data.phone} onChange={handleChange} />
                    <input className="input-field" name="linkedin" placeholder="LinkedIn URL" value={data.linkedin} onChange={handleChange} />
                </div>
            </div>

            <div className="card p-6">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Professional Summary</h2>
                <textarea
                    className="input-field h-32"
                    name="summary"
                    placeholder="Tell us about your professional background..."
                    value={data.summary}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="card p-6">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold">Experience</h2>
                    <button onClick={addExperience} className="text-linkedin-blue flex items-center gap-1 hover:underline">
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                {data.experience.map((exp, index) => (
                    <div key={index} className="space-y-3 mb-6 p-4 border rounded-lg relative">
                        <button onClick={() => removeExperience(index)} className="absolute top-2 right-2 text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="input-field" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} />
                            <input className="input-field" placeholder="Role" value={exp.role} onChange={(e) => updateExperience(index, 'role', e.target.value)} />
                        </div>
                        <input className="input-field" placeholder="Duration (e.g. Jan 2020 - Present)" value={exp.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} />
                        <textarea className="input-field h-24" placeholder="Description of achievements..." value={exp.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} />
                    </div>
                ))}
            </div>

            <div className="card p-6">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold">Education</h2>
                    <button onClick={addEducation} className="text-linkedin-blue flex items-center gap-1 hover:underline">
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                {data.education.map((edu, index) => (
                    <div key={index} className="space-y-3 mb-4 p-4 border rounded-lg relative">
                        <button onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="input-field" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} />
                            <input className="input-field" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
                        </div>
                        <input className="input-field" placeholder="Year" value={edu.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} />
                    </div>
                ))}
            </div>

            <div className="card p-6">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Skills</h2>
                <input
                    className="input-field"
                    placeholder="Skills (comma separated)"
                    value={data.skills.join(', ')}
                    onChange={(e) => setData({ ...data, skills: e.target.value.split(',').map(s => s.trim()) })}
                />
            </div>
        </div>
    );
};

export default ResumeForm;
