import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import Card from "@/components/utilities/Card";
import BlogSidebar from "@/components/BlogSidebar";
import FAQAccordion from "@/components/Faqaccordion";
import BlogCategorySlider from "@/components/utilities/BlogCategorySlider";
import useFullUrl from "@/hooks/useFullUrl";
import { absoluteUrl, blogPath } from "@/lib/urls";
import he from "he";
import parse from "html-react-parser";

const BlogDetails = ({
  initialBlog,
  initialCategoryBlogs,
  initialFilterCategories,
  initialPopularBlogs,
}) => {
  const sectionRef = useRef(null); // ← add this

  const [blog, setBlog] = useState(initialBlog);
  const [loading, setLoading] = useState(false);
  const [categoryBlogs, setCategoryBlogs] = useState(initialCategoryBlogs);
  const [filtercategories, setFiltercategories] = useState(
    initialFilterCategories,
  );
  const [popularBlogs, setPopularBlogs] = useState(initialPopularBlogs);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [tocDescription, setTocDescription] = useState("");
  const fullUrl = useFullUrl();

  const router = useRouter();
  const { slug } = router.query;

  const fetchBlog = async () => {
    if (!slug) return; // Wait until slug is available

    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}website/blog/${slug}`);
      setBlog(res?.data?.data || null);
      if (res?.data?.data?.category?.id) {
        fetchCategoryBlogs(res?.data?.data?.category?.id);
      }
    } catch (err) {
      console.error("Failed to fetch blog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch on client if we don't have initial data or if slug changes
    if (!initialBlog || initialBlog.slug !== slug) {
      fetchBlog();
      fetchCategories();
      fetchPopularBlogs();
    }
  }, [slug]);

  const changeDateFormate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
    return formatted;
  };

  const fetchCategoryBlogs = async (id) => {
    try {
      setLoading(true);
      const endpoint = `${BASE_URL}website/blog?categories=${id}`;
      const res = await axios.get(endpoint);
      setCategoryBlogs(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}website/blog-category?limit=100`);
      setFiltercategories(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchPopularBlogs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}website/blog?limit=5`);
      setPopularBlogs(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch popular blogs:", err);
    }
  };

  const handleCategoryToggle = (id) => {
    // On details page, toggling a category should probably redirect to the blog list with that filter
    router.push(`/blog?categories=${id}`);
  };

  const renderHTMLTags = (htmlString) => {
    if (!htmlString) return null;
    try {
      const decoded = he.decode(htmlString);
      const parsed = parse(decoded);
      return parsed;
    } catch (error) {
      console.error("Error parsing HTML tags:", error);
      return null;
    }
  };

  const categoryPath = blogPath(blog?.category?.slug);
  // Built from the post's own slugs so the canonical stays stable no matter
  // which category path the visitor arrived through.
  const canonicalUrl =
    absoluteUrl(blogPath(blog?.category?.slug, blog?.slug)) || fullUrl;

  const metaDescription = blog?.meta_description || blog?.short_description || "";

  return (
    <>
      <Head>
        <title>
          {blog?.meta_title ||
            "GTF Technologies: Leading Real Estate Digital Marketing Agency"}
        </title>
        {/* Omit rather than emit empty tags — an empty description reads as a
            missing description to crawlers. */}
        {metaDescription && <meta name="description" content={metaDescription} />}
        {blog?.meta_keywords && <meta name="keywords" content={blog.meta_keywords} />}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        {renderHTMLTags(blog?.head_tags)}
      </Head>
      {renderHTMLTags(blog?.body_tags)}

      <section className="blog-platter" ref={sectionRef}>
        <div className="container">
          {!loading && blog && (
            <div className="row">
              <div className="col-sm-9">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="big-box">
                      <div className="details-blog">
                        <h1 className="main-heading">{blog?.heading}</h1>

                        <ul className="inline-details">
                          <li>
                            <span className="catogories-det">
                              {blog?.category?.name}
                            </span>
                          </li>
                          <li>
                            <p>
                              <span>published:</span>{" "}
                              {changeDateFormate(blog?.date_at)}
                            </p>
                          </li>
                          {/* <li>
                          <p><span>updated on:</span> Aug 12, 2022</p>
                        </li> */}
                        </ul>

                        <div className="img-box">
                          <img
                            src={blog?.feature_image}
                            width="100%"
                            alt={blog?.heading || "Blog image"}
                          />
                        </div>

                        <div
                          dangerouslySetInnerHTML={{
                            __html: blog?.description,
                          }}
                        />

                        {blog?.toc && blog?.toc.length > 0 && (
                          <>
                            <div className="inner-d-box">
                              <h3>Table of Contents</h3>
                              <ul className="toc-list">
                                {blog?.toc?.map((item, index) => (
                                  <li key={index}>
                                    <a href={`#${item.slug}`}>
                                      {item.toc_heading}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {blog?.toc?.map((item, index) => (
                              <React.Fragment key={index}>
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
                        )}
                      </div>

                      <FAQAccordion blog_id={blog?.id} />

                      <div className="big-box-multiple">
                        <h4 className="main-heading">{blog?.category?.name}</h4>
                        {categoryPath && (
                          <Link href={categoryPath}>
                            <button className="btn btn-default btn-multi arrow_button">
                              View All{" "}
                              <img src="/assets/frontend/images/right-down.png" alt="Right Arrow" />{" "}
                            </button>
                          </Link>
                        )}
                      </div>

                      <BlogCategorySlider
                        data={categoryBlogs}
                        catSlug={blog?.category?.slug}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-3">
                <div className="small-box">
                  <BlogSidebar
                    filtercategories={filtercategories}
                    data={popularBlogs}
                    checkCategories={[]}
                    handleCategoryToggle={handleCategoryToggle}
                    filter={false}
                    sectionRef={sectionRef}
                  />
                </div>
              </div>
            </div>
          )}
          {loading && <div className="text-center p-5">Loading...</div>}
          {!loading && !blog && (
            <div className="text-center p-5">Blog not found</div>
          )}
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps(context) {
  const { category_slug, slug } = context.params;
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    // 1. Fetch the main blog data
    const blogRes = await axios.get(`${BASE_URL}website/blog/${slug}`);
    const blog = blogRes?.data?.data || null;

    if (!blog) {
      return {
        notFound: true,
      };
    }

    // 2. Validate category: If accessed under wrong category URL, 301 redirect to correct category URL
    const correctCategorySlug = blog.category?.slug;
    if (correctCategorySlug && category_slug !== correctCategorySlug) {
      return {
        redirect: {
          destination: `/${correctCategorySlug}/${slug}/`,
          permanent: true,
        },
      };
    }

    // 3. Fetch other related data in parallel
    const [categoryBlogsRes, categoriesRes, popularBlogsRes] =
      await Promise.all([
        axios.get(`${BASE_URL}website/blog?categories=${blog.category?.id}`),
        axios.get(`${BASE_URL}website/blog-category?limit=100`),
        axios.get(`${BASE_URL}website/blog?limit=5`),
      ]);

    return {
      props: {
        initialBlog: blog,
        initialCategoryBlogs: categoryBlogsRes?.data?.data || [],
        initialFilterCategories: categoriesRes?.data?.data || [],
        initialPopularBlogs: popularBlogsRes?.data?.data || [],
      },
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return { notFound: true };
    }
    console.error("Error in getServerSideProps:", error);
    return { notFound: true };
  }
}

export default BlogDetails;
