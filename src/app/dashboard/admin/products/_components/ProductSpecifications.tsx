"use client";

import { FiList, FiTrash2 } from "react-icons/fi";

interface Props {
  specifications: any[];
  onAdd: () => void;
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const ProductSpecifications = ({ specifications, onAdd, onChange, onRemove }: Props) => {
  return (
    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FiList /> Specifications
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 rounded text-xs font-bold hover:bg-purple-600 hover:text-white transition-all shadow-sm"
        >
          + Add Row
        </button>
      </div>
      <div className="space-y-2">
        {specifications.map((spec: any, idx: number) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded border border-gray-200">
            <input
              type="text"
              placeholder="Key (e.g. Origin)"
              className="p-2 border border-gray-200 rounded text-sm bg-white outline-none focus:border-purple-500"
              value={spec.key}
              onChange={(e) => onChange(idx, "key", e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Value"
                className="flex-1 p-2 border border-gray-200 rounded text-sm bg-white outline-none focus:border-purple-500"
                value={spec.value}
                onChange={(e) => onChange(idx, "value", e.target.value)}
              />
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="text-red-500 hover:bg-red-50 p-2 rounded"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecifications;