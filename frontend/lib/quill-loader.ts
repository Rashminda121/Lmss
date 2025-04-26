"use client";

let quillPromise: Promise<void> | null = null;

export const loadQuill = () => {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Quill) return Promise.resolve();
  if (quillPromise) return quillPromise;

  quillPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.quilljs.com/1.3.7/quill.js";
    script.async = true;

    const link = document.createElement("link");
    link.href = "https://cdn.quilljs.com/1.3.7/quill.snow.css";
    link.rel = "stylesheet";

    script.onload = () => {
      document.head.appendChild(link);
      resolve();
    };

    script.onerror = reject;
    document.body.appendChild(script);
  });

  return quillPromise;
};
