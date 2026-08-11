import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, MapPin, Tag, Calendar, User, AlignLeft, ShieldAlert } from 'lucide-react';

export default function StaffComplaintDetails() {
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        fetchComplaint();
        // eslint-disable-next-line
    }, [id]);

    const fetchComplaint = async () => {
        try {
            const response = await api.get(`/complaints/${id}`);
            setComplaint(response.data);
            setStatus(response.data.status);
            setRemarks(response.data.remarks || '');
        } catch (error) {
            console.error("Failed to fetch complaint details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        setIsUpdating(true);
        try {
            await api.put(`/complaints/${id}/status?status=${encodeURIComponent(status)}`);
            setToast("Complaint status updated successfully.");
            setTimeout(() => setToast(''), 3000);
            fetchComplaint();
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSaveRemarks = async () => {
        setIsUpdating(true);
        try {
            await api.put(`/complaints/${id}/remarks?remarks=${encodeURIComponent(remarks)}`);
            setToast("Remarks updated successfully.");
            setTimeout(() => setToast(''), 3000);
            fetchComplaint();
        } catch (error) {
            console.error("Failed to update remarks", error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (!complaint) return <div className="p-8 text-center text-red-500">Complaint not found.</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto relative">
            {toast && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
                    {toast}
                </div>
            )}
            
            <div>
                <Link to="/staff/complaints" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assigned Complaints
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Complaint #{complaint.id}</h1>
                    <Badge variant={complaint.status === 'Resolved' ? 'success' : complaint.status === 'Rejected' ? 'destructive' : 'default'} className="w-fit text-sm px-3 py-1">
                        {complaint.status}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{complaint.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 flex items-center mb-2">
                                    <AlignLeft className="mr-2 h-4 w-4" /> Description
                                </h4>
                                <p className="text-slate-900 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap text-sm leading-relaxed">
                                    {complaint.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Resolution Remarks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <textarea 
                                className="w-full min-h-[100px] p-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                placeholder="Add resolution remarks..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </CardContent>
                        <CardFooter className="justify-end bg-slate-50 border-t py-3 px-6">
                            <Button onClick={handleSaveRemarks} disabled={isUpdating}>Save Remarks</Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-base">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Update Status</label>
                                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="Assigned">Assigned</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Rejected">Rejected</option>
                                </Select>
                            </div>
                            <Button className="w-full" onClick={handleUpdateStatus} disabled={isUpdating || status === complaint.status}>
                                Update Status
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-base">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4 text-sm">
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-slate-500 flex items-center"><Tag className="mr-2 h-4 w-4" /> Category</span>
                                <span className="font-medium text-slate-900">{complaint.category}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-slate-500 flex items-center"><MapPin className="mr-2 h-4 w-4" /> Location</span>
                                <span className="font-medium text-slate-900 text-right">{complaint.location}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-slate-500 flex items-center"><ShieldAlert className="mr-2 h-4 w-4" /> Priority</span>
                                <Badge variant={complaint.priority === 'Critical' || complaint.priority === 'High' ? 'destructive' : 'secondary'}>
                                    {complaint.priority}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-slate-500 flex items-center"><Calendar className="mr-2 h-4 w-4" /> Created</span>
                                <span className="font-medium text-slate-900">{new Date(complaint.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 flex items-center"><User className="mr-2 h-4 w-4" /> Student ID</span>
                                <span className="font-medium text-slate-900">{complaint.student_id}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
