"use client";
import React, { useState, useEffect } from "react";
import { FiX, FiMapPin, FiShield, FiToggleLeft } from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  useUpdateAssignedAreasMutation,
  useToggleActiveStatusMutation,
} from "@/redux/api/riderApi";
import { useGetAllAreasQuery } from "@/redux/api/areaApi";

const RiderActionModal = ({ rider, onClose, refetch }: any) => {
  const { data: areasData } = useGetAllAreasQuery({});
  const [updateAreas] = useUpdateAssignedAreasMutation();
  const [toggleStatus] = useToggleActiveStatusMutation();

  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const areas = areasData?.data || [];

  useEffect(() => {
    setSelectedAreas(rider.assignedAreas?.map((a: any) => a._id) || []);
  }, [rider]);

  const handleUpdateAreas = async () => {
    try {
      await updateAreas({
        id: rider._id,
        data: { areas: selectedAreas },
      }).unwrap();
      toast.success("Areas updated successfully");
      refetch();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update areas");
    }
  };

 const handleToggleStatus = async () => {
    try {
        const nextStatus: boolean = !rider.isActive;
        
        // এবার ID এবং isActive উভয়ই পাঠানো হচ্ছে
        await toggleStatus({ 
            id: rider._id, 
            isActive: nextStatus 
        }).unwrap();
        
        toast.success(`Rider ${nextStatus ? 'activated' : 'suspended'} successfully`);
        refetch(); // টেবিল আপডেট করার জন্য
        onClose();
    } catch (err: any) {
        console.error("Action error:", err);
        toast.error(err?.data?.message || "Failed to update status");
    }
};

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Actions for {rider.fullName}</h2>
          <button onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Status Toggle */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl flex justify-between items-center">
          <div>
            <p className="font-semibold">Account Status</p>
            <p className="text-xs text-gray-500">
              Currently: {rider.isActive ? "Active" : "Suspended"}
            </p>
          </div>
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${rider.isActive ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
          >
            {rider.isActive ? "Suspend" : "Activate"}
          </button>
        </div>

        {/* Area Selector */}
        <div className="mb-6">
          <p className="font-semibold mb-2">Assign New Areas</p>
          <div className="max-h-60 overflow-y-auto border rounded-xl p-2">
            {areas.map((area: any) => (
              <label
                key={area._id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedAreas.includes(area._id)}
                  onChange={() => {
                    setSelectedAreas((prev) =>
                      prev.includes(area._id)
                        ? prev.filter((id) => id !== area._id)
                        : [...prev, area._id],
                    );
                  }}
                />
                {area.name}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleUpdateAreas}
          className="w-full py-3 bg-[#5CAF90] text-white rounded-xl font-bold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default RiderActionModal;
