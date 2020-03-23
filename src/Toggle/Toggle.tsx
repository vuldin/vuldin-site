import React from "react";
import "./toggle.css";

export const Toggle = ({ checked, onChange, widthClass = "w-10" }) => (
  <div
    className={`${widthClass} vuldin-toggle-container relative align-top items-center h-6 mx-1 my-0`}
  >
    <input
      className="vuldin-toggle-input appearance-none w-full h-2 rounded cursor-pointer"
      id="vuldin-toggle-input"
      type="checkbox"
      checked={checked}
      onChange={onChange}
    />
    <label
      htmlFor="vuldin-toggle-input"
      className="vuldin-toggle-label grid absolute w-5 h-5 rounded-full cursor-pointer"
    />
  </div>
);
