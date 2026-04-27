import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../App/AppContext";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const { setCart } = useAuth();
  const navigate = useNavigate();

  // LOAD CART
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(data);
    setCart(data.length);
  }, []);

  // REMOVE ITEM
  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated.length);
    toast.error("Item removed");
  };

  // QUANTITY UPDATE
  // Optimized Quantity Update
const updateQty = (id, type) => {
  const updated = cartItems.map((item) => {
    if (item.id === id) {
      let qty = item.qty || 1;
      type === "inc" ? qty++ : (qty > 1 && qty--);
      return { ...item, qty };
    }
    return item;
  });

  setCartItems(updated);
  localStorage.setItem("cart", JSON.stringify(updated));
  // Keep AppContext in sync
  const totalItems = updated.reduce((acc, item) => acc + (item.qty || 1), 0);
  setCart(totalItems); 
};

  // TOTAL PRICE
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * (item.qty || 1),
    0
  );

  // APPLY COUPON
  const applyCoupon = () => {
    const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

    const isValid = allProducts.find(
      (p) => p.cupon_code === coupon
    );

    if (isValid) {
      setDiscount(totalPrice * 0.15);
      toast.success("15% Discount Applied");
    } else {
      setDiscount(0);
      toast.error("Invalid Coupon");
    }
  };

  const finalPrice = totalPrice - discount;

  // CLEAR CART
  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    setCart(0);
    toast.success("Cart Cleared");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* LEFT SIDE */}
        <div className="lg:w-2/3 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center bg-white p-4 rounded-xl shadow">

                <img src={item.imageUrl} className="w-24 h-24 rounded" />

                <div className="ml-6 flex-1">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-indigo-600 font-bold">
                    ${item.price}
                  </p>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, "dec")} className="px-2 bg-gray-200">-</button>
                    <span>{item.qty || 1}</span>
                    <button onClick={() => updateQty(item.id, "inc")} className="px-2 bg-gray-200">+</button>
                  </div>
                </div>

                <button onClick={() => removeItem(item.id)} className="text-red-500">
                  Remove
                </button>
              </div>
            ))
          ) : (
            <div className="bg-white p-10 text-center rounded">
              <p>Your cart is empty!</p>
              <Link to="/" className="text-indigo-600">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow sticky top-24">

            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {/* COUPON */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="border px-3 py-2 w-full rounded"
              />
              <button onClick={applyCoupon} className="bg-indigo-600 text-white px-4 rounded">
                Apply
              </button>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-lg mt-3">
              <span>Total</span>
              <span>${finalPrice.toFixed(2)}</span>
            </div>

            {/* BUTTONS */}
            <button
              onClick={() => {
                if (cartItems.length === 0) {
                  toast.error("Cart is empty!");
                  return;
                }
                navigate("/checkout");
              }}
              className="w-full bg-indigo-600 text-white py-3 mt-4 rounded"
            >
              Checkout
            </button>

            <button
              onClick={clearCart}
              className="w-full bg-red-500 text-white py-2 mt-3 rounded"
            >
              Clear Cart
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;