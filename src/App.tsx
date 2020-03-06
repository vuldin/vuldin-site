import React, { useEffect, useState } from "react";

export function App() {
  const initialTheme = () => window.localStorage.getItem("theme") || "dark";
  const [theme, setTheme] = useState(initialTheme);

  const { classList } = document.documentElement;

  useEffect(() => {
    if (theme !== "dark" && classList.contains("theme-dark")) {
      classList.remove("theme-dark");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("theme", theme);
  });

  function handleThemeToggle(e) {
    e.preventDefault();

    if (classList.contains("theme-dark")) {
      classList.remove("theme-dark");
      setTheme("light");
    } else {
      classList.add("theme-dark");
      setTheme("dark");
    }
  }

  return (
    <div>
      <button
        type="button"
        className="bg-primary rounded hover:bg-secondary text-primary hover:text-secondary px-6 py-3"
        onClick={handleThemeToggle}
      >
        {theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      </button>
    </div>
  );
}
