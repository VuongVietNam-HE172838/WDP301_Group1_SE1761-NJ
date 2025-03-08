import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9999/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  return (
    <div className="container py-5">
      <section className="mb-5">
        {blogs.length > 0 && (
          <div className="card border-0 shadow-lg rounded">
            <div className="row g-0">
              <div className="col-lg-6">
                <Link to={`/blogs/${blogs[0]._id}`}>
                  <img src={blogs[0].img} className="img-fluid rounded-start w-100" style={{ height: "300px", objectFit: "cover" }} alt={blogs[0].title} />
                </Link>
              </div>
              <div className="col-lg-6 p-4">
                <p className="text-secondary">{new Date(blogs[0].created_at).toLocaleDateString()}</p>
                <h1>
                  <Link to={`/blogs/${blogs[0]._id}`} className="text-dark text-decoration-none">{blogs[0].title}</Link>
                </h1>
                <p className="text-muted">{blogs[0].content.substring(0, 100)}...</p>
              </div>
            </div>
          </div>
        )}
      </section>
      <section>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Danh sách bài viết</h2>
        </div>
        <div className="row g-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="col-md-4">
              <div className="card h-100 shadow-sm">
                <Link to={`/blogs/${blog._id}`}>
                  <img src={blog.img} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} alt={blog.title} />
                </Link>
                <div className="card-body">
                  <p className="text-secondary small">{new Date(blog.created_at).toLocaleDateString()}</p>
                  <h5 className="card-title">
                    <Link to={`/blogs/${blog._id}`} className="text-dark text-decoration-none">{blog.title}</Link>
                  </h5>
                  <p className="card-text text-muted">{blog.content.substring(0, 100)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;