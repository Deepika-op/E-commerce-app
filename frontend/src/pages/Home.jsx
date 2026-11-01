
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        `/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`
      );

      setProducts(res.data);
    } catch (err) {
      console.error("Products loading error:", err);
      setError("Unable to load products. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const res = await api.post("/cart/add", {
        userId,
        productId,
      });

      window.dispatchEvent(new Event("cartUpdated"));

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(
        error.response?.data?.message ||
        "Unable to add product to cart."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">

      {/* Search and Category */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 bg-white p-4 shadow-sm rounded">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-500 px-4 py-3 rounded-md w-full md:w-1/2 outline-none focus:border-blue-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 px-4 py-3 rounded-md w-full md:w-1/4 outline-none"
        >
          <option value="">All Categories</option>
          <option value="Foundation">Foundation</option>
          <option value="Lipstick">Lipstick</option>
          <option value="Mascara">Mascara</option>
        </select>

      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-lg">
          Loading products...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-500">
          {error}
        </p>
      )}

      {/* Products */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="border border-gray-500 rounded-md p-3 flex flex-col bg-white hover:shadow-md transition"
              >

                {/* Product Image */}
                <Link
                  to={`/product/${product._id}`}
                  className="flex justify-center items-center"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-44 object-contain bg-white"
                  />
                </Link>

                {/* Product Name */}
                <Link
                  to={`/product/${product._id}`}
                  className="no-underline text-black"
                >
                  <h2 className="mt-3 font-semibold text-lg text-left">
                    {product.title}
                  </h2>
                </Link>

                {/* Price and Add Button */}
                <div className="flex justify-between items-center mt-2">

                  <p className="text-gray-800 font-medium text-base">
                    ${product.price}
                  </p>

                  <button
                    onClick={() => addToCart(product._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Add
                  </button>

                </div>

              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No products found.
            </p>
          )}

        </div>
      )}

    </div>
  );
}
