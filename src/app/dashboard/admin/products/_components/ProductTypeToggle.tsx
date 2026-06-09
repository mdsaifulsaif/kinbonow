"use client";

import { FiLayers } from "react-icons/fi";

interface Props {
  productType: string;
  onChange: (type: string) => void;
}

const ProductTypeToggle = ({ productType, onChange }: Props) => {
  return (
    <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FiLayers className="text-[#4F46E5]" size={20} />
        <span className="text-sm font-bold text-gray-700">Choose Product Type:</span>
      </div>
      <div className="flex bg-gray-100 p-1 rounded-md">
        <button
          type="button"
          onClick={() => onChange("single")}
          className={`px-6 py-1.5 rounded-md text-xs font-bold transition-all ${productType === "single" ? "bg-white text-gray-800 shadow" : "text-gray-400"}`}
        >
          SINGLE PRODUCT
        </button>
        <button
          type="button"
          onClick={() => onChange("combo")}
          className={`px-6 py-1.5 rounded-md text-xs font-bold transition-all ${productType === "combo" ? "bg-white text-gray-800 shadow" : "text-gray-400"}`}
        >
          COMBO BUNDLE
        </button>
      </div>
    </div>
  );
};

export default ProductTypeToggle;