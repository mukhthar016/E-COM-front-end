import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";

export default function ManageFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/feedback", { withCredentials: true });
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      alert("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-700 text-lg font-medium">
        Loading feedbacks...
      </div>
    );

  if (feedbacks.length === 0)
    return (
      <div className="text-center p-8 text-gray-600 text-lg">
        No feedbacks submitted yet.
      </div>
    );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-6xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-3">
        Customer Feedbacks
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-800 font-semibold text-left">
            <tr>
              <th className="p-4 border-b">Order ID</th>
              <th className="p-4 border-b">Customer</th>
              <th className="p-4 border-b">Feedback</th>
              <th className="p-4 border-b">Date</th>
            </tr>
          </thead>

          <tbody className="text-gray-900">
            {feedbacks.map((f, i) => (
              <tr
                key={f._id}
                className={`border-b ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition`}
              >
                <td className="p-4 font-mono text-blue-700">
                  {f.order?._id || "—"}
                </td>

                <td className="p-4">
                  <p className="font-medium">{f.user?.name || "Unknown User"}</p>
                  <p className="text-xs text-gray-500">{f.user?.email}</p>
                </td>

                <td className="p-4 text-gray-800">{f.feedbackText}</td>

                <td className="p-4 text-sm text-gray-600">
                  {new Date(f.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
