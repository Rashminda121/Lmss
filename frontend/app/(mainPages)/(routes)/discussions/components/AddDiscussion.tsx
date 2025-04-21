import { FaTimes } from "react-icons/fa";

interface AddDiscussionProps {
  setIsModalOpen: (isOpen: boolean) => void;
  handleSubmit: any;
  handleInputChange: any;
  formData: { title: string; category: string; description: string };
  isUpdating?: boolean;
  isAdding?: boolean;
}

const AddDiscussion = ({
  setIsModalOpen,
  handleSubmit,
  handleInputChange,
  formData,
  isUpdating,
  isAdding,
}: AddDiscussionProps) => {
  const categoryOptions = [
    { value: "general", label: "General" },
    { value: "courses", label: "Courses" },
    { value: "resources", label: "Resources" },
    { value: "ideas", label: "Ideas" },
    { value: "careers", label: "Careers" },
    { value: "productivity", label: "Productivity" },
    { value: "tools", label: "Tools" },
    { value: "projects", label: "Projects" },
    { value: "support", label: "Support" },
  ];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {(isUpdating && "Update Discussion") ||
              (isAdding && "Start New Discussion")}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Discussion Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="What's your question or topic?"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm  focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Discussion Content
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Provide details about your question or topic..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              {(isUpdating && "Update Discussion") ||
                (isAdding && "Post Discussion")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDiscussion;
