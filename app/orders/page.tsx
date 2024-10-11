import OrderContainer from "@/components/Order/OrderContainer";
import React from "react";

const OrderPage = () => {
  return (
    <main>
      <section>Filter, sort and search order</section>
      <section>
        <OrderContainer />
      </section>
    </main>
  );
};

export default OrderPage;
