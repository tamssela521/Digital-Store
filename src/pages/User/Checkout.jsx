import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App/AppContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { clearCart } = useAuth(); // Context se clearCart le rahe hain

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    bankName: "",
    accountNumber: "",
  });

  // Check if cart is empty on mount
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      toast.info("Your cart is empty. Redirecting...");
      navigate("/cart");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Validation
    if (!form.name || !form.phone || !form.address || !form.bankName || !form.accountNumber) {
      toast.error("Please fill all fields");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // 2. Create Order Object
    const order = {
      user: form,
      products: cart,
      date: new Date().toLocaleString(),
      status: "pending",
      id: Date.now(), // Unique ID for order
    };

    // 3. Save to LocalStorage
    const oldOrders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([...oldOrders, order]));

    // 4. Clear Cart (Both Storage and State)
    localStorage.removeItem("cart");
    clearCart(); // Yeh context update karega taake navbar badge 0 ho jaye

    toast.success("Order placed successfully!");

    // 5. Final Redirect
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Checkout Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full border p-3 rounded" />
          <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full border p-3 rounded" />
          <textarea name="address" placeholder="Full Address" value={form.address} onChange={handleChange} className="w-full border p-3 rounded" />
          <input type="text" name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} className="w-full border p-3 rounded" />
          <input type="text" name="accountNumber" placeholder="Account Number" value={form.accountNumber} onChange={handleChange} className="w-full border p-3 rounded" />

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;