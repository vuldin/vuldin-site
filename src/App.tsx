import React from "react";
import Toggle from "./Toggle";
import useDarkMode from "use-dark-mode";

export function App() {
  const darkMode = useDarkMode(true);

  return (
    <div className="container mx-auto">
      <div className="pt-4">
        <span>
          Work in progress! This is just a placeholder while I mess with the
          tools I'm using to make this site. Some of these tools are:
        </span>
        <ol className="list-disc list-inside">
          <li>
            <span className="pr-2">parcel</span>
            <a href="https://parceljs.org/">https://parceljs.org/</a>
          </li>
          <li>
            <span className="pr-2">tailwind</span>
            <a href="https://tailwindcss.com/">https://tailwindcss.com/</a>
          </li>

          <li>
            <span className="pr-2">terminal</span>
            <a href="https://terminal.co/">https://terminal.co/</a>
          </li>
          <li>
            <span className="pr-2">IPFS</span>
            <a href="https://ipfs.io/">https://ipfs.io/</a>
          </li>
          <li>
            <span className="pr-2">3box</span>
            <a href="https://3box.io/">https://3box.io/</a>
          </li>
          <li>
            <span className="pr-2">orbitDB</span>
            <a href="https://github.com/orbitdb">https://github.com/orbitdb</a>
          </li>
        </ol>
      </div>
      <div className="pt-4">
        <button type="button" onClick={darkMode.disable}>
          light
        </button>
        <Toggle checked={darkMode.value} onChange={darkMode.toggle} />
        <button type="button" onClick={darkMode.enable}>
          dark
        </button>
      </div>
    </div>
  );
}
