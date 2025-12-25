import Banner from "@/components/Banner";
import SectionTitle from "@/components/SectionTitle";
import Product from "@/components/slider/Product";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";

const page = () => {
  const products = [
    {
      id: 1,
      title: "Travel Guide Book",
      image: "assets/images/shop/product1.png",
      price: 29.99,
      originalPrice: 39.99,
    },
    {
      id: 2,
      title: "Travel Accessories",
      image: "assets/images/shop/product2.png",
      price: 19.99,
    },
  ];

  return (
    <ReveloLayout>
      <Banner pageTitle={"Shop"} />
      <section className="shop-area py-100 rel z-1">
        <div className="container">
          <SectionTitle
            title="Our Products"
            subtitle="Travel essentials"
          />
          <Product products={products} />
        </div>
      </section>
      <Subscribe />
    </ReveloLayout>
  );
};

export default page;

