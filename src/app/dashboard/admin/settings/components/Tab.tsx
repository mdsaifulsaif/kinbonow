import React from 'react';
import { IconType } from 'react-icons';

interface TabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: IconType;
}

export const Tab: React.FC<TabProps> = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
      active ? 'text-[#5CAF90] border-[#5CAF90]' : 'text-gray-500 border-transparent hover:text-gray-700'
    }`}
  >
    <Icon size={18} />
    {children}
  </button>
);