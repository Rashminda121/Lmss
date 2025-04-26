// "use client";

// import dynamic from "next/dynamic";
// import { useMemo } from "react";
// import "react-quill/dist/quill.bubble.css";

// interface PreviewProps {
//   value: string;
// }

// export const Preview = ({ value }: PreviewProps) => {
//   const ReactQuill = useMemo(
//     () => dynamic(() => import("react-quill"), { ssr: false }),
//     []
//   );
//   return <ReactQuill theme="bubble" value={value} readOnly />;
// };

"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Quill: any;
  }
}

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.Quill) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.quilljs.com/1.3.7/quill.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    const link = document.createElement("link");
    link.href = "https://cdn.quilljs.com/1.3.7/quill.bubble.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      if (!window.Quill) {
        document.body.removeChild(script);
        document.head.removeChild(link);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !previewRef.current) return;
    
    // Just set the HTML directly for preview (no need for Quill instance)
    previewRef.current.innerHTML = value || "";
  }, [isLoaded, value]);

  return <div ref={previewRef} className="ql-editor" style={{ padding: 0 }} />;
};