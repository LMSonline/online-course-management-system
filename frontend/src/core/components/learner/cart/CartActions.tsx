import React from "react";

export const CartActions: React.FC<{
  selectedCount: number;
  onRemoveSelected: () => void;
  total: number;
}> = ({ selectedCount, onRemoveSelected, total }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
      <div>
        <span className="font-semibold text-white">Selected: {selectedCount}</span>
        <button
          className="ml-4 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          disabled={selectedCount === 0}
          onClick={onRemoveSelected}
        >
          Remove selected
        </button>
      </div>
      <div className="font-bold text-white">Total: ${total.toLocaleString()}</div>
    </div>
  );
};
