import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BlogTOC({ blog_id }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogToc = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}website/blog-toc?blog_id=${id}`);
      const list = res?.data?.data || [];
      setData(list);
    } catch (err) {
      console.error("Failed to fetch blog TOC:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blog_id) fetchBlogToc(blog_id);
  }, [blog_id]);

  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data || !data.length) return null;

  return (
    <>
      <div className="inner-d-box">
        <h3>Table of Contents</h3>
        <ul className="toc-list">
          {data.map((item, index) => (
            <li key={item.id || index}>
              <a href={`#${item.slug}`}>{item.toc_heading}</a>
            </li>
          ))}
        </ul>
      </div>
      {data.map((item, index) => (
        <React.Fragment key={item.id || index}>
          <div id={item.slug}>
            <h2 className="main-heading">{item.title}</h2>
            <p
              className="para-details"
              dangerouslySetInnerHTML={{
                __html: item?.description,
              }}
            />
          </div>
        </React.Fragment>
      ))}
    </>
  );
}
