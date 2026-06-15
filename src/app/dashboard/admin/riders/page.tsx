"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiSearch, FiFilter, FiMoreVertical, FiUser, FiMapPin, FiX, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useGetAllRidersQuery } from '@/redux/api/riderApi';
import { useGetAllAreasQuery } from '@/redux/api/areaApi';

const RidersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [page, setPage] = useState(1);
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [selectedRiderAreas, setSelectedRiderAreas] = useState<any[]>([]);

    const { data: ridersResponse, isLoading, refetch } = useGetAllRidersQuery({
        searchTerm,
        status: statusFilter || undefined,
        area: selectedArea || undefined,
        page,
        limit: 10
    });

    const { data: areasData } = useGetAllAreasQuery({});

    const riders = (ridersResponse as any)?.data?.data || [];
    const meta = (ridersResponse as any)?.data?.meta || { total: 0, totalPage: 1 };
    const stats = (ridersResponse as any)?.data?.stats || {};

    const areas = areasData?.data || [];

    const openAreaModal = (rider: any) => {
        setSelectedRiderAreas(rider.assignedAreas || []);
        setShowAreaModal(true);
    };

    const handleFilterReset = () => {
        setSearchTerm('');
        setStatusFilter('');
        setSelectedArea('');
        setPage(1);
    };

    // Stats Cards Data
    const statCards = [
        { label: "Total Riders", value: stats.total || 0, color: "text-gray-800", bg: "bg-white", border: "border-gray-200", icon: FiUser },
        { label: "Active", value: stats.active || 0, color: "text-green-600", bg: "bg-white", border: "border-green-100", icon: FiUser },
        { label: "Online", value: stats.online || 0, color: "text-emerald-600", bg: "bg-white", border: "border-emerald-100", icon: FiMapPin },
        { label: "Offline", value: stats.offline || 0, color: "text-gray-600", bg: "bg-white", border: "border-gray-200", icon: FiUser },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">All Riders</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your delivery team in Barisal</p>
                </div>
                <Link
                    href="/dashboard/admin/riders/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#5CAF90] text-white rounded-md font-semibold hover:bg-[#4A9A7D] transition-all shadow-md"
                >
                    <FiPlus size={20} />
                    Add New Rider
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <div key={i} className={`${stat.bg} ${stat.border} border rounded-md p-5 shadow-sm`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-md bg-white shadow-sm ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className={`text-3xl font-bold ${stat.color} leading-none`}>{stat.value}</p>
                                <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-[#5CAF90] focus:bg-white transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-[#5CAF90] outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                    </select>

                    <select
                        value={selectedArea}
                        onChange={(e) => { setSelectedArea(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-[#5CAF90] outline-none"
                    >
                        <option value="">All Areas</option>
                        {areas.map((area: any) => (
                            <option key={area._id} value={area._id}>{area.name}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleFilterReset}
                        className="px-4 py-2.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-all text-gray-600 shadow-sm"
                    >
                        Reset
                    </button>

                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-all text-gray-600 shadow-sm"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rider</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Areas</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Deliveries</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={7} className="px-6 py-8"><div className="h-16 bg-gray-100 rounded w-full"></div></td>
                                </tr>
                            ))
                        ) : riders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No riders found</td>
                            </tr>
                        ) : (
                            riders.map((rider: any, index: number) => (
                                <tr key={rider._id} className="hover:bg-gray-50/50 align-top">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <FiUser size={20} className="text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{rider.fullName}</p>
                                                <p className="text-xs text-gray-500">ID: {rider._id.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium">{rider.phone}</p>
                                        <p className="text-xs text-gray-500">{rider.userID?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="capitalize">{rider.vehicleType}</p>
                                        {rider.vehicleNumber && <p className="text-xs text-gray-500 font-mono">{rider.vehicleNumber}</p>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => openAreaModal(rider)}
                                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                                        >
                                            <FiMapPin size={16} />
                                            <span className="font-medium">
                                                {rider.assignedAreaCount || rider.assignedAreas?.length || 0} Areas
                                            </span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                            ${rider.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {rider.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">{rider.totalDeliveries}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/dashboard/admin/riders/${rider._id}`} className="p-2 hover:bg-gray-100 rounded-md">
                                                <FiEdit2 size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Area Modal */}
            {showAreaModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="flex justify-between items-center p-5 border-b">
                            <h2 className="text-xl font-bold">Assigned Areas</h2>
                            <button onClick={() => setShowAreaModal(false)} className="text-gray-500 hover:text-gray-700">
                                <FiX size={24} />
                            </button>
                        </div>
                        <div className="p-5 max-h-[70vh] overflow-y-auto">
                            {selectedRiderAreas.length > 0 ? (
                                selectedRiderAreas.map((area: any) => (
                                    <div key={area._id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-3">
                                        <FiMapPin className="text-[#5CAF90]" size={20} />
                                        <span className="font-medium text-gray-800">{area.name}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-10 text-gray-500">No areas assigned to this rider</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RidersPage;