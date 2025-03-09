import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9999/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching blog detail:", error));
  }, [id]);

  if (!post) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  return (
    <div className="container py-5">
      <div className="mb-4 border-bottom pb-3">
        <h1 className="fw-bold">{post.title}</h1>
        <p className="text-muted">{new Date(post.created_at).toLocaleDateString()}</p>
      </div>
      <div className="mb-4 text-center">
        <img src={post.img} className="img-fluid rounded w-50" alt={post.title} />
      </div>
      <div className="content">
        <p className="lead">{post.content}</p>
      </div>
    </div>
  );
};

export default BlogDetail;