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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-6 rounded-lg shadow-xl max-w-md w-full`}
      >
        <h3
          className={`text-lg font-medium mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Clear Chat History
        </h3>
        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Are you sure you want to clear all chat messages? This action cannot
          be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDialog(false)}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleClearChat}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearChatDialog;
