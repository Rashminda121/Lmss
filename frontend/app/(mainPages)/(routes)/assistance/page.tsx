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
  | "creative";

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
};

const ROLE_ICONS: Record<AssistantRole, JSX.Element> = {
  general: <RiRobot2Line className="text-lg" />,
  education: <span className="text-lg">📚</span>,
  "mental-support": <span className="text-lg">💬</span>,
  coding: <span className="text-lg">💻</span>,
  creative: <span className="text-lg">🎨</span>,
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
    showDialog;
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            User Assistance
          </h1>
          <p className="text-gray-400 mt-2">
            Seek wisdom from The Last Codebender
          </p>
        </header>

        {/* Menu Bar with Controls */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <>
                <FiX size={18} />
                <span>Hide Roles</span>
              </>
            ) : (
              <>
                <FiMenu size={18} />
                <span>Show Roles</span>
              </>
            )}
          </button>
          <div className="flex gap-2">
            <button
              onClick={copyChat}
              disabled={messages.length === 0}
              className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              title="Copy chat"
            >
              <FiCopy size={16} />
              {showCopied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => setShowDialog(true)}
              disabled={messages.length === 0}
              className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              title="Clear chat"
            >
              <FiTrash2 size={16} />
              Clear
            </button>
          </div>
        </div>

        <div className="flex h-[60vh] bg-black rounded-xl shadow-xl overflow-hidden border border-gray-800 relative">
          {/* Sidebar with role selection */}
          <div
            className={`w-64 bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full absolute"
            } h-full`}
          >
            <div className="p-4">
              <h3 className="text-white font-medium mb-4">
                Select Assistant Role
              </h3>
              <div className="space-y-2">
                {Object.keys(ROLE_PROMPTS).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setSelectedRole(role as AssistantRole);
                    }}
                    className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg text-sm ${
                      selectedRole === role
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <span className="text-lg">
                      {ROLE_ICONS[role as AssistantRole]}
                    </span>
                    <span className="flex-1">{formatRoleName(role)}</span>
                    {selectedRole === role && (
                      <FiChevronRight className="ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main chat area */}
          <div className="flex-1 flex flex-col">
            {error && (
              <div className="bg-red-900 text-white p-2 text-center text-sm">
                {error}
              </div>
            )}

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-900"
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <RiRobot2Line className="mx-auto text-4xl mb-3 text-purple-500" />
                    <p>Ask me anything as your {selectedRole} assistant...</p>
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
                      className={`flex max-w-3xl ${
                        m.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          m.role === "user"
                            ? "bg-gray-700 ml-4"
                            : "bg-purple-600 mr-4"
                        }`}
                      >
                        {m.role === "user" ? (
                          <FiUser className="text-white text-lg" />
                        ) : (
                          <RiRobot2Line className="text-white text-lg" />
                        )}
                      </div>
                      <div
                        className={`relative px-4 py-3 rounded-lg ${
                          m.role === "user"
                            ? "bg-gray-800 rounded-tr-none"
                            : "bg-gray-700 rounded-tl-none"
                        }`}
                      >
                        <button
                          onClick={() => copyMessage(m.id)}
                          className="absolute top-1 right-1 p-1 text-gray-400 hover:text-white transition-colors"
                          title="Copy message"
                        >
                          <FiCopy size={14} />
                        </button>
                        <p className="whitespace-pre-wrap text-gray-100 pr-6 text-sm">
                          {m.content}
                        </p>
                        {copiedMessageId === m.id && (
                          <div className="absolute bottom-1 right-1 text-xs text-gray-400">
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
              className="border-t border-gray-800 p-4 bg-gray-900"
            >
              <div className="flex space-x-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask me as ${formatRoleName(
                    selectedRole
                  )} assistant...`}
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700 text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white rounded-lg px-4 py-3 transition-colors flex items-center justify-center w-12"
                >
                  {isLoading ? (
                    <span className="animate-spin">↻</span>
                  ) : (
                    <FiSend className="text-xl" />
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
        />
      )}
    </div>
  );
};

export default UserAssistance;
