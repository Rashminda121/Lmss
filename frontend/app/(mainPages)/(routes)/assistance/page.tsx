"use client";
import { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiUser,
  FiMenu,
  FiX,
  FiChevronRight,
  FiTrash2,
  FiCopy,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import ClearChatDialog from "./components/ClearChatDialog";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface StreamData {
  choices: Array<{
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason: string | null;
  }>;
}

type AssistantRole =
  | "general"
  | "education"
  | "mental-support"
  | "coding"
  | "creative"
  | "career";

const ROLE_PROMPTS: Record<AssistantRole, string> = {
  general:
    "You are a helpful AI assistant. Provide clear and concise answers to the user's questions. " +
    "Give direct answers under 100 words. No fluff. Just key information.",

  education:
    "You are an educational assistant. Explain concepts clearly with examples, and encourage learning. " +
    "Break down complex topics into simpler parts. Teach students directly in 3 sentences max. Focus on core ideas.",

  "mental-support":
    "You are a compassionate mental health supporter. Provide empathetic responses, active listening, and gentle guidance. " +
    "Never give medical advice. Keep responses to 1-2 supportive sentences.",

  coding:
    "You are a senior software engineer. Provide clean, efficient code solutions with explanations. " +
    "Consider best practices and performance. Default to code-only answers unless explanations are requested.",

  creative:
    "You are a creative writer. Help with storytelling, brainstorming, and artistic ideas. " +
    "Be imaginative and expressive. Respond in 1-2 lines to spark ideas quickly.",

  career:
    "You are a career coach. Offer clear, practical advice on resumes, interviews, and professional growth. " +
    "Focus on actionable tips and confident communication. Be concise unless detailed guidance is requested.",
};

const ROLE_ICONS: Record<AssistantRole, JSX.Element> = {
  general: <RiRobot2Line className="text-lg" />,
  education: <span className="text-lg">📚</span>,
  "mental-support": <span className="text-lg">💬</span>,
  coding: <span className="text-lg">💻</span>,
  creative: <span className="text-lg">🎨</span>,
  career: <span className="text-lg">💼</span>,
};

const UserAssistance = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AssistantRole>("general");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Auto-close sidebar on mobile when a role is selected
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [selectedRole, isMobile]);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark/light mode classes to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages, showDialog]);

  const handleClearChat = () => {
    setMessages([]);
    setShowDialog(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("./api/deepseek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.details ||
            `Request failed with status ${response.status}`
        );
      }

      let assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "",
      };

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          if (event.startsWith("data:")) {
            const dataStr = event.replace(/^data: /, "").trim();
            if (dataStr === "[DONE]") continue;

            try {
              const data: StreamData = JSON.parse(dataStr);
              if (data.choices && data.choices[0].delta?.content) {
                assistantMessage.content += data.choices[0].delta.content;

                setMessages((prev) => {
                  const existing = prev.find(
                    (m) => m.id === assistantMessage.id
                  );
                  return existing
                    ? prev.map((m) =>
                        m.id === assistantMessage.id
                          ? { ...m, content: assistantMessage.content }
                          : m
                      )
                    : [...prev, { ...assistantMessage }];
                });
              }
            } catch (err) {
              console.error("Error parsing event:", err);
            }
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get response from the assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatRoleName = (role: string) => {
    return role
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };

  const copyChat = () => {
    const chatText = messages
      .map((m) => `${m.role === "user" ? "You" : "Assistant"}: ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(chatText);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const copyMessage = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      navigator.clipboard.writeText(message.content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  return (
    <div
      className={`min-h-screen pt-5 transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800"
          : "bg-gradient-to-b from-gray-100 to-gray-200"
      }`}
    >
      <div className="container mx-auto px-4 py-4 md:py-8">
        <header className="text-center mb-4 md:mb-6">
          <h1
            className={`text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
              darkMode
                ? "from-blue-400 to-blue-600"
                : "from-blue-600 to-blue-800"
            }`}
          >
            User Assistance
          </h1>
          <p
            className={`${
              darkMode ? "text-gray-400" : "text-gray-600"
            } mt-1 md:mt-2 text-sm md:text-base`}
          >
            Seek wisdom from The Last Codebender
          </p>
        </header>

        {/* Menu Bar with Controls */}
        <div className="flex justify-between items-center mb-2 md:mb-4">
          <div className="flex gap-1 md:gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`flex items-center gap-1 md:gap-2 ${
                darkMode
                  ? "bg-gray-800 text-gray-50 hover:bg-gray-700 border border-gray-700"
                  : "bg-white hover:bg-gray-100 text-gray-900 border-gray-300 shadow-md"
              } px-2 py-1 md:px-4 md:py-2 rounded-lg transition-colors text-xs md:text-base`}
            >
              {isSidebarOpen ? (
                <>
                  <FiX size={16} />
                  <span className="hidden sm:inline">Hide Roles</span>
                </>
              ) : (
                <>
                  <FiMenu size={16} />
                  <span className="hidden sm:inline">Show Roles</span>
                </>
              )}
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-1 md:p-2 rounded-lg ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  : "bg-white hover:bg-gray-100 border border-gray-300 shadow-md"
              }`}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <FiSun className="text-yellow-300 text-sm md:text-base" />
              ) : (
                <FiMoon className="text-gray-700 text-sm md:text-base" />
              )}
            </button>
          </div>
          <div className="flex gap-1 md:gap-2">
            <button
              onClick={copyChat}
              disabled={messages.length === 0}
              className={`flex items-center gap-1 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-50 border border-gray-700"
                  : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 shadow-md"
              } px-2 py-1 md:px-3 md:py-2 rounded-lg text-xs md:text-sm transition-colors disabled:opacity-50`}
              title="Copy chat"
            >
              <FiCopy size={14} />
              <span className="hidden sm:inline">
                {showCopied ? "Copied!" : "Copy"}
              </span>
            </button>
            <button
              onClick={() => setShowDialog(true)}
              disabled={messages.length === 0}
              className={`flex items-center gap-1 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 shadow-md"
              } px-2 py-1 md:px-3 md:py-2 rounded-lg text-xs md:text-sm transition-colors disabled:opacity-50`}
              title="Clear chat"
            >
              <FiTrash2 size={14} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        <div
          className={`flex h-[calc(100vh-220px)] md:h-[60vh] ${
            darkMode ? "bg-black" : "bg-white"
          } rounded-xl shadow-xl overflow-hidden border ${
            darkMode ? "border-gray-800" : "border-gray-200"
          } relative`}
        >
          {/* Sidebar with role selection */}
          {isSidebarOpen && (
            <div
              className={`w-64 ${
                darkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-gray-50 border-gray-200"
              } border-r transition-all duration-300 ease-in-out ${
                isSidebarOpen
                  ? "translate-x-0"
                  : isMobile
                  ? "-translate-x-full absolute"
                  : "-translate-x-0"
              } h-full ${isMobile ? "z-10 w-52" : ""}`}
            >
              <div className="p-3 md:p-4">
                <h3
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } font-medium mb-3 md:mb-4 text-sm md:text-base`}
                >
                  Select Assistant Role
                </h3>
                <div className="space-y-1 md:space-y-2">
                  {Object.keys(ROLE_PROMPTS).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setSelectedRole(role as AssistantRole);
                      }}
                      className={`w-full flex items-center gap-2 md:gap-3 text-left px-3 py-2 md:px-4 md:py-3 rounded-lg text-xs md:text-sm ${
                        selectedRole === role
                          ? `${
                              darkMode ? "bg-blue-600" : "bg-blue-500"
                            } text-white`
                          : `${
                              darkMode
                                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                            }`
                      }`}
                    >
                      <span className="text-sm md:text-lg">
                        {ROLE_ICONS[role as AssistantRole]}
                      </span>
                      <span className="flex-1">{formatRoleName(role)}</span>
                      {selectedRole === role && (
                        <FiChevronRight className="ml-1 md:ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main chat area */}
          <div className="flex-1 flex flex-col">
            {error && (
              <div
                className={`${
                  darkMode ? "bg-red-900" : "bg-red-100 text-red-900"
                } p-2 text-center text-xs md:text-sm`}
              >
                {error}
              </div>
            )}

            <div
              ref={chatContainerRef}
              className={`flex-1 overflow-y-auto p-2 md:p-4 space-y-4 md:space-y-6 ${
                darkMode ? "bg-gray-900" : "bg-gray-50"
              }`}
            >
              {messages.length === 0 ? (
                <div
                  className={`flex items-center justify-center h-full ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <div className="text-center">
                    <RiRobot2Line
                      className={`mx-auto text-3xl md:text-4xl mb-2 md:mb-3 ${
                        darkMode ? "text-blue-500" : "text-blue-600"
                      }`}
                    />
                    <p className="text-sm md:text-base">
                      Ask me anything as your {selectedRole} assistant...
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-full md:max-w-3xl ${
                        m.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center ${
                          m.role === "user"
                            ? `${
                                darkMode ? "bg-gray-700" : "bg-gray-400"
                              } ml-2 md:ml-4`
                            : `${
                                darkMode ? "bg-blue-600" : "bg-blue-500"
                              } mr-2 md:mr-4`
                        }`}
                      >
                        {m.role === "user" ? (
                          <FiUser className="text-white text-sm md:text-lg" />
                        ) : (
                          <RiRobot2Line className="text-white text-sm md:text-lg" />
                        )}
                      </div>
                      <div
                        className={`relative px-3 py-2 md:px-4 md:py-3 rounded-lg ${
                          m.role === "user"
                            ? `${
                                darkMode ? "bg-gray-800" : "bg-gray-200"
                              } rounded-tr-none`
                            : `${
                                darkMode ? "bg-gray-700" : "bg-gray-100"
                              } rounded-tl-none`
                        }`}
                      >
                        <button
                          onClick={() => copyMessage(m.id)}
                          className={`absolute top-1 right-1 p-0.5 md:p-1 ${
                            darkMode
                              ? "text-gray-400 hover:text-white"
                              : "text-gray-500 hover:text-gray-900"
                          } transition-colors`}
                          title="Copy message"
                        >
                          <FiCopy size={12} className="md:size-[14px]" />
                        </button>
                        <p
                          className={`whitespace-pre-wrap ${
                            darkMode ? "text-gray-100" : "text-gray-800"
                          } pr-5 md:pr-6 text-xs md:text-sm`}
                        >
                          {m.content}
                        </p>
                        {copiedMessageId === m.id && (
                          <div
                            className={`absolute bottom-0.5 right-1 text-[10px] md:text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Copied!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className={`border-t ${
                darkMode
                  ? "border-gray-800 bg-gray-900"
                  : "border-gray-200 bg-gray-50"
              } p-2 md:p-4`}
            >
              <div className="flex space-x-1 md:space-x-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask me as ${formatRoleName(
                    selectedRole
                  )} assistant...`}
                  className={`flex-1 ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-700"
                      : "bg-white text-gray-900 border-gray-300"
                  } rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 ${
                    darkMode ? "focus:ring-blue-600" : "focus:ring-blue-500"
                  } border text-xs md:text-sm`}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } disabled:${
                    darkMode ? "bg-gray-700" : "bg-gray-300"
                  } text-white rounded-lg px-3 py-2 md:px-4 md:py-3 transition-colors flex items-center justify-center w-10 md:w-12`}
                >
                  {isLoading ? (
                    <span className="animate-spin text-sm md:text-base">↻</span>
                  ) : (
                    <FiSend className="text-lg md:text-xl" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showDialog && (
        <ClearChatDialog
          setShowDialog={setShowDialog}
          handleClearChat={handleClearChat}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default UserAssistance;
