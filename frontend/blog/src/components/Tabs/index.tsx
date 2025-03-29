"use client";

import { TabsProps } from "@/types";

const Tabs: React.FC<TabsProps> = ({ selected, setSelected, tabsOptions }) => {
  return (
    <div className="flex w-72 p-1 bg-gray-200 rounded-lg shadow">
      {tabsOptions.map((option) => (
        <label key={option} className="flex-1 cursor-pointer">
          <input
            type="radio"
            name="radio"
            className="hidden"
            checked={selected === option}
            onChange={() => setSelected(option)}
          />
          <span
            className={`flex items-center justify-center py-2 w-full rounded-md text-gray-700 transition-all ${
              selected === option ? "bg-white font-semibold" : ""
            }`}
          >
            {option}
          </span>
        </label>
      ))}
    </div>
  );
};

export default Tabs;
