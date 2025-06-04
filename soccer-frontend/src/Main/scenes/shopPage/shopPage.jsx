// src/Main/scenes/ShopPage/Shop.jsx

import api from "../../../api/axios";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DotSpinner from "../../components/loading";
import { useCart } from "../CartPage/CartContext.jsx";

const ITEMS_PER_PAGE = 6;

const Shop = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "";
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]); // filtered list
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const { addToCart } = useCart();
  const timeoutId = useRef(null);

  // Fetch all products once
  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      const data = response.data;
      setAllProducts(data);
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Whenever the URL’s initialCategory or allProducts change, re‑filter + reset to page 1
  useEffect(() => {
    if (initialCategory && allProducts.length) {
      const filtered = allProducts.filter((p) => p.category === initialCategory);
      setProducts(filtered);
    } else {
      setProducts(allProducts);
    }
    setCurrentPage(1);
  }, [initialCategory, allProducts]);

  // Handler when dropdown changes
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category === "") {
      setProducts(allProducts);
      navigate("/shop"); // reset URL query
    } else {
      const filtered = allProducts.filter((p) => p.category === category);
      setProducts(filtered);
      navigate(`/shop?category=${encodeURIComponent(category)}`);
    }
    setCurrentPage(1);
  };

  // Add to cart handler
  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setSuccessMessage(`${product.name} added to cart!`);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => setSuccessMessage(""), 2000);
  };

  if (!allProducts.length) {
    // show spinner until fetchProducts runs
    return <DotSpinner className="mx-auto mt-20" />;
  }

  // Pagination logic
  const totalItems  = products.length;
  const totalPages  = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex  = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex    = startIndex + ITEMS_PER_PAGE;
  const visibleList = products.slice(startIndex, endIndex);

  // Build page buttons
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <section className="md:px-20 my-20 px-10 py-12 bg-white">
      {/* Success toast */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center font-semibold">
          {successMessage}
        </div>
      )}

      {/* Category dropdown */}
      <div className="w-40 ml-auto my-4">
        <label className="block text-lg font-medium text-gray-700 mb-1">
          Select Category
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          name="category"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 sm:text-sm"
        >
          <option value="">All Categories</option>
          {[...new Set(allProducts.map((p) => p.category))].map((category, idx) => (
            <option key={idx} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of paginated products */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        {visibleList.map((prod) => (
          <Link key={prod._id} to={`/shop/${prod._id}`}>
            <div className="flex cursor-pointer flex-col h-full space-y-4">
              <div className="w-full h-auto mb-4">
                <img
                  src={prod.imageUrls[0]}
                  alt={prod.name}
                  className="w-full object-cover rounded"
                />
              </div>
              <div className="flex flex-col items-center flex-grow">
                <h4 className="text-2xl text-[#393939] font-semibold mb-2">
                  {prod.name}
                </h4>
                <p className="text-lg capitalize text-[#393939] font-semibold mb-2">
                  ${prod.price.toFixed(2)}
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart(prod);
                  }}
                  className="bg-[#aa4344] p-2 rounded text-white font-bold text-md hover:bg-[#aa4344]/90 mt-auto"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          {/* Previous button */}
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

          {/* Next button */}
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
    </section>
  );
};

export default Shop;



// import api from "../../../api/axios";
// import { useState, useEffect } from "react";
// import DotSpinner from "../../components/loading";
// import { useCart } from "../CartPage/CartContext.jsx";
// import { useRef } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// const ITEMS_PER_PAGE = 6;

// const Shop = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const initialCategory = queryParams.get("category") || "";
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(initialCategory);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [successMessage, setSuccessMessage] = useState("");
//   const uniqueCategories = [...new Set(allProducts.map((p) => p.category))];
//   const { addToCart } = useCart();
//   const timeoutId = useRef(null);

//   const handleAddToCart = (product) => {
//     addToCart(product, 1);
//     setSuccessMessage(`${product.name} added to cart!`);
//     window.scrollTo({ top: 0, behavior: "smooth" });

//     if (timeoutId.current) clearTimeout(timeoutId.current);
//     timeoutId.current = setTimeout(() => setSuccessMessage(""), 2000);
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await api.get("/products");
//       const data = response.data;
//       setAllProducts(data);
//       setProducts(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (initialCategory && allProducts.length) {
//       const filtered = allProducts.filter(
//         (p) => p.category === initialCategory
//       );
//       setProducts(filtered);
//     } else {
//       setProducts(allProducts);
//     }
//     setCurrentPage(1);
//   }, [initialCategory, allProducts]);

//   const handleCategoryChange = (e) => {
//     const category = e.target.value;
//     setSelectedCategory(category);

//     if (category === "") {
//       setProducts(allProducts);
//       navigate("/shop");
//     } else {
//       const filtered = allProducts.filter((p) => p.category === category);
//       setProducts(filtered);
//       navigate(`/shop?category=${encodeURIComponent(category)}`);
//     }
//     setCurrentPage(1);
//   };

//   if (!allProducts.length) {
//     return <DotSpinner className="mx-auto mt-20" />;
//   }

//   //For pagination

//   const totalItems = products.length;
//   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = startIndex + ITEMS_PER_PAGE;
//   const visibleList = products.slice(startIndex, endIndex);

//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push();
//   }

//   return (
//     <>
//       <section className="md:px-20 my-20 px-15 py-12 bg-white">
//         {successMessage && (
//           <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center font-semibold">
//             {successMessage}
//           </div>
//         )}
//         <div className="w-40 ml-auto my-4">
//           <label className="block text-lg font-medium text-gray-700 mb-1">
//             Select Category
//           </label>
//           <select
//             value={selectedCategory}
//             onChange={handleCategoryChange}
//             name="category"
//             className="mt-1 block w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//           >
//             <option value="">All Categories</option>
//             {uniqueCategories.map((category, index) => (
//               <option key={index} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="grid cols-2 md:grid-cols-3 gap-10">
//           {visibleList.map((prod) => (
//             <Link key={prod._id} to={`/shop/${prod._id}`}>
//               <div className="space-x-4 flex cursor-pointer flex-col h-full">
//                 <div className="w-full h-auto mb-4">
//                   <img
//                     src={prod.imageUrls[0]}
//                     alt={prod.name}
//                     className="w-full "
//                   />
//                 </div>
//                 <div className="flex flex-col items-center flex-grow">
//                   <h4 className="text-2xl text-[#393939] font-semibold mb-2">
//                     {prod.name}
//                   </h4>
//                   <p className="text-lg capitalize text-[#393939] font-semibold flex flex-wrap items-center gap-x-2 mb-2">
//                     ${prod.price.toFixed(2)}
//                   </p>
//                   <button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       handleAddToCart(prod);
//                     }}
//                     className="bg-[#aa4344] p-2 rounded text-white cursor-pointer font-bold text-md hover:bg-[#aa4344]/90 mt-auto self-center"
//                   >
//                     Add To Cart
//                   </button>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center space-x-2 mt-8">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1), 1)}
//               disabled={currentPage === 1}
//               className={`px-3 py-1 rounded ${
//                 currentPage === 1
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-gray-300 text-gray-700 hover:bg-gray-400"
//               }`}
//             >
//               Prev
//             </button>

//             {pageNumbers.map((num) => (
//               <button
//                 key={num}
//                 onClick={() => setCurrentPage(num)}
//                 className={`px-3 py-1 rounded ${
//                   currentPage === num
//                     ? "bg-[#aa4344] text-white"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 {num}
//               </button>
//             ))}

//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               className={`px-3 py-1 rounded ${
//                 currentPage === totalPages
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-gray-300 text-gray-700 hover:bg-gray-400"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </section>
//     </>
//   );
// };

// export default Shop;
