import facebook from "../assets/facebook.png";
import flickr from "../assets/flickr.png";
import pinterest from "../assets/pinterest.png";
import twitter from "../assets/twitter.png";
import main from "../assets/main-logo.png";
import heineken from "../assets/heineken.png";
import puma from "../assets/puma.png";
import vimeo from "../assets/vimeo.png";
import cart from "../assets/shopping-bag.png";
import userIcon from "../assets/user-icon.png";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "../scenes/CartPage/CartContext";

const Header = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const { cartItems } = useCart();

  const { setCart } = useCart();

  const handleLogout = async () => {
    setCart([]);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const isLoggedIn = !!token && !!user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  const cartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 220);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCartDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="w-full text-white text-sm py-4 bg-[#262626]">
        <div className="flex lg:items-start flex-col md:flex-row justify-between px-6 py-2">
          <div className="flex justify-center lg:items-start space-x-4 text-gray-300 text-xs order-1 h-7 md:order-3">
            <a href="#">
              <img src={facebook} className="h-full" alt="facebook" />
            </a>
            <a href="#">
              <img src={flickr} className="h-full" alt="flickr" />
            </a>
            <a href="#">
              <img src={pinterest} className="h-full" alt="pinterest" />
            </a>
            <a href="#">
              <img src={vimeo} className="h-full" alt="vimeo" />
            </a>
            <a href="#">
              <img src={twitter} className="h-full" alt="twitter" />
            </a>
            <a href="#">
              <div className="relative" ref={cartRef}>
                <img
                  src={cart}
                  className="h-full cursor-pointer"
                  alt="cart"
                  onClick={() => setShowCartDropdown((prev) => !prev)}
                />

                {showCartDropdown && (
                  <div className="absolute right-0 mt-3 w-40 bg-[#191919] max-h-35 overflow-y-scroll scrollbar-thin text-white shadow-lg z-50">
                    <div className="p-4 text-sm">
                      <p>
                        <strong>Items:</strong> {totalItems}
                      </p>
                      <p>
                        <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="">
                      <button
                        onClick={() => navigate("/cart")}
                        className="w-full px-4 py-2 text-left cursor-pointer hover:text-[#aa4344] font-bold text-sm"
                      >
                        View Cart
                      </button>
                      <button
                        onClick={() => navigate("/checkout")}
                        className="w-full px-4 py-2 text-left cursor-pointer hover:text-[#aa4344] font-bold text-sm"
                      >
                        Check Out
                      </button>
                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full px-4 py-2 text-left cursor-pointer hover:text-[#aa4344] font-bold text-sm"
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </a>
            {isLoggedIn ? (
              <p
                className="text-2xl self-end cursor-pointer text-white self-end font-semibold"
                onClick={handleLogout}
              >
                Logout
              </p>
            ) : (
              <Link to="/login">
                {/* <img src={userIcon} className="h-8" alt="user" />
                 */}
                <p className="text-2xl self-end cursor-pointer text-white self-end font-semibold">
                  Login
                </p>
              </Link>
            )}
          </div>

          <div className="flex justify-center space-x-4 text-gray-300 lg:items-start text-xs order-2 md:order-1 mt-4 md:mt-0 h-7">
            <span>
              <img src={heineken} className="h-full" alt="heineken" />
            </span>
            <span>
              <img src={puma} className="h-full" alt="puma" />
            </span>
          </div>

          <div className="items-center order-3 md:order-2 mt-4 md:mt-0">
            <a href="/">
              <img src={main} alt="Logo" className="h-40 mx-auto md:mx-0" />
            </a>
          </div>

          <div className="order-4 md:hidden mt-4 md:mt-0 mx-auto">
            <button type="button" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </header>
      <div
        className={`${menuOpen ? "block" : "hidden"} ${
          scrolled ? "bg-[#262626] md:bg-[#262626]/80" : "bg-[#262626]"
        } text-white md:block md:sticky md:top-0 md:z-50 py-4`}
      >
        <nav className="text-center text-2xl font-semibold space-x-0 md:space-x-6 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-0">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `mx-4 hover:text-[#aa4344] ${
                isActive ? "text-[#aa4344]" : "text-white"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/fixture-page"
            className={({ isActive }) =>
              `mx-4 hover:text-[#aa4344] ${
                isActive ? "text-[#aa4344]" : "text-white"
              }`
            }
          >
            Fixtures & Results
          </NavLink>
          <NavLink
            to="/league-page"
            className={({ isActive }) =>
              `mx-4 hover:text-[#aa4344] ${
                isActive ? "text-[#aa4344]" : "text-white"
              }`
            }
          >
            League Table
          </NavLink>
          <NavLink
            to="/team-page"
            className={({ isActive }) =>
              `mx-4 hover:text-[#aa4344] ${
                isActive ? "text-[#aa4344]" : "text-white"
              }`
            }
          >
            Teams & Players
          </NavLink>
          <NavLink
            to="/articles"
            className={({ isActive }) =>
              `mx-4 hover:text-[#aa4344] ${
                isActive ? "text-[#aa4344]" : "text-white"
              }`
            }
          >
            News
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `mx-4 hover:text-[#aa4344] ${
                isActive ? "text-[#aa4344]" : "text-white"
              }`
            }
          >
            Shop
          </NavLink>
          {isLoggedIn && user?.role === "admin" && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `mx-4 hover:text-[#aa4344] ${
                  isActive ? "text-[#aa4344]" : "text-white"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;
