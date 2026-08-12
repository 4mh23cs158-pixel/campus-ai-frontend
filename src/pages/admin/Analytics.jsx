import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { 
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line
} from 'recharts';
import { ClipboardList, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export default function Analytics() {
    const [dashboard, setDashboard] = useState({});
    const [statusData, setStatusData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [priorityData, setPriorityData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllAnalytics = async () => {
            try {
                const [dashRes, statRes, catRes, deptRes, prioRes, monthRes] = await Promise.all([
                    api.get('/analytics/dashboard'),
                    api.get('/analytics/status'),
                    api.get('/analytics/category'),
                    api.get('/analytics/department'),
                    api.get('/analytics/priority'),
                    api.get('/analytics/monthly')
                ]);

                setDashboard(dashRes.data);
                
                // Format data for Recharts
                const mapDict = (dict) => Object.entries(dict).map(([name, value]) => ({ name, value }));
                
                // Helper to map array of objects with dynamic keys to {name, value}
                const mapArray = (arr, nameKey) => arr.map(item => ({ name: item[nameKey], value: item.count }));

                // Recharts expects array of objects with 'name' and 'value'
                setStatusData(Array.isArray(statRes.data) ? mapArray(statRes.data, 'status') : mapDict(statRes.data));
                setCategoryData(Array.isArray(catRes.data) && catRes.data.length > 0 && 'category' in catRes.data[0] ? mapArray(catRes.data, 'category') : mapDict(catRes.data));
                setDepartmentData(Array.isArray(deptRes.data) && deptRes.data.length > 0 && 'department' in deptRes.data[0] ? mapArray(deptRes.data, 'department') : mapDict(deptRes.data));
                setPriorityData(Array.isArray(prioRes.data) && prioRes.data.length > 0 && 'priority' in prioRes.data[0] ? mapArray(prioRes.data, 'priority') : mapDict(prioRes.data));
                setMonthlyData(Array.isArray(monthRes.data) && monthRes.data.length > 0 && 'month' in monthRes.data[0] ? mapArray(monthRes.data, 'month') : mapDict(monthRes.data));
                
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllAnalytics();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Complaint Analytics</h1>
                <p className="text-slate-500 mt-1">Understand complaint trends, categories, priorities and department performance.</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                        <ClipboardList className="h-4 w-4 text-primary-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{dashboard.total_complaints || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{dashboard.pending || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{dashboard.resolved || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{dashboard.critical || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">No status data available.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Priority Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Priority Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        {priorityData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={priorityData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        dataKey="value"
                                    >
                                        {priorityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">No priority data available.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Category Bar Chart */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Complaints by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">No category data available.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Department Comparison */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Department Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        {departmentData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={departmentData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} />
                                    <RechartsTooltip />
                                    <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">No department data available.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Trend */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Monthly Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        {monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">No monthly trend data available.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
