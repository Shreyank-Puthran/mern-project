// src/Main/scenes/NewsPage/Articles.jsx

import api from "../../../api/axios";
import { useState, useEffect } from "react";
import { IoPricetagSharp } from "react-icons/io5";
import { FaRegCalendarAlt, FaUserAlt } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

const Articles = () => {
  const { category } = useParams(); // optional category filter from URL
  const [allNews, setAllNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all news once
  const fetchNews = async () => {
    try {
      const response = await api.get("/news");
      const newsData = response.data;
      setAllNews(newsData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Whenever category or allNews changes, re‑filter + reset to page 1
  useEffect(() => {
    if (category) {
      const filtered = allNews.filter((n) => n.category === category);
      // newest first
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFilteredNews(filtered);
    } else {
      // all news (sorted newest first)
      const sortedAll = [...allNews].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFilteredNews(sortedAll);
    }
    setCurrentPage(1);
  }, [category, allNews]);

  if (!allNews.length) {
    return <div className="text-center py-20">Loading...</div>;
  }

  // Pagination logic
  const totalItems  = filteredNews.length;
  const totalPages  = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex  = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex    = startIndex + ITEMS_PER_PAGE;
  const visibleList = filteredNews.slice(startIndex, endIndex);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <section className="py-12 md:px-20 px-6 bg-[#f0f0f0]">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#aa4344]">
          {category ? `Articles in “${category}”` : "Latest Articles"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {visibleList.map((item) => (
            <Link key={item._id} to={`/news/${item._id}`}>
              <div className="flex flex-col h-full space-y-4 bg-white shadow">
                <div className="w-full h-auto mb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-grow p-4">
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 flex flex-wrap items-center gap-x-2 mb-2">
                    <FaRegCalendarAlt />
                    {new Date(item.createdAt).toLocaleDateString()}
                    <IoPricetagSharp />
                    {item.tags.join(", ")}
                    <FaUserAlt />
                    {item.author}
                  </p>
                  <p className="flex-grow mb-2 text-[#93959f]">
                    {item.content.length > 100
                      ? item.content.slice(0, 100) + "..."
                      : item.content + "..."}
                  </p>
                  <button className="text-[#aa4344] cursor-pointer font-bold text-md hover:text-[#aa4344] self-start">
                    Read More
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              Prev
            </button>

            {/* Page numbers */}
            {pageNumbers.map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded ${
                  currentPage === num
                    ? "bg-[#aa4344] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {num}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Articles;



// import api from "../../../api/axios";
// import { useState, useEffect } from "react";
// import { IoPricetagSharp } from "react-icons/io5";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import { FaUserAlt } from "react-icons/fa";
// import { useParams } from "react-router-dom";
// import { Link } from "react-router-dom";

// const Articles = () => {
//   const [news, setNews] = useState([]);
//   const { category } = useParams();
//   const fetchNews = async () => {
//     try {
//       const response = await api.get("/news");
//       const newsData = response.data;
//       const filtered = category
//         ? newsData.filter((n) => n.category === category)
//         : newsData;

//       const sorted = filtered.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setNews(sorted);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchNews();
//   }, [category]);

//   return (
//     <>
//       <section className="py-30 md:px-20 px-15 bg-[#f0f0f0]">
//         <div className="">
//           <h2 className="text-2xl font-bold mb-4 text-[#aa4344]">
//             {category ? `Articles in "${category}"` : ""}
//           </h2>
//           <div className="grid cols-2 md:grid-cols-3 gap-10">
//             {news.map((news, index) => (
//               <Link key={news._id} to={`/news/${news._id}`}>
//                 <div className="space-x-4 flex flex-col h-full">
//                   <div className="w-full h-auto mb-4">
//                     <img
//                       src={news.imageUrl}
//                       alt={news.title}
//                       className="w-full "
//                     />
//                   </div>
//                   <div className="flex flex-col flex-grow">
//                     <h4 className="font-semibold mb-1">{news.title}</h4>
//                     <p className="text-sm capitalize text-gray-600 flex flex-wrap items-center gap-x-2 mb-2">
//                       <FaRegCalendarAlt />
//                       {new Date(news.date).toLocaleDateString()}
//                       <IoPricetagSharp />
//                       {news.tags.join(", ")}
//                       <FaUserAlt />
//                       {news.author}
//                     </p>
//                     <p className="flex-grow mb-2 text-[#93959f]">
//                       {news.content.length > 100
//                         ? news.content.slice(0, 100) + "..."
//                         : news.content + "..."}
//                     </p>
//                     <button className="text-[#aa4344] cursor-pointer font-bold text-md hover:text-[#aa4344] mt-auto self-start">
//                       Read More
//                     </button>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Articles;