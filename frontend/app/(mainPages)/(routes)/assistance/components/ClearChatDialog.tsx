import { FiTrash2 } from "react-icons/fi";

interface ClearChatDialogProps {
  setShowDialog: (value: boolean) => void;
  handleClearChat: () => void;
}

const ClearChatDialog: React.FC<ClearChatDialogProps> = ({
  setShowDialog,
  handleClearChat,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700 shadow-2xl">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 mb-4">
            <FiTrash2 className="h-5 w-5 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Clear Conversation
          </h3>
          <p className="mt-2 text-sm text-gray-300">
            Are you sure you want to clear this chat? All messages will be
            permanently deleted.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDialog(false)}
            className="px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors flex-1 text-sm font-medium"
            aria-label="Cancel and keep chat"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleClearChat();
            }}
            className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors flex-1 text-sm font-medium"
            aria-label="Confirm and clear chat"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearChatDialog;
