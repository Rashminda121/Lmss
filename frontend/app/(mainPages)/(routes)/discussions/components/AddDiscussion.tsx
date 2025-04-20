import { FaTimes } from "react-icons/fa";

interface AddDiscussionProps {
  setIsModalOpen: (isOpen: boolean) => void;
  handleSubmit: any;
  handleInputChange: any;
  formData: { title: string; category: string; description: string };
  categories: string[];
}

const AddDiscussion = ({
  setIsModalOpen,
  handleSubmit,
  handleInputChange,
  formData,
  categories,
}: AddDiscussionProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            Start New Discussion
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
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="" disabled>
                Select Category
              </option>
              <option key={"general"} value={"general"}>
                General
              </option>
              <option key={"courses"} value={"courses"}>
                Courses
              </option>
              <option key={"resources"} value={"resources"}>
                Resources
              </option>
              <option key={"help"} value={"help"}>
                Help
              </option>
              <option key={"ideas"} value={"ideas"}>
                Ideas
              </option>
            </select>
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
              Post Discussion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDiscussion;
