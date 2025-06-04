import api from "../../../api/axios";
import { useState, useEffect } from "react";
import DotSpinner from "../../components/loading.jsx";
import { useParams, Link } from "react-router-dom";
import ReviewForm from "./review.jsx";
import { useCart } from "../CartPage/CartContext.jsx";
import { useRef } from "react";
const SingleProduct = () => {
  const [product, setProduct] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [news, setNews] = useState(null);
  const [fullNews, setFullNews] = useState([]);

  const [activeTab, setActiveTab] = useState("description");
  const [fadeOut, setFadeOut] = useState(false);
  const [displayedTab, setDisplayedTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  const { id } = useParams();
  const uniqueCategories = [...new Set(fullNews.map((n) => n.category))];

  const { addToCart } = useCart();
  const timeoutId = useRef(null);

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    setSuccessMessage(`${product.name} added to cart!`);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => setSuccessMessage(""), 2000);
  };
  
  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products/get-product/${id}`);
      const data = response.data;
      const photoData = data.imageUrls;
      setProduct(data);
      setPhotos(photoData);
    } catch (error) {}
  };

  const fetchNews = async () => {
    try {
      const raw = await api.get("/news");
      //   const response = await api.get(`/news/get-news/${id}`);
      const response = await api.get(`/news`);
      const newsData = response.data;
      const rawData = raw.data;
      setNews(newsData);
      setFullNews(rawData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get("/products/reviews");
      setReviews(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchNews();
    fetchReviews();
  }, []);

  const handleTabClick = (tab) => {
    if (tab === activeTab) return;
    setFadeOut(true);
    setTimeout(() => {
      setDisplayedTab(tab);
      setFadeOut(false);
      setActiveTab(tab);
    }, 300);
  };

  const tabClass = (tab) =>
    `font-semibold text-lg md:text-xl cursor-pointer ${
      activeTab === tab
        ? "p-3 font-semibold bg-[#aa4344] text-white"
        : "p-3 bg-[#f0f0f0] font-semibold text-[#787878]"
    }`;

  if (!product || !photos || !reviews || !news) {
    return <DotSpinner className="mx-auto mt-20" />;
  }

  return (
    <>
      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center font-semibold">
          {successMessage}
        </div>
      )}
      <section className="py-12 px-10 md:px-20 bg-white flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="col-span-1 md:col-span-2 w-full flex  flex-col md:flex-row space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:w-[50%]">
              {/* Row 1*/}
              <div className="text-center">
                <a href="#">
                  <img src={photos[0]} className="w-full mb-4 mx-auto h-auto" />
                </a>
              </div>
              {/* Row 2*/}
              <div className="grid grid-cols-3 gap-4">
                {photos.slice(1, 4).map((img, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={img}
                      className="w-full h-auto"
                      alt={`Additional product ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-[50%] md:ml-10">
              <h1 className="text-4xl text-[#393939] font-light">
                {product.name}
              </h1>
              <p className="text-[#787878] my-4 ">
                ({product.numReviews}) customer reviews
              </p>
              <p className="text-[#aa4344] mb-4 text-2xl font-bold">
                ${product.price}
              </p>
              <p className="text-[#787878]">
                Lorem ipsum dolor sit amet, consectetur adipisici elit, sed
                eiusmod tempor incidunt ut labore et dolore magna aliqua.
                Inmensae subtilitatis, obscuris et malesuada fames. Morbi
                fringilla convallis sapien, id pulvinar odio volutpat. Ut enim
                ad minim veniam, quis nostrud exercitation. Quisque placerat
                facilisis egestas cillum dolore.
              </p>
              <span className="flex items-center my-4 justify-between">
                <input
                  type="number"
                  placeholder="1"
                  value={quantity}
                  onChange={(e) => {
                    let val = Number(e.target.value);
                    if (val < 1) val = 1;
                    else if (val > product.stock) val = product.stock;
                    setQuantity(val);
                  }}
                  className="border-1 text-center py-2 bg-[#f0f0f0]"
                  min={1}
                  max={Number(product.stock - 1)}
                />
                <button
                  onClick={() => handleAddToCart(product, quantity)}
                  className="bg-[#aa4344] p-2 rounded text-white cursor-pointer font-bold text-md hover:bg-[#aa4344]/90 mt-auto self-center"
                >
                  Add To Cart
                </button>
              </span>
              <p className="text-[#787878] my-2">
                Category:{" "}
                <Link className="text-[#aa4344]">{product.category}</Link>
              </p>
              <p className="text-[#787878] my-2">Stock: {product.stock}</p>
            </div>
          </div>
          <div className="border-b flex border-[#787878] mt-10 md:mt-40">
            <p
              onClick={() => handleTabClick("description")}
              className={tabClass("description")}
            >
              Description
            </p>
            <p
              onClick={() => handleTabClick("reviews")}
              className={tabClass("reviews")}
            >
              Reviews({product.numReviews})
            </p>
          </div>
          <div
            className={`w-full transition-opacity duration-300 ${
              fadeOut ? "opacity-0" : "opacity-100"
            }`}
          >
            {displayedTab === "description" && (
              <div className="text-[#787878] mt-5 space-y-4">
                <p></p>
                <p className="my-4">
                  {product.description} Cras mattis consectetur purus sit amet
                  fermentum. Etiam porta sem malesuada magna mollis euismod.
                  Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                  Cum sociis natoque penatibus et magnis dis parturient montes,
                  nascetur ridiculus mus. Sed posuere consectetur est at
                  lobortis. Sed posuere consectetur est at lobortis. Duis
                  mollis, est non commodo luctus, nisi erat porttitor ligula,
                  eget lacinia odio sem nec elit.
                </p>
              </div>
            )}

            {displayedTab === "reviews" && (
              <div className=" gap-4">
                <p className="text-[#787878] my-4 text-center text-2xl font capitalize">
                  {product.numReviews} reviews for {product.name}
                </p>
                {reviews
                  .filter((r) => r.productId === id)
                  .map((review, index) => (
                    <div
                      key={index}
                      className="flex border-1 border-gray-300 mb-4 p-2 flex-col"
                    >
                      <p className="mt-2 text-[#393939] underline underline-offset-1 font-semibold">
                        {review.name}
                      </p>
                      <p className="mt-2 text-[#787878] font-semibold">
                        Rating : {review.rating}
                      </p>
                      <p className="mt-2 text-[#787878] font-semibold">
                        {review.comment}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <ReviewForm productId={id} />
        </div>

        {/* Right Section */}
        <div className="w-full md:pl-5 md:w-1/3 space-y-8">
          <div>
            <h3 className="text-xl md:text-2xl text-[#aa4344] font-bold flex items-center">
              Ut enim ad minim
            </h3>
            <p className="text-[#787878] my-4">
              Cras mattis consectetur purus sit amet fermentum.Nullam quis risus
              eget urna mollis ornare vel eu leo. Donec ullamcorper nulla non
              metus auctor fringilla. Donec id elit non mi porta gravida at eget
              metus.
            </p>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl text-[#aa4344] font-bold flex items-center">
              Recent Comments
            </h3>
            <div className="mt-3 space-y-4">
              {reviews
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5)
                .map((review, index) => (
                  <p key={index} className="text-[#787878] border-b pb-2">
                    {review.name} on{" "}
                    <a href="#" className="text-[#aa4344]">
                      {review.productName}
                    </a>
                  </p>
                ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl text-[#aa4344] font-bold flex items-center">
              News Categories
            </h3>
            <div className="mt-3 space-y-4">
              {uniqueCategories.map((category, index) => (
                <Link
                  key={index}
                  to={`/articles/category/${encodeURIComponent(category)}`}
                >
                  <p
                    key={index}
                    className="text-[#787878] hover:text-[#aa4344] border-b py-2"
                  >
                    {category}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleProduct;
