import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ClipboardList, Users, Building2, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                // Using the analytics dashboard endpoint
                const response = await api.get('/analytics/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
    
    // Fallback if the endpoint returns different structures
    const s = stats || { total_complaints: 0, pending: 0, resolved: 0, critical: 0, total_users: 0, total_departments: 0 };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-500 mt-1">Overview of campus operations and complaint statuses.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="bg-primary-600 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-primary-100">Total Complaints</CardTitle>
                        <ClipboardList className="h-4 w-4 text-primary-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{s.total_complaints || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{s.pending || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{s.resolved || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical/High Priority</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{s.critical || s.high_priority || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{s.total_users || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Departments</CardTitle>
                        <Building2 className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{s.total_departments || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4">
                <Link to="/admin/analytics" className="text-primary-600 font-medium hover:underline">
                    View Detailed Analytics &rarr;
                </Link>
            </div>
        </div>
    );
}
