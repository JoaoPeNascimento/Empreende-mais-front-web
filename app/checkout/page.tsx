"use client";

import CheckoutProductCard from "@/components/CheckoutProductCard";
import Header from "@/components/Header";
import { useCartStore } from "@/store/useCartStore";

const Checkout = () => {
  const cart = useCartStore((state) => state.cart);

  return (
    <>
      <Header />
      <div className="space-y-2 mt-2 px-2">
        {cart.map((item) => (
          <CheckoutProductCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </>
  );
};

export default Checkout;
