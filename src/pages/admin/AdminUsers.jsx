import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Search } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'destructive';
            case 'staff': return 'secondary';
            case 'student': return 'default';
            default: return 'outline';
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                              u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter ? u.role === roleFilter : true;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
                <p className="text-slate-500 mt-1">View and manage all registered users.</p>
            </div>

            <Card>
                <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center bg-slate-50/50 rounded-t-xl">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Search by name or email..." 
                            className="pl-9 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full md:w-auto gap-4">
                        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full md:w-40 bg-white">
                            <option value="">All Roles</option>
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
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
                                        <th className="px-6 py-4 font-medium">User</th>
                                        <th className="px-6 py-4 font-medium">Contact</th>
                                        <th className="px-6 py-4 font-medium">Role</th>
                                        <th className="px-6 py-4 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{user.name}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">ID: {user.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-900">{user.email}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{user.phone_number}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getRoleColor(user.role)} className="uppercase text-[10px] tracking-wider">
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(user.created_at).toLocaleDateString()}
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
