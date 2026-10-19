"use client";

import { FiSettings, FiRepeat } from "react-icons/fi";

interface Props {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProductSidebarPanel = ({ formData, onChange }: Props) => {
  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <FiSettings /> Status
        </h3>
        <select
          name="status"
          className="w-full p-2.5 border border-gray-200 bg-white text-sm rounded-md outline-none focus:border-[#4F46E5]"
          value={formData.status}
          onChange={onChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Promotion */}
      <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <FiSettings /> Promotion
        </h3>
        {[
          { key: "isFeatured", label: "Featured Product", color: "bg-yellow-500" },
          { key: "isOnSale", label: "On Sale Mode", color: "bg-rose-500" },
          { key: "isNew", label: "New Arrival Badge", color: "bg-emerald-500" },
        ].map((item) => (
          <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50/50 rounded border border-gray-100 cursor-pointer">
            <span className="text-xs font-bold text-gray-600">{item.label}</span>
            <div className="relative">
              <input
                type="checkbox"
                name={item.key}
                className="sr-only"
                checked={formData[item.key]}
                onChange={onChange}
              />
              <div className={`w-10 h-5 rounded-full transition-colors ${formData[item.key] ? item.color : "bg-gray-200"}`}></div>
              <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-all ${formData[item.key] ? "translate-x-5" : ""}`}></div>
            </div>
          </label>
        ))}
      </div>

      {/* Subscription Settings */}
      <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FiRepeat className="text-emerald-600" /> Recurring Subscription
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
            Auto Delivery
          </span>
        </div>

        <label className="flex items-center justify-between p-3 bg-emerald-50/40 rounded border border-emerald-100 cursor-pointer">
          <div>
            <span className="text-xs font-bold text-gray-700 block">Subscription Available</span>
            <span className="text-[11px] text-gray-400">Allow customers to subscribe</span>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              name="isSubscriptionAvailable"
              className="sr-only"
              checked={!!formData.isSubscriptionAvailable}
              onChange={onChange}
            />
            <div className={`w-10 h-5 rounded-full transition-colors ${formData.isSubscriptionAvailable ? "bg-emerald-600" : "bg-gray-200"}`}></div>
            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-all ${formData.isSubscriptionAvailable ? "translate-x-5" : ""}`}></div>
          </div>
        </label>

        {formData.isSubscriptionAvailable && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Frequency Option
              </label>
              <select
                name="subscriptionFrequency"
                value={formData.subscriptionFrequency || "monthly"}
                onChange={onChange}
                className="w-full p-2 border border-gray-200 bg-white text-xs rounded-md outline-none focus:border-emerald-500"
              >
                <option value="monthly">Monthly Only (মাসিক)</option>
                <option value="weekly">Weekly Only (সাপ্তাহিক)</option>
                <option value="both">Both (Weekly & Monthly)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Subscriber Discount % (ছাড়)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="subscriptionDiscountPercent"
                  min="0"
                  max="100"
                  placeholder="e.g. 5"
                  value={formData.subscriptionDiscountPercent ?? 0}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-xs outline-none focus:border-emerald-500"
                />
                <span className="absolute right-3 top-2 text-xs text-gray-400 font-bold">%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEO */}
      <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800">SEO</h3>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            placeholder="SEO Title"
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none focus:border-[#4F46E5]"
            value={formData.metaTitle}
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400">Meta Description</label>
          <textarea
            name="metaDescription"
            rows={3}
            placeholder="SEO Description"
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none focus:border-[#4F46E5]"
            value={formData.metaDescription}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductSidebarPanel;