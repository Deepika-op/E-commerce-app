import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all products
  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error(
        "Error loading products:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/delete/${id}`);
      alert("Product deleted successfully!");
      await loadProducts();
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message
      );
    }
  };

  // Load products when page opens
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product List</h2>

        <Link
          to="/admin/products/add"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Product
        </Link>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">
                  Title
                </th>
                <th className="border border-gray-200 px-4 py-2">
                  Price
                </th>
                <th className="border border-gray-200 px-4 py-2">
                  Stock
                </th>
                <th className="border border-gray-200 px-4 py-2">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="text-center">
                  <td className="border border-gray-200 px-4 py-2">
                    {product.title}
                  </td>

                  <td className="border border-gray-200 px-4 py-2">
                    ${product.price}
                  </td>

                  <td className="border border-gray-200 px-4 py-2">
                    {product.stock ?? 0}
                  </td>

                  <td className="border border-gray-200 px-4 py-2">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="text-blue-500 hover:underline mr-3"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="border border-gray-200 px-4 py-4 text-center"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}