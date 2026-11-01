
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Cart() {
  const userId = localStorage.getItem("userId");

  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load cart data
  const loadCart = async () => {
    if (!userId) {
      setCart({ items: [] });
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/cart/${userId}`);

      const cartData = res.data.cart || res.data;

      setCart({
        ...cartData,
        items: cartData.items || [],
      });

      setError("");
    } catch (err) {
      console.log("Cart loading error:", err);
      setError("Unable to load cart.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when component loads
  useEffect(() => {
    loadCart();
  }, []);

  // Remove product
  const removeItem = async (productId) => {
    try {
      await api.post("/cart/remove", {
        userId,
        productId,
      });

      await loadCart();

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log("Remove error:", err);
      setError("Unable to remove product.");
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    try {
      await api.post("/cart/update", {
        userId,
        productId,
        quantity,
      });

      await loadCart();

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log("Update quantity error:", err);
      setError("Unable to update quantity.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center p-10">
        Loading cart...
      </div>
    );
  }

  // Login check
  if (!userId) {
    return (
      <div className="text-center p-10">
        Please login to view your cart.
      </div>
    );
  }

  // Error handling
  if (error) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500">{error}</p>

        <button
          onClick={loadCart}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate total
  const total = cart.items.reduce(
    (sum, item) =>
      sum +
      (Number(item.productId?.price) || 0) *
        item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Your Shopping Cart
      </h1>

      {cart.items.length === 0 ? (
        <div className="text-center border rounded-lg p-10">
          <h2 className="text-xl font-semibold mb-3">
            Your cart is empty!
          </h2>

          <p className="text-gray-500">
            Add some products to your cart.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {cart.items.map((item) => {
            const product = item.productId;

            if (!product) return null;

            return (
              <div
                key={product._id}
                className="flex flex-wrap items-center justify-between gap-5 border rounded-lg p-4 shadow-sm"
              >

                {/* Product Details */}
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div>
                    <h2 className="font-semibold text-lg">
                      {product.title}
                    </h2>

                    <p className="text-gray-600">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(
                        product._id,
                        item.quantity - 1
                      )
                    }
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    -
                  </button>

                  <span className="font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        product._id,
                        item.quantity + 1
                      )
                    }
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="font-bold">
                  $
                  {(
                    Number(product.price) *
                    item.quantity
                  ).toFixed(2)}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() =>
                    removeItem(product._id)
                  }
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Remove
                </button>

              </div>
            );
          })}

          {/* Total Price */}
          <div className="flex justify-end border-t pt-5">
            <h2 className="text-2xl font-bold">
              Total: ${total.toFixed(2)}
            </h2>
          </div>

        </div>
      )}
    </div>
  );
}
