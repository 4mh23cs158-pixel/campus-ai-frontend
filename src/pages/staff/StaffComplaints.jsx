import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function StaffComplaints() {
    const { currentUser } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await api.get(`/complaints/staff/${currentUser.id}`);
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
            case 'Assigned': return 'secondary';
            case 'In Progress': return 'default';
            case 'Resolved': return 'success';
            case 'Rejected': return 'destructive';
            default: return 'outline';
        }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                              c.id.toString().includes(search);
        const matchesStatus = statusFilter ? c.status === statusFilter : true;
        const matchesPriority = priorityFilter ? c.priority === priorityFilter : true;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assigned Complaints</h1>
                <p className="text-slate-500 mt-1">Manage and resolve issues assigned to you.</p>
            </div>

            <Card>
                <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center bg-slate-50/50 rounded-t-xl">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Search by title or ID..." 
                            className="pl-9 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full md:w-auto gap-4">
                        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full md:w-40 bg-white">
                            <option value="">All Statuses</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                        </Select>
                        <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-full md:w-40 bg-white">
                            <option value="">All Priorities</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </Select>
                    </div>
                </div>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading...</div>
                    ) : filteredComplaints.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No complaints found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">ID</th>
                                        <th className="px-6 py-4 font-medium">Complaint Details</th>
                                        <th className="px-6 py-4 font-medium">Status & Priority</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredComplaints.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">#{c.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{c.title}</div>
                                                <div className="text-xs text-slate-500 mt-1">{c.category} • {c.location}</div>
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <div><Badge variant={getStatusColor(c.status)}>{c.status}</Badge></div>
                                                <div><Badge variant={c.priority === 'High' || c.priority === 'Critical' ? 'destructive' : 'outline'} className="text-[10px]">{c.priority}</Badge></div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(c.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link to={`/staff/complaints/${c.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        Open <ChevronRight className="ml-1 h-4 w-4" />
                                                    </Button>
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
