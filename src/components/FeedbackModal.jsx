// src/components/FeedbackModal.jsx
import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import {toast} from "react-toastify"

export default function FeedbackModal({ order, onClose, onFeedbackSubmitted }) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return setError("Please enter your feedback.");
    try {
      setLoading(true);
      console.log(`${order._id}`)
      await axios.post(`/feedback/${order._id}`, { feedbackText: feedback }, { withCredentials: true });

      toast.success("Thank you for your feedback!");
      onFeedbackSubmitted(); // refresh orders list
      onClose();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-blue-600 mb-4 text-center">
          Feedback for Order #{order._id.slice(-6)}
        </h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring focus:ring-blue-200"
            rows={4}
            placeholder="Write your feedback about the order..."
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-red-600 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
