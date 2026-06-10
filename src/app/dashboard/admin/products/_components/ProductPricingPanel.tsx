"use client";

import { FiDollarSign, FiTrash2 } from "react-icons/fi";

interface Props {
  formData: any;
  units: any[];
  hasVariants: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onVariantChange: (index: number, field: string, value: any) => void;
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
}

const ProductPricingPanel = ({
  formData, units, hasVariants, onChange, onVariantChange, onAddVariant, onRemoveVariant
}: Props) => {
  return (
    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center text-green-600">
          <FiDollarSign size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Pricing & Inventory</h2>
          {hasVariants && (
            <p className="text-xs text-orange-500 font-medium mt-0.5">
              ⚠️ Variant যোগ করা আছে — Price ও Stock variant থেকে নেওয়া হবে।
            </p>
          )}
        </div>
      </div>

      {/* ===== Single Product (no variants) ===== */}
      {!hasVariants ? (
        <div className="space-y-4">
          {/* Unit + weightOrVolume এক সাথে */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Unit *</label>
              <select
                name="unit" required
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm outline-none focus:border-[#4F46E5]"
                value={formData.unit} onChange={onChange}
              >
                <option value="">Select Unit</option>
                {units.map((u: any) => (
                  <option key={u._id} value={u._id}>{u.name} ({u.shortName})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">
                Weight/Volume *
                {formData.unit && units.find((u: any) => u._id === formData.unit) && (
                  <span className="text-blue-500 ml-1 font-normal">
                    ({units.find((u: any) => u._id === formData.unit)?.shortName})
                  </span>
                )}
              </label>
              <input
                type="number" name="weightOrVolume" placeholder="0"
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold outline-none focus:border-[#4F46E5]"
                value={formData.weightOrVolume || ""} onChange={onChange}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Cost Price <span className="text-gray-400">(কেনা দাম)</span></label>
              <input
                type="number" name="costPrice" placeholder="0"
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold outline-none focus:border-[#4F46E5]"
                value={formData.costPrice} onChange={onChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Regular Price * <span className="text-gray-400">(মূল দাম)</span></label>
              <input
                type="number" name="regularPrice" placeholder="0"
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold outline-none focus:border-[#4F46E5]"
                value={formData.regularPrice} onChange={onChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Sale Price <span className="text-gray-400">(অফার দাম)</span></label>
              <input
                type="number" name="salePrice" placeholder="0"
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold text-red-500 outline-none focus:border-[#4F46E5]"
                value={formData.salePrice} onChange={onChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Stock * <span className="text-gray-400">(মজুদ)</span></label>
              <input
                type="number" name="stock" placeholder="0"
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold text-[#4F46E5] outline-none focus:border-[#4F46E5]"
                value={formData.stock} onChange={onChange}
              />
            </div>
          </div>

          {/* SKU + Low Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">SKU</label>
              <input
                type="text" name="sku" placeholder="Auto-generated if empty"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-mono outline-none focus:border-[#4F46E5]"
                value={formData.sku} onChange={onChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Low Stock Alert</label>
              <input
                type="number" name="lowStockAlert" placeholder="5"
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold outline-none focus:border-[#4F46E5]"
                value={formData.lowStockAlert} onChange={onChange}
              />
            </div>
          </div>
        </div>
      ) : (
        /* ===== Variant Product ===== */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">Cost Price <span className="text-gray-400">(কেনা দাম)</span></label>
            <input
              type="number" name="costPrice" placeholder="0"
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold outline-none focus:border-[#4F46E5]"
              value={formData.costPrice} onChange={onChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">SKU</label>
            <input
              type="text" name="sku" placeholder="Auto-generated if empty"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-mono outline-none focus:border-[#4F46E5]"
              value={formData.sku} onChange={onChange}
            />
          </div>
          <div className="md:col-span-2 p-3 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-xs text-blue-600 font-medium">
              ℹ️ Variant product এ Stock এবং Price গুলো নিচের Variant Table থেকে নেওয়া হবে।
            </p>
          </div>
        </div>
      )}

      {/* ===== Variants Table ===== */}
      <div className="pt-6 border-t border-gray-100 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-gray-700">Product Variants</h3>
            <p className="text-xs text-gray-400">প্রতিটি variant এ আলাদা unit, weight/volume, price ও stock দিন।</p>
          </div>
          <button
            type="button" onClick={onAddVariant}
            className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200 rounded-md hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            + Add Variant
          </button>
        </div>

        {formData.variants.map((v: any, idx: number) => {
          const variantUnit = units.find((u: any) => u._id === v.unitID);
          return (
            <div key={idx} className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#4F46E5]">Variant #{idx + 1}</p>
                <button
                  type="button" onClick={() => onRemoveVariant(idx)}
                  className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {/* Unit */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Unit *</label>
                  <select
                    className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500"
                    value={v.unitID || ""}
                    onChange={(e) => onVariantChange(idx, "unitID", e.target.value)}
                  >
                    <option value="">Select Unit</option>
                    {units.map((u: any) => (
                      <option key={u._id} value={u._id}>{u.name} ({u.shortName})</option>
                    ))}
                  </select>
                </div>

                {/* Weight/Vol */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Weight/Vol {variantUnit && <span className="text-blue-500 normal-case ml-1">({variantUnit.shortName})</span>}
                  </label>
                  <input
                    type="number" placeholder="0"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500"
                    value={v.weightOrVolume}
                    onChange={(e) => onVariantChange(idx, "weightOrVolume", e.target.value)}
                  />
                </div>

                {/* Cost Price */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cost Price</label>
                  <input
                    type="number" placeholder="0"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500"
                    value={v.costPrice}
                    onChange={(e) => onVariantChange(idx, "costPrice", e.target.value)}
                  />
                </div>

                {/* Reg Price */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reg. Price *</label>
                  <input
                    type="number" placeholder="0"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 font-bold"
                    value={v.regularPrice}
                    onChange={(e) => onVariantChange(idx, "regularPrice", e.target.value)}
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sale Price</label>
                  <input
                    type="number" placeholder="0"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 text-red-500 font-bold"
                    value={v.salePrice}
                    onChange={(e) => onVariantChange(idx, "salePrice", e.target.value)}
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Stock *</label>
                  <input
                    type="number" placeholder="0"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 font-bold text-blue-600"
                    value={v.stock}
                    onChange={(e) => onVariantChange(idx, "stock", e.target.value)}
                  />
                </div>
              </div>

              {/* SKU full width */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">SKU</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 bg-white text-xs rounded outline-none focus:border-blue-500 font-mono"
                  value={v.sku}
                  onChange={(e) => onVariantChange(idx, "sku", e.target.value)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductPricingPanel;