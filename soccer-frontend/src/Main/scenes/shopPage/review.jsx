import { useState, useEffect } from "react";

import api from "../../../api/axios";

function ReviewForm({ productId }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // for hover effect (optional)
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const { data } = await api.post(`/products/${productId}/reviews`, {
        rating,
        comment,
      });
      setSuccessMsg("Review submitted successfully");
      setRating(0);
      setComment("");
    } catch (err) {
      // Show error from backend or generic message
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      setErrorMsg(message);
    }
    setLoading(false);
  };

  useEffect(() => {
    setSuccessMsg("");
    setErrorMsg("");
    setRating(0);
    setComment("");
  }, [productId]);

  return (
    <form
      onSubmit={submitHandler}
      className="w-full mx-auto p-4 bg-white rounded-lg"
    >
      <h2 className="text-xl font-bold mb-2">Write a Review</h2>

      {/* Rating Stars */}
      <div className="flex items-center space-x-2 mb-4 ">
        <span className="mr-2">Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-3xl cursor-pointer focus:outline-none ${
              star <= (hoverRating || rating)
                ? "text-yellow-500"
                : "text-gray-300"
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </button>
        ))}
      </div>

      {/* Comment Textarea */}
      <div className="mb-4">
        <label htmlFor="comment" className="block mb-1 font-medium">
          Comment:
        </label>
        <textarea
          id="comment"
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#aa4344]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave your feedback here"
          required
        ></textarea>
      </div>

      {/* Success/Error Messages */}
      {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-[#aa4344] text-white font-semibold px-4 py-2 cursor-pointer hover:bg-[#aa4344]/90"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default ReviewForm;
