import Banner from "@/components/Banner";
import SectionTitle from "@/components/SectionTitle";
import Subscribe from "@/components/Subscribe";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";

const page = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Destinations to Visit in 2024",
      image: "assets/images/blog/blog1.jpg",
      date: "January 15, 2024",
      author: "Admin",
      excerpt: "Discover the most amazing destinations for your next adventure.",
    },
    {
      id: 2,
      title: "Travel Tips for First-Time Visitors",
      image: "assets/images/blog/blog2.jpg",
      date: "January 10, 2024",
      author: "Admin",
      excerpt: "Essential tips to make your first trip memorable and stress-free.",
    },
    {
      id: 3,
      title: "Best Time to Visit Dubai",
      image: "assets/images/blog/blog3.jpg",
      date: "January 5, 2024",
      author: "Admin",
      excerpt: "Learn about the best seasons and weather for your Dubai trip.",
    },
  ];

  return (
    <ReveloLayout>
      <Banner pageTitle={"Blog"} />
      <section className="blog-area py-100 rel z-1">
        <div className="container">
          <SectionTitle
            title="Latest Blog Posts"
            subtitle="Travel insights and tips"
          />
          <div className="row">
            {blogPosts.map((post) => (
              <div key={post.id} className="col-lg-4 col-md-6 mb-30">
                <div className="blog-item">
                  <div className="image">
                    <img src={post.image} alt={post.title} />
                  </div>
                  <div className="content">
                    <ul className="blog-meta">
                      <li>
                        <i className="far fa-calendar-alt" /> {post.date}
                      </li>
                      <li>
                        <i className="far fa-user" /> {post.author}
                      </li>
                    </ul>
                    <h5>
                      <Link href={`/blog-details?id=${post.id}`}>
                        {post.title}
                      </Link>
                    </h5>
                    <p>{post.excerpt}</p>
                    <Link
                      href={`/blog-details?id=${post.id}`}
                      className="read-more"
                    >
                      Read More <i className="fal fa-angle-right" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Subscribe />
    </ReveloLayout>
  );
};

export default page;

