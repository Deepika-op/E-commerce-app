import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) {
        setCartCount(0);
        return;
      }

      try {
        const res = await api.get(`/cart/${userId}`);
        const total = res.data.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        setCartCount(total);
      } catch (error) {
        console.error("Cart loading error:", error);
      }
    };

    loadCart();
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, [userId]);

  const logout = () => {
    localStorage.clear();
    setCartCount(0);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-black text-white px-5 py-4 shadow-md">
      {/* Store Name */}
      <Link to="/" className="font-bold text-xl text-white no-underline">
        Glamora
      </Link>

      {/* Cart and Authentication */}
      <div className="flex gap-5 items-center">
        <Link to="/cart" className="relative text-2xl text-white no-underline">
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-1.5 rounded">
              {cartCount}
            </span>
          )}
        </Link>

        {!userId ? (
          <>
            <Link
              to="/login"
              className="text-white text-lg no-underline hover:text-gray-300"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="text-white text-lg no-underline hover:text-gray-300"
            >
              Signup
            </Link>
          </>
        ) : (
          <button
            onClick={logout}
            className="text-white text-lg bg-transparent border-none cursor-pointer hover:text-gray-300"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
