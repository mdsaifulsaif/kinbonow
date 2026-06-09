"use client";

import { FiBox, FiPlus, FiTrash2 } from "react-icons/fi";

interface Props {
  formData: any;
  availableProducts: any[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onComboItemChange: (index: number, field: string, value: any) => void;
  onAddComboItem: () => void;
  onRemoveComboItem: (index: number) => void;
}

const ProductComboPanel = ({
  formData,
  availableProducts,
  onChange,
  onComboItemChange,
  onAddComboItem,
  onRemoveComboItem,
}: Props) => {
  return (
    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-purple-50 flex items-center justify-center text-purple-600">
            <FiBox size={22} />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Combo Package Items</h2>
        </div>
        <button
          type="button"
          onClick={onAddComboItem}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-md text-sm font-bold hover:bg-purple-600 hover:text-white border border-purple-100 transition-all"
        >
          <FiPlus /> Bind Product
        </button>
      </div>

      {/* Combo Base Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Combo Cost Price</label>
          <input
            type="number"
            name="costPrice"
            placeholder="0"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold h-10 outline-none focus:border-purple-500"
            value={formData.costPrice}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Combo Regular Price *</label>
          <input
            type="number"
            name="regularPrice"
            placeholder="0"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold h-10 outline-none focus:border-purple-500"
            value={formData.regularPrice}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Combo Stock *</label>
          <input
            type="number"
            name="stock"
            placeholder="0"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold h-10 outline-none focus:border-purple-500"
            value={formData.stock}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Combo Items */}
      <div className="space-y-3">
        {formData.comboItems.map((item: any, idx: number) => {
          const targetProduct = availableProducts.find((p: any) => p._id === item.productID);
          const availableVariants = targetProduct?.variants || [];
          const hasVariantsInProduct = availableVariants.length > 0;

          return (
            <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-md items-end shadow-sm">
              <div className="w-full md:flex-[2] min-w-0">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Select Product</label>
                <select
                  className="w-full p-2 border border-gray-200 rounded text-sm bg-white h-10 outline-none focus:border-purple-500 font-medium"
                  value={item.productID || ""}
                  onChange={(e) => onComboItemChange(idx, "productID", e.target.value)}
                >
                  <option value="">-- Choose Product --</option>
                  {availableProducts.map((p: any) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.variants?.length > 0 ? `${p.variants.length} Variants` : `Stock: ${p.stock ?? 0}`})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:flex-[1] min-w-0">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Variant</label>
                <select
                  disabled={!item.productID || !hasVariantsInProduct}
                  className={`w-full p-2 border rounded text-sm h-10 outline-none font-medium ${
                    item.productID && hasVariantsInProduct
                      ? "border-purple-300 bg-purple-50/40 text-purple-900 focus:border-purple-500"
                      : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                  value={item.selectedVariant || ""}
                  onChange={(e) => onComboItemChange(idx, "selectedVariant", e.target.value)}
                >
                  {!item.productID ? (
                    <option value="">Select product first</option>
                  ) : !hasVariantsInProduct ? (
                    <option value="">No variants</option>
                  ) : (
                    <>
                      <option value="">-- Select Variant --</option>
                      {availableVariants.map((v: any) => (
                        <option key={v._id} value={v._id}>
                          {v.weightOrVolume} (Stock: {v.stock || 0})
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className="w-full md:w-24 shrink-0">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Quantity</label>
                <input
                  type="number"
                  placeholder="1"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  className="w-full p-2 border border-gray-200 rounded text-sm text-center font-bold h-10 outline-none focus:border-purple-500"
                  value={item.quantity}
                  onChange={(e) => onComboItemChange(idx, "quantity", e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={() => onRemoveComboItem(idx)}
                className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-md transition-all shrink-0"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductComboPanel;