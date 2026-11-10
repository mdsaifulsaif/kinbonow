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
  FiLayers,
} from "react-icons/fi";
import {
  useGetAdminPromotionalBannersQuery,
  useCreatePromotionalBannerMutation,
  useUpdatePromotionalBannerMutation,
  useDeletePromotionalBannerMutation,
  IPromotionalBanner,
} from "@/redux/api/promotionalBannerApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import toast from "react-hot-toast";

const PromotionalBannersPage = () => {
  const { data: response, isLoading, refetch } = useGetAdminPromotionalBannersQuery();
  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });
  const [createBanner, { isLoading: isCreating }] = useCreatePromotionalBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdatePromotionalBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeletePromotionalBannerMutation();

  const banners: IPromotionalBanner[] = response?.data || [];
  const categories: any[] = categoriesResponse?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IPromotionalBanner | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("");
  const [linkType, setLinkType] = useState<"category" | "custom" | "none">("category");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [order, setOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setLink("");
    setLinkType("category");
    setSelectedCategory("");
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

  const handleOpenEdit = (banner: IPromotionalBanner) => {
    setEditingBanner(banner);
    setTitle(banner.title || "");
    setSubtitle(banner.subtitle || "");
    setOrder(banner.order ?? 0);
    setIsActive(banner.isActive);
    setImageUrl(banner.image || "");
    setSelectedFile(null);
    setFilePreview(banner.image || "");

    const currentLink = banner.link || "";
    if (currentLink.startsWith("/category/") || currentLink.startsWith("/cat/")) {
      setLinkType("category");
      const slug = currentLink.replace("/category/", "").replace("/cat/", "");
      setSelectedCategory(slug);
      setLink("");
    } else if (currentLink.trim()) {
      setLinkType("custom");
      setLink(currentLink);
      setSelectedCategory("");
    } else {
      setLinkType("none");
      setLink("");
      setSelectedCategory("");
    }

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
      toast.error("Please provide a promotional banner image file or image URL");
      return;
    }

    let finalLink = "";
    if (linkType === "category") {
      if (!selectedCategory) {
        toast.error("Please select a category from the dropdown");
        return;
      }
      finalLink = `/category/${selectedCategory}`;
    } else if (linkType === "custom") {
      if (!link.trim()) {
        toast.error("Please enter a custom URL");
        return;
      }
      finalLink = link.trim();
    } else {
      finalLink = "";
    }

    try {
      const formData = new FormData();
      if (title.trim()) formData.append("title", title.trim());
      if (subtitle.trim()) formData.append("subtitle", subtitle.trim());
      formData.append("link", finalLink);
      formData.append("linkType", linkType);
      if (selectedCategory) formData.append("categorySlug", selectedCategory);
      formData.append("order", String(order));
      formData.append("isActive", String(isActive));

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (imageUrl.trim()) {
        formData.append("image", imageUrl.trim());
      }

      if (editingBanner) {
        await updateBanner({ id: editingBanner._id, data: formData }).unwrap();
        toast.success("Promotional banner updated successfully!");
      } else {
        await createBanner(formData).unwrap();
        toast.success("Promotional banner created successfully!");
      }

      setIsModalOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to save promotional banner. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this promotional banner?")) return;
    try {
      await deleteBanner(id).unwrap();
      toast.success("Promotional banner deleted successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete promotional banner");
    }
  };

  const handleToggleActive = async (banner: IPromotionalBanner) => {
    try {
      const formData = new FormData();
      formData.append("isActive", String(!banner.isActive));
      await updateBanner({ id: banner._id, data: formData }).unwrap();
      toast.success(`Banner ${!banner.isActive ? "activated" : "deactivated"}!`);
      refetch();
    } catch (err: any) {
      toast.error("Failed to update banner status");
    }
  };

  const activeCount = banners.filter((b) => b.isActive).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-2xl font-bold">
            <FiLayers />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Promotional Banners
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage promotional cards on the website (shows 3 cards per row; smoothly slides when &gt; 3 cards).
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <FiPlus size={18} />
          <span>Add Promotional Banner</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Cards
          </p>
          <p className="text-2xl font-black text-gray-900 mt-1">{banners.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Active on Website
          </p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Inactive / Draft
          </p>
          <p className="text-2xl font-black text-gray-400 mt-1">
            {banners.length - activeCount}
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between text-xs text-emerald-800">
        <div className="flex items-center gap-2">
          <span className="text-base">💡</span>
          <span>
            <strong>Display rule:</strong> Exactly 3 cards fit in a row on desktop. If you have 4 or more active cards, the website automatically turns it into a responsive carousel slider!
          </span>
        </div>
        <span className="font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
          Current Active: {activeCount} {activeCount > 3 ? "(Auto-Slider Active)" : "(Grid Mode)"}
        </span>
      </div>

      {/* Banners Grid */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400 text-sm">
            Loading promotional banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
              <FiLayers size={32} />
            </div>
            <h3 className="text-base font-bold text-gray-700">No promotional banners yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-4">
              Upload promotional banners to showcase special offers, discounts, or featured product categories on the homepage.
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition cursor-pointer"
            >
              <FiPlus size={16} />
              <span>Add Your First Card</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className={`group relative rounded-2xl border transition-all overflow-hidden flex flex-col ${
                  banner.isActive
                    ? "border-gray-200 hover:border-[var(--color-primary)]/50 hover:shadow-md"
                    : "border-gray-200 bg-gray-50/50 opacity-75"
                }`}
              >
                {/* Banner Image Preview */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.title || "Promotional Banner"}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                  />

                  {/* Order & Status Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                      #{banner.order ?? 0}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        banner.isActive
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Quick Action Overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90">
                    <button
                      onClick={() => handleOpenEdit(banner)}
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-700 hover:text-[var(--color-primary)] shadow-xs transition cursor-pointer"
                      title="Edit"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-700 hover:text-red-600 shadow-xs transition cursor-pointer"
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Banner Content Details */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm truncate">
                      {banner.title || <span className="text-gray-400 italic">No Title</span>}
                    </h3>
                    {banner.subtitle && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {banner.subtitle}
                      </p>
                    )}

                    {/* Target Link Badge */}
                    <div className="mt-2.5">
                      {banner.link ? (
                        banner.link.startsWith("/category/") || banner.link.startsWith("/cat/") ? (
                          <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1 w-fit">
                            📂 Category: {categories.find((c: any) => `/category/${c.slug}` === banner.link || `/cat/${c.slug}` === banner.link)?.name || banner.link.replace("/category/", "").replace("/cat/", "")}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold flex items-center gap-1 w-fit font-mono truncate max-w-full">
                            🔗 {banner.link}
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-[10px] font-medium">
                          🚫 Display Only (No Link)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Active Toggle Switch */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">Card Status</span>
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        banner.isActive ? "bg-[var(--color-primary)]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          banner.isActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="text-lg font-black text-gray-900">
                {editingBanner ? "Edit Promotional Banner" : "New Promotional Banner"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload Area */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Banner Card Image <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-200 hover:border-[var(--color-primary)] rounded-2xl p-4 text-center transition bg-gray-50/50">
                  {filePreview ? (
                    <div className="relative w-full aspect-square max-w-[220px] mx-auto rounded-xl overflow-hidden border border-gray-200 group">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setFilePreview("");
                          setImageUrl("");
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-lg transition cursor-pointer"
                        title="Remove image"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center py-6">
                      <FiUploadCloud size={32} className="text-gray-400 mb-2" />
                      <span className="text-xs font-bold text-gray-700">
                        Click to upload card image
                      </span>
                      <span className="text-[11px] text-gray-400 mt-0.5">
                        Square or 4:3 ratio recommended (PNG, JPG, WEBP)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Or Image URL */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (!selectedFile) setFilePreview(e.target.value);
                    }}
                    placeholder="Or paste external image URL"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] transition"
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Card Title (Heading)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Super Saver"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Subtitle / Caption
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Save Big on Monthly Shopping"
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] transition"
                  />
                </div>
              </div>

              {/* Link Target Selector */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <FiLink size={14} className="text-[var(--color-primary)]" />
                    <span>Click Target (Destination)</span>
                  </label>
                  {linkType === "category" && selectedCategory && (
                    <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Target: /category/{selectedCategory}
                    </span>
                  )}
                </div>

                {/* 3 Main Options Selector */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-gray-200 text-xs shadow-xs">
                  <button
                    type="button"
                    onClick={() => setLinkType("category")}
                    className={`py-1.5 px-2 rounded-lg font-semibold transition text-center cursor-pointer ${
                      linkType === "category"
                        ? "bg-[var(--color-primary)] text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    📂 Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkType("custom")}
                    className={`py-1.5 px-2 rounded-lg font-semibold transition text-center cursor-pointer ${
                      linkType === "custom"
                        ? "bg-[var(--color-primary)] text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    🔗 Custom Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkType("none")}
                    className={`py-1.5 px-2 rounded-lg font-semibold transition text-center cursor-pointer ${
                      linkType === "none"
                        ? "bg-gray-700 text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    🚫 No Link
                  </button>
                </div>

                {/* 1. Category Dropdown Option */}
                {linkType === "category" && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-semibold text-gray-600 block">
                      Choose Category from Dropdown:
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] transition"
                    >
                      <option value="">-- Select a Category --</option>
                      {categories.map((cat: any) => (
                        <option key={cat._id} value={cat.slug}>
                          {cat.name} ({cat.slug})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-gray-500">
                      Clicking this banner will navigate customers to{" "}
                      <span className="font-mono text-emerald-700 font-medium">
                        /category/{selectedCategory || "[category-slug]"}
                      </span>
                    </p>
                  </div>
                )}

                {/* 2. Custom Link Option */}
                {linkType === "custom" && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-semibold text-gray-600 block">
                      Custom URL:
                    </label>
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="e.g. /offers, /brands/fresh, or https://example.com"
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] transition font-mono"
                    />
                  </div>
                )}

                {/* 3. No Link Option */}
                {linkType === "none" && (
                  <p className="text-[11px] text-gray-400 italic pt-0.5">
                    This card will be display-only without an active click action.
                  </p>
                )}
              </div>

              {/* Order & Active Switch */}
              <div className="grid grid-cols-2 gap-4 items-center pt-1">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Status
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        isActive ? "bg-[var(--color-primary)]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-xs font-medium text-gray-600">
                      {isActive ? "Active (Visible)" : "Inactive (Hidden)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2 text-xs font-bold bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isCreating || isUpdating
                    ? "Saving..."
                    : editingBanner
                    ? "Update Promotional Banner"
                    : "Create Promotional Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionalBannersPage;

