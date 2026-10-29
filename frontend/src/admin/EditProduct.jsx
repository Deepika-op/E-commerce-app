import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../api/axios";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load selected product
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.get("/products");

        const product = response.data.find(
          (item) => item._id === id
        );

        if (!product) {
          setError("Product not found.");
          return;
        }

        setForm({
          title: product.title ?? "",
          description: product.description ?? "",
          price: product.price ?? "",
          category: product.category ?? "",
          image: product.image ?? "",
          stock: product.stock ?? "",
        });
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Product not loaded. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/products/update/${id}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });

      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);
      alert(
        err.response?.data?.message ||
        "Product is not updated"
      );
    }
  };

  if (loading) {
    return <div className="max-w-lg mx-auto mt-10">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/admin/products")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Product List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Title"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}