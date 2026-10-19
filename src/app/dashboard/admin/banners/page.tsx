"use client";

import React, { useState } from "react";
import {
  FiPlus,
  FiImage,
  FiLink,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiUploadCloud,
  FiEye,
  FiSliders,
} from "react-icons/fi";
import {
  useGetAdminBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  IBanner,
} from "@/redux/api/bannerApi";
import toast from "react-hot-toast";

const BannersPage = () => {
  const { data: response, isLoading, refetch } = useGetAdminBannersQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const banners: IBanner[] = response?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  const resetForm = () => {
    setTitle("");
    setLink("");
    setOrder(0);
    setIsActive(true);
    setImageUrl("");
    setSelectedFile(null);
    setFilePreview("");
    setEditingBanner(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setOrder(banners.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: IBanner) => {
    setEditingBanner(banner);
    setTitle(banner.title || "");
    setLink(banner.link || "");
    setOrder(banner.order ?? 0);
    setIsActive(banner.isActive);
    setImageUrl(banner.image || "");
    setSelectedFile(null);
    setFilePreview(banner.image || "");
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !imageUrl.trim() && !editingBanner) {
      toast.error("Please provide a banner image file or image URL");
      return;
    }

    try {
      const formData = new FormData();
      if (title.trim()) formData.append("title", title.trim());
      if (link.trim()) formData.append("link", link.trim());
      formData.append("order", String(order));
      formData.append("isActive", String(isActive));

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (imageUrl.trim()) {
        formData.append("image", imageUrl.trim());
      }

      if (editingBanner) {
        await updateBanner({ id: editingBanner._id, data: formData }).unwrap();
        toast.success("Banner updated successfully! 🎉");
      } else {
        await createBanner(formData).unwrap();
        toast.success("Banner created successfully! 🚀");
      }

      setIsModalOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to save banner");
    }
  };

  const handleToggleStatus = async (banner: IBanner) => {
    try {
      const formData = new FormData();
      formData.append("isActive", String(!banner.isActive));
      await updateBanner({ id: banner._id, data: formData }).unwrap();
      toast.success(
        `Banner marked as ${!banner.isActive ? "Active" : "Inactive"}`
      );
      refetch();
    } catch (err: any) {
      toast.error("Failed to update banner status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner(id).unwrap();
      toast.success("Banner deleted successfully");
      refetch();
    } catch (err: any) {
      toast.error("Failed to delete banner");
    }
  };

  const activeCount = banners.filter((b) => b.isActive).length;

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiImage className="text-[var(--color-primary)]" />
            Hero Banner Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage homepage slider banners. 1 banner will show static, 2+ banners will auto-slide smoothly.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <FiPlus size={16} />
          Add New Banner
        </button>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Banners
          </p>
          <p className="text-2xl font-black text-gray-900 mt-1">{banners.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Active in Frontend
          </p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Slider Behavior
          </p>
          <p className="text-sm font-bold text-gray-800 mt-2 flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                activeCount > 1
                  ? "bg-emerald-500 animate-pulse"
                  : activeCount === 1
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
            />
            {activeCount > 1
              ? `Auto-Slider Active (${activeCount} slides)`
              : activeCount === 1
              ? "Static Single Banner"
              : "Default Fallback"}
          </p>
        </div>
      </div>

      {/* ===== BANNER LIST ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FiSliders size={16} className="text-[var(--color-primary)]" />
            Configured Banners (Sorted by Order)
          </h2>
          <span className="text-xs text-gray-400">
            Recommended size: 1920x600 px (or 1400x450 px)
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-400">
            Loading banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-400">
              <FiImage size={24} />
            </div>
            <p className="text-sm font-bold text-gray-700">No Banners Configured</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Frontend is currently displaying the default graphic banner. Click "Add New Banner" to customize your store.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-xl"
            >
              <FiPlus size={14} /> Add First Banner
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
              >
                {/* Banner Thumbnail & Info */}
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-36 sm:w-48 h-20 sm:h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    <img
                      src={banner.image}
                      alt={banner.title || "Banner"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200 font-mono">
                        Order #{banner.order ?? 0}
                      </span>
                      {banner.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <FiCheckCircle size={10} /> Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200 flex items-center gap-1">
                          <FiXCircle size={10} /> Inactive
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {banner.title || "Untitled Banner"}
                    </h3>

                    {banner.link ? (
                      <p className="text-xs text-[var(--color-primary)] flex items-center gap-1 truncate font-mono">
                        <FiLink size={12} className="shrink-0" />
                        <span>{banner.link}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-400 italic">No redirect link</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleToggleStatus(banner)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      banner.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {banner.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(banner)}
                    className="p-2 text-gray-600 hover:text-[var(--color-primary)] hover:bg-gray-100 rounded-xl transition"
                    title="Edit Banner"
                  >
                    <FiEdit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                    title="Delete Banner"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== CREATE / EDIT MODAL ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingBanner ? "Edit Hero Banner" : "Add New Hero Banner"}
                </h3>
                <p className="text-xs text-gray-400">
                  Fill details and upload a wide banner image
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Banner Image Upload / Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Banner Image *
                </label>

                {filePreview ? (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                    <img
                      src={filePreview}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview("");
                        setImageUrl("");
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 hover:border-[var(--color-primary)] rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-gray-50/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FiUploadCloud
                      size={28}
                      className="mx-auto text-gray-400 mb-1"
                    />
                    <p className="text-xs font-bold text-gray-700">
                      Click or drag banner image here
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Recommended: 1920x600 px or 1400x450 px (PNG, JPG, WebP)
                    </p>
                  </div>
                )}

                {/* Or Direct Image URL */}
                <div className="pt-1">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (e.target.value.trim()) setFilePreview(e.target.value.trim());
                    }}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Title (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  Banner Title (For Admin / Accessibility)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ramadan Super Fresh Deals"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                />
              </div>

              {/* Redirect Link */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  Redirect Link (Optional)
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="e.g. /shop?category=fresh-vegetables or /offers"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] focus:bg-white transition font-mono"
                />
              </div>

              {/* Order & Active Switch in 2 columns */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">
                    Display Order (Priority)
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] focus:bg-white transition font-mono"
                  />
                  <p className="text-[10px] text-gray-400">Lower numbers appear first</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">
                    Status
                  </label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[var(--color-primary)] focus:ring-0"
                    />
                    <span className="text-xs font-semibold text-gray-800">
                      Active (Show in Hero)
                    </span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-50"
                >
                  {isCreating || isUpdating
                    ? "Saving..."
                    : editingBanner
                    ? "Update Banner"
                    : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannersPage;
