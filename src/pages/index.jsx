import Hero from "@/components/Hero";
import BlogCard from "@/components/utilities/BlogCard";
import Container from "@/components/utilities/Container";
import LatestBlog from "@/components/utilities/LatestBlog";
import Pagination from "@/components/utilities/Pagination";
import SearchInput from "@/components/utilities/SearchInput";
import Section from "@/components/utilities/Section";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import NavLink from "@/components/utilities/NavLink";
import Link from "next/link";
import Card from "@/components/utilities/Card";
import BlogSidebar from "@/components/BlogSidebar";
import { useRouter } from "next/router";
import useFullUrl from "@/hooks/useFullUrl";
import { blogPath } from "@/lib/urls";

const HOME_TITLE = "GTF Technologies Blog — Real Estate Digital Marketing Tips";
// Shared by the meta, OG and Twitter descriptions so the three can't drift apart.
const HOME_DESCRIPTION =
  "Explore GTF Technologies' blog for insights on real estate digital marketing, SEO, content strategies, and the latest industry trends.";

const Blogs = ({ initialCategories, initialBlogs, initialTotalPages }) => {

  const fullUrl = useFullUrl();

  const sectionRef = useRef(null); // ← add this
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState(initialBlogs);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [categories, setCategories] = useState(initialCategories);
  const [filtercategories, setFiltercategories] = useState(initialCategories || []);

  const [checkCategories, setCheckCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const limit = 20;
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


  const isFirstRender = useRef(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const idsQuery = checkCategories.length > 0 ? `&ids=${checkCategories.join(",")}` : "";
      const endpoint = `${BASE_URL}website/blog-category?page=${page}&limit=${limit}${idsQuery}`;
      const res = await axios.get(endpoint);
      if (filtercategories.length <= 0) {
        setFiltercategories(res.data?.data || []);
      }
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleCategoryToggle = (id) => {
    setCheckCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!initialCategories || initialCategories.length === 0) {
        fetchCategories();
      }
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchCategories();
      fetchBlogs();
    }, 300); // debounce input

    return () => clearTimeout(delayDebounce);
  }, [page, searchTerm, checkCategories]);

  const handlePageChange = (newPage) => {
    if (newPage !== page) setPage(newPage);
  };

  const changeDateFormate = (dateString) => {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric"
    });
    return formatted;
  }

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const endpoint = searchTerm
        ? `${BASE_URL}website/blog?search=${searchTerm}`
        : `${BASE_URL}website/blog?page=${page}&limit=${limit}`;
      const res = await axios.get(endpoint);

      setBlogs(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Head>
        <meta name="google-site-verification" content="d2xfLBX0ojDABzk6iID4jN8WTINFqWhXyupGiOJouCA" />
        <title>{HOME_TITLE}</title>
        <meta name="description" content={HOME_DESCRIPTION} />
        <meta name="keywords" content="real estate digital marketing, SEO tips, PPC strategies, branding insights, social media marketing, digital marketing blog, GTF Technologies blog, marketing trends" />
        <link rel="canonical" href="https://blog.gtftechnologies.com/" />
        <meta name="distribution" content="Global" />
        <meta name="Language" content="English" />
        <meta name="doc-type" content="Public" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="GTF Technologies" />
        <meta name="googlebot" content="all, index, follow" />
        <meta name="YahooSeeker" content="all, index, follow" />
        <meta name="msnbot" content="all, index, follow" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="safe for kids" />
        <meta name="expires" content="never" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={HOME_TITLE} />
        <meta property="og:description" content={HOME_DESCRIPTION} />
        <meta property="og:url" content="https://blog.gtftechnologies.com/" />
        <meta property="og:site_name" content="GTF Technologies" />
        <meta property="og:image" content="https://gtftechnologies.com/images/og_logo.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@GTFTechnologies" />
        <meta name="twitter:title" content={HOME_TITLE} />
        <meta name="twitter:description" content={HOME_DESCRIPTION} />
        <meta name="twitter:creator" content="@GTFTechnologies" />
        <meta name="twitter:image" content="https://gtftechnologies.com/images/og_logo.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "GTF Technologies",
              "url": "https://gtftechnologies.com/",
              "logo": "https://gtftechnologies.com/images/og_logo.jpg",
              "sameAs": [
                "https://www.facebook.com/Gtftechnologiesindia/",
                "https://x.com/GtfTechnologies",
                "https://www.instagram.com/gtf_technologies/",
                "https://www.youtube.com/@GTFTECHNOLOGIES",
                "https://in.linkedin.com/company/gtftechnologies",
                "https://in.pinterest.com/gtftechnologies/"
              ]
            })
          }}
        />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"
        />
      </Head>
      <Hero
        imageSrc="/assets/frontend/images/breadcrumb.jpg"
        mobileSrc="/assets/frontend/images/breadcrumb.jpg"
        title="Blogs"
      />

      <section className="blog-platter" ref={sectionRef}>

        <div className="container">

          <div className="row">
            <div className="col-sm-9 ">

              {categories && categories.map((cat) => {
                if (cat.blogs.length > 0) {
                  return (
                    <React.Fragment key={cat.id}>
                      <div className="big-box-multiple">
                        <h4 className="main-heading">{cat.name}</h4>
                        {
                          // Absolute path, and skipped entirely when the slug is
                          // missing — a relative href here resolved against the
                          // current path and produced /undefined/... URLs.
                          cat.blogs.length >= 3 && blogPath(cat.slug) && (
                            <Link href={blogPath(cat.slug)}><button className="btn btn-default btn-multi arrow_button">View All <img src="/assets/frontend/images/right-down.png" alt="Right Arrow" /> </button></Link>
                          )
                        }
                      </div>

                      <div className="box-multiple">
                        <div className="row">
                          {cat.blogs && cat.blogs.map((blogitem) => {
                            return <div className="col-sm-4" key={blogitem.id}> <Card data={blogitem} key={blogitem.id} catSlug={cat.slug} /></div>
                          })}
                        </div>
                      </div>
                    </React.Fragment>
                  )
                }
              })}


            </div>

            <div className="col-sm-3">
              <div className="small-box">
                <BlogSidebar
                  filtercategories={filtercategories}
                  data={blogs}
                  checkCategories={checkCategories}
                  handleCategoryToggle={handleCategoryToggle}
                  filter={true}
                  sectionRef={sectionRef}
                />
              </div>


            </div>
          </div>
        </div>
      </section>



    </>
  );
};

export async function getServerSideProps() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const limit = 20;

  try {
    const [categoriesRes, blogsRes] = await Promise.all([
      axios.get(`${BASE_URL}website/blog-category?page=1&limit=${limit}`),
      axios.get(`${BASE_URL}website/blog?page=1&limit=${limit}`)
    ]);

    return {
      props: {
        initialCategories: categoriesRes.data?.data || [],
        initialBlogs: blogsRes.data?.data || [],
        initialTotalPages: blogsRes.data?.pagination?.totalPages || 1,
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    return {
      props: {
        initialCategories: [],
        initialBlogs: [],
        initialTotalPages: 1,
      },
    };
  }
}

export default Blogs;
