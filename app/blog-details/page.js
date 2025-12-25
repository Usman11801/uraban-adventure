import Banner from "@/components/Banner";
import SectionTitle from "@/components/SectionTitle";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useState, useEffect } from "react";

const page = () => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryString = window.location.search;
      const params = new URLSearchParams(queryString);
      const id = params.get("id");
      // In a real app, fetch post by id
      setPost({
        id: id || 1,
        title: "Top 10 Destinations to Visit in 2024",
        image: "assets/images/blog/blog-details.jpg",
        date: "January 15, 2024",
        author: "Admin",
        content: "Discover the most amazing destinations for your next adventure...",
      });
    }
  }, []);

  if (!post) return null;

  return (
    <ReveloLayout>
      <Banner pageTitle={"Blog Details"} />
      <section className="blog-details-area py-100 rel z-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="blog-details-content">
                <div className="image mb-30">
                  <img src={post.image} alt={post.title} />
                </div>
                <ul className="blog-meta mb-20">
                  <li>
                    <i className="far fa-calendar-alt" /> {post.date}
                  </li>
                  <li>
                    <i className="far fa-user" /> {post.author}
                  </li>
                </ul>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="blog-sidebar">
                <div className="widget">
                  <h4 className="widget-title">Recent Posts</h4>
                  <ul className="list-style-one">
                    <li>
                      <Link href="/blog">Travel Tips</Link>
                    </li>
                    <li>
                      <Link href="/blog">Best Destinations</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Subscribe />
    </ReveloLayout>
  );
};

export default page;

