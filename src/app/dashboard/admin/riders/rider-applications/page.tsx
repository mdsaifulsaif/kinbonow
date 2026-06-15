"use client";

import React, { useState } from 'react';
import { FiPlus, FiSearch, FiFilter, FiEye, FiX, FiUser, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useGetAllApplicationsQuery } from '@/redux/api/riderApi';
import { useGetAllAreasQuery } from '@/redux/api/areaApi';

const RiderApplicationsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [selectedAreas, setSelectedAreas] = useState<any[]>([]);

    const { data: applicationsResponse, isLoading, refetch } = useGetAllApplicationsQuery({
        searchTerm,
        status: statusFilter || undefined,
        page,
        limit: 10
    });

    const { data: areasData } = useGetAllAreasQuery({});

    const applications = (applicationsResponse as any)?.data?.data || [];
    const meta = (applicationsResponse as any)?.data?.meta || { total: 0, totalPage: 1 };
    const stats = (applicationsResponse as any)?.data?.stats || {};

    const areas = areasData?.data || [];

    const openAreaModal = (preferredAreas: any[]) => {
        setSelectedAreas(preferredAreas || []);
        setShowAreaModal(true);
    };

    const handleFilterReset = () => {
        setSearchTerm('');
        setStatusFilter('');
        setPage(1);
    };

    // Stats Cards
    const statCards = [
        { label: "Total Applications", value: stats.total || 0, color: "text-gray-800", icon: FiUser },
        { label: "Pending", value: stats.pending || 0, color: "text-amber-600", icon: FiUser },
        { label: "Approved", value: stats.approved || 0, color: "text-green-600", icon: FiUser },
        { label: "Rejected", value: stats.rejected || 0, color: "text-red-600", icon: FiUser },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Rider Applications</h1>
                    <p className="text-sm text-gray-500 mt-1">Review and manage rider applications</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-md bg-white shadow-sm ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
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
                        <option value="">All Applications</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
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
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preferred Areas</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={6} className="px-6 py-8"><div className="h-16 bg-gray-100 rounded w-full"></div></td>
                                </tr>
                            ))
                        ) : applications.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No applications found</td>
                            </tr>
                        ) : (
                            applications.map((app: any) => (
                                <tr key={app._id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <FiUser size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{app.fullName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium">{app.phone}</p>
                                        <p className="text-xs text-gray-500">{app.userID?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="capitalize">{app.vehicleType}</p>
                                        <p className="text-xs text-gray-500 font-mono">{app.vehicleNumber}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => openAreaModal(app.preferredAreas)}
                                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                                        >
                                            <FiMapPin size={16} />
                                            <span>{app.preferredAreas?.length || 0} Areas</span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                            ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                              app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                              'bg-amber-100 text-amber-700'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openAreaModal(app.preferredAreas)}
                                                className="p-2 hover:bg-gray-100 rounded-md text-gray-600"
                                            >
                                                <FiEye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Areas Modal */}
            {showAreaModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="flex justify-between items-center p-5 border-b">
                            <h2 className="text-xl font-bold">Preferred Areas</h2>
                            <button onClick={() => setShowAreaModal(false)} className="text-gray-500 hover:text-gray-700">
                                <FiX size={24} />
                            </button>
                        </div>
                        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
                            {selectedAreas.length > 0 ? (
                                selectedAreas.map((area: any) => (
                                    <div key={area._id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <FiMapPin className="text-[#5CAF90]" size={20} />
                                        <span className="font-medium">{area.name}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-10 text-gray-500">No preferred areas selected</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RiderApplicationsPage;





// "use client";

// import React, { useState } from 'react';
// import { FiPlus, FiSearch, FiFilter, FiEye, FiX, FiUser, FiMapPin, FiCheck, FiXCircle } from 'react-icons/fi';
// import { toast } from 'react-hot-toast';
// import { 
//     useGetAllApplicationsQuery, 
//     useApproveApplicationMutation, 
//     useRejectApplicationMutation 
// } from '@/redux/api/riderApi';
// import { useGetAllAreasQuery } from '@/redux/api/areaApi';

// const RiderApplicationsPage = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('');
//     const [page, setPage] = useState(1);

//     // Modals
//     const [showApproveModal, setShowApproveModal] = useState(false);
//     const [showRejectModal, setShowRejectModal] = useState(false);
//     const [selectedApplication, setSelectedApplication] = useState<any>(null);
//     const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
//     const [rejectReason, setRejectReason] = useState('');

//     const { data: applicationsResponse, isLoading, refetch } = useGetAllApplicationsQuery({
//         searchTerm,
//         status: statusFilter || undefined,
//         page,
//         limit: 10
//     });

//     const { data: areasData } = useGetAllAreasQuery({});
//     const [approveApplication] = useApproveApplicationMutation();
//     const [rejectApplication] = useRejectApplicationMutation();

//     const applications = (applicationsResponse as any)?.data?.data || [];
//     const meta = (applicationsResponse as any)?.data?.meta || { total: 0, totalPage: 1 };
//     const stats = (applicationsResponse as any)?.data?.stats || {};

//     const areas = areasData?.data || [];

//     // Open Approve Modal
//     const openApproveModal = (app: any) => {
//         setSelectedApplication(app);
//         setSelectedAreas(app.preferredAreas?.map((a: any) => a._id) || []);
//         setShowApproveModal(true);
//     };

//     // Open Reject Modal
//     const openRejectModal = (app: any) => {
//         setSelectedApplication(app);
//         setRejectReason('');
//         setShowRejectModal(true);
//     };

//     const handleApprove = async () => {
//         if (!selectedApplication) return;

//         try {
//             await approveApplication({
//                 id: selectedApplication._id,
//                 assignedAreas: selectedAreas
//             }).unwrap();

//             toast.success('Application Approved Successfully!');
//             setShowApproveModal(false);
//             refetch();
//         } catch (err: any) {
//             toast.error(err?.data?.message || 'Failed to approve');
//         }
//     };

//     const handleReject = async () => {
//         if (!selectedApplication || !rejectReason.trim()) {
//             return toast.error("Please provide a reason for rejection");
//         }

//         try {
//             await rejectApplication({
//                 id: selectedApplication._id,
//                 reason: rejectReason
//             }).unwrap();

//             toast.success('Application Rejected');
//             setShowRejectModal(false);
//             refetch();
//         } catch (err: any) {
//             toast.error(err?.data?.message || 'Failed to reject');
//         }
//     };

//     const handleFilterReset = () => {
//         setSearchTerm('');
//         setStatusFilter('');
//         setPage(1);
//     };

//     return (
//         <div className="space-y-6">
//             {/* Header & Stats Cards */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800">Rider Applications</h1>
//                     <p className="text-sm text-gray-500 mt-1">Review and manage new rider requests</p>
//                 </div>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                 {[
//                     { label: "Total", value: stats.total || 0, color: "text-gray-800" },
//                     { label: "Pending", value: stats.pending || 0, color: "text-amber-600" },
//                     { label: "Approved", value: stats.approved || 0, color: "text-green-600" },
//                     { label: "Rejected", value: stats.rejected || 0, color: "text-red-600" },
//                 ].map((stat, i) => (
//                     <div key={i} className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
//                         <p className="text-sm text-gray-500">{stat.label}</p>
//                         <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
//                     </div>
//                 ))}
//             </div>

//             {/* Search & Filter */}
//             <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border border-gray-200 shadow-sm">
//                 <div className="relative w-full md:w-96">
//                     <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                     <input
//                         type="text"
//                         placeholder="Search by name or phone..."
//                         className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-[#5CAF90]"
//                         value={searchTerm}
//                         onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
//                     />
//                 </div>

//                 <div className="flex gap-3">
//                     <select
//                         value={statusFilter}
//                         onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
//                         className="px-4 py-2.5 border border-gray-200 rounded-md"
//                     >
//                         <option value="">All Status</option>
//                         <option value="pending">Pending</option>
//                         <option value="approved">Approved</option>
//                         <option value="rejected">Rejected</option>
//                     </select>

//                     <button onClick={handleFilterReset} className="px-5 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50">
//                         Reset
//                     </button>
//                     <button onClick={() => refetch()} className="px-5 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50">
//                         Refresh
//                     </button>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
//                 <table className="w-full text-left">
//                     <thead className="bg-gray-50 border-b border-gray-200">
//                         <tr>
//                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
//                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
//                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
//                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preferred Areas</th>
//                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
//                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                         {isLoading ? (
//                             [...Array(5)].map((_, i) => <tr key={i} className="animate-pulse"><td colSpan={6} className="px-6 py-8"><div className="h-16 bg-gray-100 rounded"></div></td></tr>)
//                         ) : applications.length === 0 ? (
//                             <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No applications found</td></tr>
//                         ) : (
//                             applications.map((app: any) => (
//                                 <tr key={app._id} className="hover:bg-gray-50/50">
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center gap-3">
//                                             <FiUser className="text-2xl text-gray-400" />
//                                             <div>
//                                                 <p className="font-medium">{app.fullName}</p>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <p>{app.phone}</p>
//                                         <p className="text-xs text-gray-500">{app.userID?.email}</p>
//                                     </td>
//                                     <td className="px-6 py-4 capitalize">{app.vehicleType}</td>
//                                     <td className="px-6 py-4">
//                                         <button onClick={() => openAreaModal(app.preferredAreas)} className="text-blue-600 hover:underline flex items-center gap-1">
//                                             <FiMapPin /> {app.preferredAreas?.length || 0} Areas
//                                         </button>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
//                                             ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
//                                               app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
//                                             {app.status}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 text-right">
//                                         <div className="flex gap-2 justify-end">
//                                             {app.status === 'pending' && (
//                                                 <>
//                                                     <button
//                                                         onClick={() => openApproveModal(app)}
//                                                         className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
//                                                     >
//                                                         Approve
//                                                     </button>
//                                                     <button
//                                                         onClick={() => openRejectModal(app)}
//                                                         className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
//                                                     >
//                                                         Reject
//                                                     </button>
//                                                 </>
//                                             )}
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Approve Modal */}
//             {showApproveModal && selectedApplication && (
//                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-2xl w-full max-w-lg">
//                         <div className="p-6 border-b flex justify-between items-center">
//                             <h2 className="text-xl font-bold">Approve Rider</h2>
//                             <button onClick={() => setShowApproveModal(false)}><FiX size={24} /></button>
//                         </div>

//                         <div className="p-6">
//                             <p className="font-medium mb-4">Select Areas for <span className="text-[#5CAF90]">{selectedApplication.fullName}</span></p>
//                             <div className="max-h-80 overflow-y-auto space-y-2">
//                                 {areas.map((area: any) => (
//                                     <label key={area._id} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
//                                         <input
//                                             type="checkbox"
//                                             checked={selectedAreas.includes(area._id)}
//                                             onChange={() => {
//                                                 if (selectedAreas.includes(area._id)) {
//                                                     setSelectedAreas(selectedAreas.filter(id => id !== area._id));
//                                                 } else {
//                                                     setSelectedAreas([...selectedAreas, area._id]);
//                                                 }
//                                             }}
//                                             className="w-5 h-5 accent-[#5CAF90]"
//                                         />
//                                         <span>{area.name}</span>
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="p-4 border-t flex gap-3">
//                             <button onClick={() => setShowApproveModal(false)} className="flex-1 py-3 border rounded-xl">Cancel</button>
//                             <button onClick={handleApprove} className="flex-1 py-3 bg-[#5CAF90] text-white rounded-xl font-bold">
//                                 Approve Application
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Reject Modal */}
//             {showRejectModal && selectedApplication && (
//                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-2xl w-full max-w-md">
//                         <div className="p-6 border-b">
//                             <h2 className="text-xl font-bold text-red-600">Reject Application</h2>
//                             <p className="text-sm text-gray-500 mt-1">Reason for rejecting {selectedApplication.fullName}</p>
//                         </div>
//                         <div className="p-6">
//                             <textarea
//                                 value={rejectReason}
//                                 onChange={(e) => setRejectReason(e.target.value)}
//                                 placeholder="Write rejection reason..."
//                                 className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:border-red-300 outline-none"
//                             />
//                         </div>
//                         <div className="p-4 border-t flex gap-3">
//                             <button onClick={() => setShowRejectModal(false)} className="flex-1 py-3 border rounded-xl">Cancel</button>
//                             <button onClick={handleReject} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">
//                                 Confirm Reject
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RiderApplicationsPage;