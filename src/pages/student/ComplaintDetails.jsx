import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, MapPin, Tag, Calendar, User, AlignLeft, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ComplaintDetails() {
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const response = await api.get(`/complaints/${id}`);
                setComplaint(response.data);
            } catch (error) {
                console.error("Failed to fetch complaint details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaint();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (!complaint) return <div className="p-8 text-center text-red-500">Complaint not found.</div>;

    const timelineSteps = ['Pending', 'Assigned', 'In Progress', 'Resolved'];
    const currentStepIndex = timelineSteps.indexOf(complaint.status);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <Link to="/student/complaints" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Complaints
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Complaint #{complaint.id}</h1>
                    <Badge variant={complaint.status === 'Resolved' ? 'success' : complaint.status === 'Rejected' ? 'destructive' : 'default'} className="w-fit text-sm px-3 py-1">
                        {complaint.status}
                    </Badge>
                </div>
            </div>

            {/* Timeline */}
            <Card>
                <CardContent className="p-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="h-0.5 w-full bg-slate-200"></div>
                        </div>
                        <ul className="relative flex justify-between">
                            {timelineSteps.map((step, idx) => {
                                const isCompleted = currentStepIndex >= idx;
                                const isCurrent = currentStepIndex === idx;
                                const isRejected = complaint.status === 'Rejected';

                                return (
                                    <li key={step} className="flex flex-col items-center">
                                        <div className={cn(
                                            "relative flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white",
                                            isCompleted ? "border-primary-600 border-4" : "border-slate-300",
                                            isRejected && isCurrent ? "border-red-500" : ""
                                        )}>
                                            <div className={cn(
                                                "h-2.5 w-2.5 rounded-full",
                                                isCompleted ? "bg-primary-600" : "bg-transparent",
                                                isRejected && isCurrent ? "bg-red-500" : ""
                                            )} />
                                        </div>
                                        <span className={cn(
                                            "mt-2 text-xs font-medium",
                                            isCompleted ? "text-primary-600" : "text-slate-500",
                                            isRejected && isCurrent ? "text-red-500" : ""
                                        )}>{isRejected && isCurrent ? 'Rejected' : step}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </CardContent>
            </Card>

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

                            {complaint.remarks && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-slate-500 mb-2">Resolution Remarks</h4>
                                    <div className="bg-primary-50 border border-primary-100 p-4 rounded-lg text-primary-900 text-sm">
                                        {complaint.remarks}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-slate-500 flex items-center"><Tag className="mr-2 h-4 w-4" /> Category</span>
                                <span className="font-medium text-slate-900">{complaint.category}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-slate-500 flex items-center"><MapPin className="mr-2 h-4 w-4" /> Location</span>
                                <span className="font-medium text-slate-900 text-right">{complaint.location}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-slate-500 flex items-center"><ShieldAlert className="mr-2 h-4 w-4" /> Priority</span>
                                <Badge variant={complaint.priority === 'Critical' || complaint.priority === 'High' ? 'destructive' : 'secondary'}>
                                    {complaint.priority}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-slate-500 flex items-center"><Calendar className="mr-2 h-4 w-4" /> Created</span>
                                <span className="font-medium text-slate-900">{new Date(complaint.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-slate-500 flex items-center"><User className="mr-2 h-4 w-4" /> Assigned To</span>
                                <span className="font-medium text-slate-900">{complaint.staff_id ? `Staff ID: ${complaint.staff_id}` : 'Unassigned'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
