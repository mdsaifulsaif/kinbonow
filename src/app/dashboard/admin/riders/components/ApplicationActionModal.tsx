"use client";
import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useGetAllAreasQuery } from '@/redux/api/areaApi';


interface ModalProps {
    type: 'approve' | 'reject' | null;
    app: any;
    onClose: () => void;
    onConfirm: (data: { assignedAreas?: string[], reason?: string }) => void;
    isLoading: boolean;
}

const ApplicationActionModal: React.FC<ModalProps> = ({ type, app, onClose, onConfirm, isLoading }) => {
    const { data: areasData } = useGetAllAreasQuery({});
    const areas = areasData?.data || [];
    
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (type === 'approve') {
            setSelectedAreas(app.preferredAreas?.map((a: any) => a._id) || []);
        }
    }, [app, type]);

    const handleConfirm = () => {
        if (type === 'approve') {
            onConfirm({ assignedAreas: selectedAreas });
        } else {
            if (!reason.trim()) return toast.error("Please provide a reason");
            onConfirm({ reason });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold capitalize">{type} Application</h2>
                    <button onClick={onClose}><FiX size={24} /></button>
                </div>
                <div className="p-6">
                    {type === 'approve' ? (
                        <div>
                            <p className="mb-4 text-sm text-gray-600">Assign areas for <b>{app.fullName}</b>:</p>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {areas.map((area: any) => (
                                    <label key={area._id} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                                        <input type="checkbox" checked={selectedAreas.includes(area._id)} onChange={() => {
                                            setSelectedAreas(prev => prev.includes(area._id) ? prev.filter(id => id !== area._id) : [...prev, area._id]);
                                        }} className="accent-[#5CAF90]" />
                                        {area.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="mb-2 text-gray-700">Reason for rejecting <b>{app.fullName}</b>:</p>
                            <textarea 
                                value={reason} 
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full h-32 p-3 border rounded-xl outline-none" 
                                placeholder="Enter reason..." 
                            />
                        </div>
                    )}
                </div>
                <div className="p-4 border-t flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 border rounded-xl font-medium">Cancel</button>
                    <button onClick={handleConfirm} disabled={isLoading} className={`flex-1 py-3 text-white rounded-xl font-bold ${type === 'approve' ? 'bg-[#5CAF90]' : 'bg-red-600'}`}>
                        {isLoading ? "Processing..." : `Confirm ${type}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationActionModal;