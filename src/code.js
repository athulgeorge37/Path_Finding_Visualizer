import React, { useEffect } from "react";
import Prism from "prismjs";
import "./code.css"

export default function Code({ code, language }) {

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="Code">
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}