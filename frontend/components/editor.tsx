// "use client";

// import dynamic from "next/dynamic";
// import { useMemo } from "react";
// import "react-quill/dist/quill.snow.css";

// interface EditorProps {
//   onChange: (value: string) => void;
//   value: string;
// }

// export const Editor = ({ onChange, value }: EditorProps) => {
//   const ReactQuill = useMemo(
//     () => dynamic(() => import("react-quill"), { ssr: false }),
//     []
//   );

//   return (
//     <div className="bg-white">
//       {ReactQuill && (
//         <ReactQuill theme="snow" value={value} onChange={onChange} />
//       )}
//     </div>
//   );
// };

"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Quill: any;
  }
}

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
  const quillInstance = useRef<any>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const isMounted = useRef(false);

  // Load Quill resources once
  useEffect(() => {
    if (window.Quill) {
      setIsReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.quilljs.com/1.3.7/quill.js";
    script.async = true;

    const snowCss = document.createElement("link");
    snowCss.href = "https://cdn.quilljs.com/1.3.7/quill.snow.css";
    snowCss.rel = "stylesheet";

    // Load the Quill icon font
    const iconFontCss = document.createElement("link");
    iconFontCss.href = "https://cdn.quilljs.com/1.3.7/quill.core.css";
    iconFontCss.rel = "stylesheet";

    script.onload = () => {
      document.head.appendChild(snowCss);
      document.head.appendChild(iconFontCss);
      setIsReady(true);
    };

    document.body.appendChild(script);

    return () => {
      if (!window.Quill) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize editor and handle value changes
  useEffect(() => {
    if (!isReady || !editorRef.current) return;

    if (!quillInstance.current) {
      quillInstance.current = new window.Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      // Add custom CSS for the toolbar
      const style = document.createElement('style');
      style.textContent = `
        .ql-toolbar.ql-snow {
          border: none;
          padding: 8px;
          display: flex;
          align-items: center;
          background: #f8fafc;
          border-radius: 4px 4px 0 0;
        }
        .ql-toolbar.ql-snow .ql-formats {
          margin-right: 8px;
          display: flex;
          align-items: center;
        }
        .ql-toolbar.ql-snow .ql-picker-label {
          padding: 4px 8px;
        }
        .ql-toolbar.ql-snow .ql-picker-options {
          padding: 4px 8px;
        }
        .ql-toolbar.ql-snow button {
          width: 28px;
          height: 28px;
          padding: 3px 5px;
        }
        .ql-toolbar.ql-snow .ql-stroke {
          stroke: #64748b;
        }
        .ql-toolbar.ql-snow .ql-fill {
          fill: #64748b;
        }
        .ql-toolbar.ql-snow .ql-picker {
          color: #64748b;
        }
        .ql-toolbar.ql-snow .ql-active .ql-stroke {
          stroke: #1e293b;
        }
        .ql-toolbar.ql-snow .ql-active .ql-fill {
          fill: #1e293b;
        }
      `;
      document.head.appendChild(style);

      quillInstance.current.on("text-change", () => {
        if (isMounted.current) {
          const html = quillInstance.current.root.innerHTML;
          onChange(html);
        }
      });
    }

    // Only update content if it's different from current
    if (quillInstance.current.root.innerHTML !== value) {
      quillInstance.current.root.innerHTML = value || "";
    }

    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, [isReady, value, onChange]);

  if (!isReady) {
    return (
      <div className="bg-white h-[300px] flex items-center justify-center">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
      <div ref={editorRef} className="h-[300px]" />
    </div>
  );
};