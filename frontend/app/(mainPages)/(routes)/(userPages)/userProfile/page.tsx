const UserProfile = () => {
  const user = {
    image: "https://via.placeholder.com/150",
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="max-w-sm w-full bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <img
          className="w-32 h-32 rounded-full mx-auto border-4 border-gray-300"
          src={user.image}
          alt="User Profile"
        />
        <div className="text-center mt-6 space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-600 text-lg">{user.email}</p>
          <p className="text-gray-600 text-lg">{user.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
