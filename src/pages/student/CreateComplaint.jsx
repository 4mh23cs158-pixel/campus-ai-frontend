import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Sparkles } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function CreateComplaint() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        category: '',
        department_id: '',
        priority: 'Medium'
    });
    
    const [departments, setDepartments] = useState([]);
    const [aiCategory, setAiCategory] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await api.get('/departments/');
                setDepartments(res.data);
            } catch (err) {
                console.error("Failed to fetch departments", err);
            }
        };
        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAnalyze = async () => {
        if (!formData.description) return;
        setIsAnalyzing(true);
        try {
            const res = await api.post('/ai/category', { complaint: formData.description });
            if (res.data.predicted_category) {
                setAiCategory(res.data.predicted_category);
                setFormData(prev => ({ ...prev, category: res.data.predicted_category }));
            }
        } catch (err) {
            console.error("AI Analysis failed", err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await api.post('/complaints/', {
                ...formData,
                student_id: currentUser.id
            });
            alert("Complaint submitted successfully.");
            navigate('/student/complaints');
        } catch (err) {
            setError("Failed to submit complaint.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Report an Issue</h1>
                <p className="text-slate-500 mt-1">Submit a new complaint and let our AI help categorize it.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Complaint Details</CardTitle>
                    <CardDescription>Please provide as much detail as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>}
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Water Leak in Block B" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                                placeholder="Describe the issue in detail..."
                            />
                            <div className="flex justify-end pt-1">
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={handleAnalyze}
                                    disabled={!formData.description || isAnalyzing}
                                    className="text-xs"
                                >
                                    <Sparkles className="mr-2 h-3 w-3 text-primary-500" />
                                    {isAnalyzing ? "Analyzing..." : "Analyze Complaint"}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                {aiCategory && formData.category === aiCategory && (
                                    <Badge variant="secondary" className="ml-2 text-[10px] bg-primary-50 text-primary-700">AI Suggested</Badge>
                                )}
                                <Input name="category" value={formData.category} onChange={handleChange} required placeholder="e.g. Maintenance" />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <Input name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Room 201" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Department</label>
                                <Select name="department_id" value={formData.department_id} onChange={handleChange} required>
                                    <option value="" disabled>Select Department</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.department_name}</option>
                                    ))}
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Priority</label>
                                <Select name="priority" value={formData.priority} onChange={handleChange}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </Select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Complaint"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
