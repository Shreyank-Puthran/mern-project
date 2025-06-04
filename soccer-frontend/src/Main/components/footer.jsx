import api from "../../api/axios";
import { useState, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const [news, setNews] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const uniqueCategories = [...new Set(allProducts.map((p) => p.category))];

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      const data = response.data;
      setAllProducts(data);
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await api.get("/news");
      //   console.log(response.data);
      const newData = response.data;
      setNews(newData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get("/products/reviews");
      //   console.log(response.data);
      const reviewData = response.data;
      setReviews(reviewData);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchReviews();
    fetchProducts();
  }, []);

  return (
    <footer className=" bottom-0 bg-[#262626] text-gray-300 text-sm">
      <div className=" mx-auto md:px-20 px-15 py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* About */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-3">About Us</h3>
          <p className="text-sm leading-relaxed">
            Cum sociis natoque penatibus et magnis dis parturient montes,
            nascetur ridiculus mus. Morbi leo risus, porta ac consectetur ac,
            vestibulum at eros.
          </p>
          <p className="mt-3 text-sm">Address: 239 Main Street, London</p>
          <p className="mt-3 text-sm">Call: +1800-222-3333</p>
        </div>

        {/* Product Categories */}
        <div>
          <h3 className="text-whit text-xl font-semibold mb-3">
            Product Categories
          </h3>
          <ul className="space-y-1">
            {uniqueCategories.map((category, index) => (
              <Link key={index} to={`/shop?category=${encodeURIComponent(category)}`}>
              <li>{category}</li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Recent News */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-3">Recent News</h3>
          <ul className="space-y-2">
            {news
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .slice(0, 3)
              .map((n, index) => (
                <Link key={n._id} to={`/news/${n._id}`}>
                  <li className="flex items-center justify-start py-4 border-b-2">
                    <span>
                      <img
                        className="h-15 w-15 "
                        src={n.imageUrl}
                        alt={n.title}
                      />
                    </span>
                    <span className="px-2">
                      <p className="break-all">{n.title}</p>
                      <p className="flex items-center justify-start">
                        <FaRegCalendarAlt className="pr-1" />
                        {new Date(n.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="md:hidden">
                        {n.content.length > 45
                          ? n.content.slice(0, 45) + "..."
                          : n.content}
                      </p>
                    </span>
                  </li>
                </Link>
              ))}
          </ul>
        </div>

        {/* Recent Comments */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-3">
            Recent Reviews
          </h3>
          <ul className="space-y-2">
            {reviews
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .slice(0, 3)
              .map((r, index) => (
                <li
                  key={r._id}
                  className="flex-col items-center justify-start pb-4 border-b-2"
                >
                  <span>
                    <p>{r.name}</p>
                  </span>
                  <span>
                    <Link
                      to={`/shop/${r.productId}`}
                      className="hover:text-[#aa4344] cursor-pointer"
                    >
                      <p>Product : {r.productName}</p>
                    </Link>
                  </span>
                  <span>
                    <p className="flex items-center justify-start">
                      <FaRegCalendarAlt className="pr-1" />
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </span>
                  <span>
                    {r.comment.length > 45
                      ? r.comment.slice(0, 45) + "..."
                      : r.comment}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="text-center text-base bg-black py-4 text-xs text-gray-500 border-t border-gray-700">
        © Copyright 2025, Discorp — Powered by MERN
      </div>
    </footer>
  );
};

export default Footer;
