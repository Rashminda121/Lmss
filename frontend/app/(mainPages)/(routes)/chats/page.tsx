"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  FiMenu,
  FiX,
  FiTrash2,
  FiSend,
  FiUsers,
  FiMessageSquare,
  FiUser,
  FiMail,
  FiChevronRight,
} from "react-icons/fi";
import Swal from "sweetalert2";

interface User {
  name: string;
  email: string;
  image: string;
  role: string;
}

interface Message {
  uid: string;
  message: string;
  createdAt: Date;
  _id: string;
}

const UserChat = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUserList, setShowUserList] = useState(true);
  const { user } = useUser();
  const hasFetchedData = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(`${backendUrl}/user/listUsersChat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getMessages = async () => {
    if (!selectedUser || !user?.emailAddresses?.[0]?.emailAddress) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.post(
        `${backendUrl}/user/getMessages`,
        {
          email1: user.emailAddresses[0].emailAddress,
          email2: selectedUser.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data.data?.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (
      !newMessage.trim() ||
      !selectedUser ||
      !user?.emailAddresses?.[0]?.emailAddress
    )
      return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await axios.post(
        `${backendUrl}/user/sendMessage`,
        {
          email1: user.emailAddresses[0].emailAddress,
          email2: selectedUser.email,
          message: { uid: user.id, message: newMessage },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");
      await getMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedUser || !user?.emailAddresses?.[0]?.emailAddress)
        return;

      await axios.delete(`${backendUrl}/user/deleteMessage`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          email1: user.emailAddresses[0].emailAddress,
          email2: selectedUser.email,
          messageId,
        },
      });
      await getMessages();
      Swal.fire("Deleted!", "Your message has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting message:", error);
      Swal.fire("Error!", "Failed to delete message.", "error");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!hasFetchedData.current && user) {
      getUsers();
      hasFetchedData.current = true;
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser) getMessages();
  }, [selectedUser]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full h-screen mt-5 md:max-h-[600px] p-0 sm:p-4">
      <div className="flex h-full w-full max-w-7xl mx-auto bg-white rounded-none sm:rounded-xl shadow overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`absolute md:relative top-0 left-0 h-full z-30 md:z-0 w-full md:w-80 lg:w-96 bg-gray-50 border-r border-gray-200 flex flex-col transform transition-transform duration-300 ${
            showUserList
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="p-4 bg-white border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FiUsers className="mr-2" /> Chats
            </h2>
            <button
              onClick={() => setShowUserList(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {users.length > 0 ? (
              users.map((u) => (
                <div
                  key={u.email}
                  className={`p-3 cursor-pointer flex items-center justify-between border-b ${
                    selectedUser?.email === u.email
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  } transition-colors duration-150`}
                  onClick={() => {
                    setSelectedUser(u);
                    if (window.innerWidth < 768) setShowUserList(false);
                  }}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={u.image}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-800 truncate mr-2">
                          {u.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 truncate flex items-center">
                        <FiMail className="mr-1" size={12} />
                        {u.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        u.role === "admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {u.role &&
                        u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </span>
                    <FiChevronRight className="ml-2 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                <FiUser className="text-3xl text-gray-300 mb-2" />
                No users available
              </div>
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col h-4/5 md:h-full ">
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="flex items-center p-3 border-b">
                <button
                  className="md:hidden mr-3 text-gray-500"
                  onClick={() => setShowUserList(true)}
                >
                  <FiMenu size={20} />
                </button>
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="w-9 h-9 rounded-full mr-3"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-800 truncate flex items-center gap-2">
                    {selectedUser.name}
                    {selectedUser.email ===
                      user?.emailAddresses[0]?.emailAddress && (
                      <span className="text-[11px] bg-gray-200 text-gray-600 px-2 py-[2px] rounded-full">
                        You
                      </span>
                    )}
                  </h2>

                  <p className="text-xs text-gray-500 truncate">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${
                        msg.uid === user?.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-md rounded-lg p-3 text-sm shadow-sm ${
                          msg.uid === user?.id
                            ? "bg-blue-500 text-white"
                            : "bg-white border"
                        }`}
                      >
                        <div className="overflow-y-auto max-h-60">
                          <p className="whitespace-pre-wrap break-words">
                            {msg.message}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs gap-2 opacity-80">
                          <span>{formatTime(msg.createdAt)}</span>
                          {msg.uid === user?.id && (
                            <button
                              onClick={() => deleteMessage(msg._id)}
                              className="hover:text-red-300"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                    <FiMessageSquare size={32} className="mb-3 text-blue-500" />
                    <h3 className="text-lg font-medium mb-1">
                      No messages yet
                    </h3>
                    <p className="text-center">
                      Start a conversation with {selectedUser.name}
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <div className="p-3 border-t bg-white">
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className={`px-4 rounded-r-lg transition-colors ${
                      newMessage.trim()
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FiSend size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-center p-6">
              <FiMessageSquare size={36} className="text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a user
              </h3>
              <p className="text-gray-500 mb-4">
                Choose a conversation from the list to get started.
              </p>
              <button
                onClick={() => setShowUserList(true)}
                className="mt-2 md:hidden px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
              >
                <FiUsers className="inline-block mr-2" />
                Show Users
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserChat;
