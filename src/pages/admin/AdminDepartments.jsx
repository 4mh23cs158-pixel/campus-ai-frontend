import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Plus } from 'lucide-react';

export default function AdminDepartments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        department_name: '',
        department_email: '',
        department_phone: '',
        description: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/departments/');
            setDepartments(response.data);
        } catch (error) {
            console.error("Failed to fetch departments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/departments/', formData);
            alert("Department created successfully.");
            setModalOpen(false);
            setFormData({
                department_name: '',
                department_email: '',
                department_phone: '',
                description: ''
            });
            fetchDepartments();
        } catch (error) {
            console.error("Failed to create department", error);
            alert("Failed to create department");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Departments</h1>
                    <p className="text-slate-500 mt-1">Manage campus departments.</p>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Department
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full p-8 text-center text-slate-500">Loading departments...</div>
                ) : (
                    departments.map(dept => (
                        <Card key={dept.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle>{dept.department_name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p className="text-slate-600 line-clamp-2 mb-4">{dept.description}</p>
                                <div className="pt-4 border-t border-slate-100 flex flex-col gap-1 text-slate-500">
                                    <span>{dept.department_email}</span>
                                    <span>{dept.department_phone}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Create Department Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md shadow-xl">
                        <CardHeader>
                            <CardTitle>Create Department</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Department Name</label>
                                    <Input name="department_name" value={formData.department_name} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input name="department_email" type="email" value={formData.department_email} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input name="department_phone" value={formData.department_phone} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleChange} 
                                        required
                                        className="w-full rounded-md border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                                    <Button type="submit">Create</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
