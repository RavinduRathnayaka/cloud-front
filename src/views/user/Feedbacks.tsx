import React, { useState, useEffect } from "react";
import axios from "axios";

const FeedbackForm = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  useEffect(() => {
    // Retrieve userId from local storage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      alert("User is not logged in");
      return;
    }

    const feedback = {
      userId, // Use user ID from local storage
      name,
      email,
      rating,
      comment,
    };

    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem("token");

      // Add headers with Authorization token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "https://cloud-back-7qc4.onrender.com/api/auth/feedback",
        feedback,
        config
      );

      if (response.status === 201) {
        alert("Feedback submitted successfully");
        // Reset the form or redirect as needed
        setName("");
        setEmail("");
        setRating(1);
        setComment("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-5xl bg-white shadow-md rounded-lg overflow-hidden">
        
        {/* Left side with a GIF image */}
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('feed.gif')" }}>
        </div>

        {/* Right side with the feedback form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Submit Your Feedback
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="rating" className="text-sm font-semibold text-gray-700 mb-1">
                Rating
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Fair</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Very Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="comment" className="text-sm font-semibold text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
