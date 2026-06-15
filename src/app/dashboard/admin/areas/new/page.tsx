"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSave, FiInfo, FiMapPin, FiX } from "react-icons/fi";

import { toast } from "react-hot-toast";
import {
  useCreateAreaMutation,
  useUpdateAreaMutation,
  useGetSingleAreaQuery,
} from "@/redux/api/areaApi";

const AreaFormInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const areaId = searchParams.get("id");
  const isEditing = !!areaId;

  const [createArea, { isLoading: isCreating }] = useCreateAreaMutation();
  const [updateArea, { isLoading: isUpdating }] = useUpdateAreaMutation();
  const { data: areaToEdit, isLoading: isFetching } = useGetSingleAreaQuery(
    areaId,
    { skip: !isEditing },
  );

  const [formData, setFormData] = useState({
    name: "",
    city: "Barisal",
    description: "",
    isActive: true,
    coordinates: [{ lat: 22.701, lng: 90.3535 }] as Array<{
      lat: number;
      lng: number;
    }>,
  });

  useEffect(() => {
    if (isEditing && areaToEdit?.data) {
      const area = areaToEdit.data;
      setFormData({
        name: area.name || "",
        city: area.city || "Barisal",
        description: area.description || "",
        isActive: area.isActive ?? true,
        coordinates: area.coordinates || [{ lat: 22.701, lng: 90.3535 }],
      });
    }
  }, [isEditing, areaToEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Area name is required");
      return;
    }

    try {
      if (isEditing) {
        await updateArea({ id: areaId, data: formData }).unwrap();
        toast.success("Area updated successfully");
      } else {
        await createArea(formData).unwrap();
        toast.success("Area created successfully");
      }
      router.push("/dashboard/admin/areas");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  if (isEditing && isFetching) {
    return <div className="p-20 text-center">Loading area data...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Delivery Area" : "Create New Delivery Area"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEditing
              ? `Update area: ${formData.name}`
              : "Add new delivery zone for Barisal"}
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isCreating || isUpdating}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#5CAF90] text-white rounded-md font-bold hover:bg-[#4A9A7D] transition-all shadow-md disabled:opacity-50"
        >
          <FiSave size={20} />
          {isCreating || isUpdating
            ? "Saving..."
            : isEditing
              ? "Update Area"
              : "Save Area"}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
            <FiMapPin className="text-[#5CAF90]" size={20} />
            <h2 className="font-bold text-gray-800">Area Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Area Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Rupatoli, Nathullabad"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#5CAF90] transition-all text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                placeholder="Barisal"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#5CAF90] transition-all text-sm"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Write a short description about this area..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#5CAF90] transition-all text-sm resize-y"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Status Toggle */}
          {/* Fixed Status Toggle */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">
              Status
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="isActive"
                  className="sr-only"
                  checked={formData.isActive}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }));
                  }}
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${formData.isActive ? "bg-[#5CAF90]" : "bg-gray-200"}`}
                ></div>
                <div
                  className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-md transition-all ${formData.isActive ? "translate-x-5" : ""}`}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700 select-none">
                {formData.isActive ? "Active" : "Inactive"}
              </span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

const AreaForm = () => {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center text-[#5CAF90]">
          Initializing area form...
        </div>
      }
    >
      <AreaFormInner />
    </Suspense>
  );
};

export default AreaForm;
