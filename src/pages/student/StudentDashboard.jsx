import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FileText, AlertCircle, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
    const { currentUser } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await api.get(`/complaints/student/${currentUser.id}`);
                setComplaints(response.data);
            } catch (error) {
                console.error("Failed to fetch complaints", error);
            } finally {
                setLoading(false);
            }
        };
        if (currentUser?.id) fetchComplaints();
    }, [currentUser]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Assigned': return 'secondary';
            case 'In Progress': return 'default';
            case 'Resolved': return 'success';
            case 'Rejected': return 'destructive';
            default: return 'outline';
        }
    };

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        assigned: complaints.filter(c => c.status === 'Assigned').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Good morning, {currentUser?.name}</h1>
                <p className="text-slate-500 mt-1">Track your campus complaints and stay updated on their resolution.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total</CardTitle>
                        <FileText className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Assigned</CardTitle>
                        <AlertCircle className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.assigned}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-primary-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inProgress}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resolved}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                    {complaints.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No complaints found. <Link to="/student/complaints/create" className="text-primary-600 underline">Create one</Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">Title</th>
                                        <th className="px-4 py-3">Category</th>
                                        <th className="px-4 py-3">Priority</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Created</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.slice(0, 5).map(c => (
                                        <tr key={c.id} className="border-b">
                                            <td className="px-4 py-3 font-medium text-slate-900">#{c.id}</td>
                                            <td className="px-4 py-3 truncate max-w-xs">{c.title}</td>
                                            <td className="px-4 py-3">{c.category}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={c.priority === 'High' || c.priority === 'Critical' ? 'destructive' : 'secondary'}>
                                                    {c.priority}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={getStatusColor(c.status)}>{c.status}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Link to={`/student/complaints/${c.id}`} className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                                                    View Details <ChevronRight className="ml-1 h-4 w-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
