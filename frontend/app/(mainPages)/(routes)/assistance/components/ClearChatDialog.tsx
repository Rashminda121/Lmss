import { FiTrash2, FiX } from "react-icons/fi";

interface ClearChatDialogProps {
  setShowDialog: (show: boolean) => void;
  handleClearChat: () => void;
  darkMode: boolean;
}

const ClearChatDialog = ({
  setShowDialog,
  handleClearChat,
  darkMode,
}: ClearChatDialogProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div
        className={`${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } rounded-xl max-w-md w-full p-6 border shadow-2xl`}
      >
        <div className="text-center mb-6">
          <div
            className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
              darkMode ? "bg-red-900/30" : "bg-red-100"
            } mb-4`}
          >
            <FiTrash2
              className={`h-5 w-5 ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
            />
          </div>
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Clear Conversation
          </h3>
          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Are you sure you want to clear this chat? All messages will be
            permanently deleted.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDialog(false)}
            className={`px-4 py-2.5 rounded-lg ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            } ${
              darkMode ? "text-white" : "text-gray-800"
            } transition-colors flex-1 text-sm font-medium flex items-center justify-center gap-2`}
            aria-label="Cancel and keep chat"
          >
            <FiX size={16} />
            <span>Cancel</span>
          </button>
          <button
            onClick={() => {
              handleClearChat();
              setShowDialog(false);
            }}
            className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors flex-1 text-sm font-medium flex items-center justify-center gap-2"
            aria-label="Confirm and clear chat"
          >
            <FiTrash2 size={16} />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearChatDialog;
