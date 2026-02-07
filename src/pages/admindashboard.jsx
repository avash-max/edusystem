import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await getUser();

        if (response?.data?.success) {
          setData(response.data.user);
        } else {
          toast.error(response?.data?.message || "Something went wrong");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, []);
  const Dashboard=()=>{
    const handleDelete =async (id)=> {
      const confirmDelete =window.confirm("Are you sure you want to delete this user?");
      if(!confirmDelete ) return; 
  try {
    const response = await deleteUserById(id);
    if (response?.data?.success)
{
  setData(prevData => prevData.filter(user.id!==id));
  return toast .error(response?.data?.message);
}   else{
  return toast.error(response?.data?.message);

}   

    }

  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border border-gray-300">#</th>
              <th className="py-2 px-4 border border-gray-300">Email</th>
              <th className="py-2 px-4 border border-gray-300">Username</th>
              <th className="py-2 px-4 border border-gray-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((user, index) => (
              <tr
                key={user._id || index}
                className="even:bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <td className="py-2 px-4 border border-gray-300">
                  {index + 1}
                </td>

                <td className="py-2 px-4 border border-gray-300">
                  {user.email}
                </td>

                <td className="py-2 px-4 border border-gray-300">
                  {user.username}
                </td>

                <td className="py-2 px-4 border border-gray-300">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;