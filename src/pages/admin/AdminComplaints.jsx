import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Search, Trash2, UserPlus } from 'lucide-react';

export default function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    // Modal state
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedComplaintId, setSelectedComplaintId] = useState(null);
    const [selectedStaffId, setSelectedStaffId] = useState('');

    useEffect(() => {
        fetchComplaints();
        fetchStaff();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const response = await api.get('/complaints/');
            setComplaints(response.data);
        } catch (error) {
            console.error("Failed to fetch complaints", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaff = async () => {
        try {
            const response = await api.get('/users');
            const staff = response.data.filter(u => u.role === 'staff');
            setStaffList(staff);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this complaint? This action cannot be undone.")) {
            try {
                await api.delete(`/complaints/${id}`);
                setComplaints(complaints.filter(c => c.id !== id));
            } catch (error) {
                console.error("Failed to delete complaint", error);
                alert("Failed to delete complaint");
            }
        }
    };

    const openAssignModal = (id) => {
        setSelectedComplaintId(id);
        setAssignModalOpen(true);
    };

    const closeAssignModal = () => {
        setAssignModalOpen(false);
        setSelectedComplaintId(null);
        setSelectedStaffId('');
    };

    const submitAssign = async () => {
        if (!selectedStaffId) return;
        try {
            await api.put(`/complaints/${selectedComplaintId}/assign?staff_id=${selectedStaffId}`);
            alert("Complaint assigned successfully.");
            closeAssignModal();
            fetchComplaints();
        } catch (error) {
            console.error("Failed to assign staff", error);
            alert("Failed to assign staff");
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
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Complaints</h1>
                <p className="text-slate-500 mt-1">Manage, assign, and oversee all campus complaints.</p>
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
                            <option value="Pending">Pending</option>
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
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">ID</th>
                                        <th className="px-6 py-4 font-medium">Complaint Info</th>
                                        <th className="px-6 py-4 font-medium">Status & Priority</th>
                                        <th className="px-6 py-4 font-medium">Staff</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredComplaints.map(c => (
                                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">#{c.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{c.title}</div>
                                                <div className="text-xs text-slate-500 mt-1">{c.category} • Dept ID: {c.department_id}</div>
                                            </td>
                                            <td className="px-6 py-4 space-y-1">
                                                <div><Badge variant={getStatusColor(c.status)}>{c.status}</Badge></div>
                                                <div><Badge variant={c.priority === 'High' || c.priority === 'Critical' ? 'destructive' : 'outline'} className="text-[10px]">{c.priority}</Badge></div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {c.staff_id ? (
                                                    <span className="text-slate-900 font-medium">ID: {c.staff_id}</span>
                                                ) : (
                                                    <span className="text-slate-400 italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => openAssignModal(c.id)}>
                                                        <UserPlus className="h-4 w-4 md:mr-1" />
                                                        <span className="hidden md:inline">Assign</span>
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(c.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Assign Modal */}
            {assignModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md shadow-xl">
                        <CardHeader>
                            <CardTitle>Assign Staff</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Staff Member</label>
                                <Select value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)}>
                                    <option value="" disabled>Select a staff member</option>
                                    {staffList.map(staff => (
                                        <option key={staff.id} value={staff.id}>{staff.name} (ID: {staff.id})</option>
                                    ))}
                                </Select>
                            </div>
                        </CardContent>
                        <div className="p-6 pt-0 flex justify-end gap-2">
                            <Button variant="outline" onClick={closeAssignModal}>Cancel</Button>
                            <Button onClick={submitAssign} disabled={!selectedStaffId}>Assign</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
