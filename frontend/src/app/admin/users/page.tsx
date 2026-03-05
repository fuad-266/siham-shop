'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Users as UsersIcon, Mail, Shield } from 'lucide-react';
import api from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';

interface AdminUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    _count?: { orders: number };
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.get('/users', { params: { limit: 100 } });
                setUsers(data.data || data || []);
            } catch { setUsers([]); }
            setIsLoading(false);
        };
        fetch();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-display font-semibold text-gray-900">Users</h1>
                <span className="text-sm text-gray-500">{users.length} users</span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600" size={28} /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Orders</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
                                                    {u.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{u.name || 'Unnamed'}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12} /> {u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold', u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600')}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">{u._count?.orders || 0}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold', u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                                                {u.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-400">No users found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
