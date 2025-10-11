import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
    const token = localStorage.getItem("token"); // assuming JWT saved after login
    const res = await axios.get("http://localhost:5000/api/users/ALL", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(res.data);
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
};

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-black">👥 Manage Users</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg text-black">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
             
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-blue-50">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="p-4 text-gray-600 text-center">No users found.</p>
        )}
      </div>
    </div>
  );
}
