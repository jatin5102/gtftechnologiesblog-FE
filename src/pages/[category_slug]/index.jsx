
import Head from "next/head";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Hero from "@/components/Hero";
import Card from "@/components/utilities/Card";
import SearchInput from "@/components/utilities/SearchInput";
import useFullUrl from "@/hooks/useFullUrl";
import { absoluteUrl, blogPath } from "@/lib/urls";

const CategoryDetails = ({ initialCategory, initialBlogs }) => {

  const fullUrl = useFullUrl();


  const [category, setCategory] = useState(initialCategory);
  const [blogs, setBlogs] = useState(initialBlogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const router = useRouter();
  const { category_slug } = router.query;

  const fetchCategory = async () => {
    if (!category_slug) return; // Wait until category is available
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}website/blog-category/${category_slug}`
      );
      setCategory(res?.data?.data || null);
      if (res?.data?.data?.id) {
        fetchBlogs(res?.data?.data.id);
      }
    } catch (err) {
      console.error("Failed to fetch Category:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we don't have initial data or if category/search changes
    if (!initialCategory || initialCategory.slug !== category_slug || searchTerm !== "") {
      fetchCategory();
    }
  }, [category_slug, searchTerm]);


  const fetchBlogs = async (category_id) => {

    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}website/blog?category_id=${category_id}&search=${searchTerm}`
      );
      setBlogs(res?.data?.data || []);

    } catch (err) {
      console.error("Failed to fetch blog:", err);
    } finally {
      setLoading(false);
    }
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

  const canonicalUrl = absoluteUrl(blogPath(category?.slug)) || fullUrl;

  return (
    <>
      <Head>
        <title>{category ? `${category.name} - GTF Technologies Blog` : "Blog Category - GTF Technologies"}</title>
        <meta name="description" content={`Explore articles and insights related to ${category?.name || "our blog categories"} at GTF Technologies.`} />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
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
        title={category?.name}
      />
      <div className="box-multiple">
        <section className="blog-platter category_page">



          <div className="container">



            <div className="row">
              <div className="col-md-12">
                <div className="search-box-container mb-4">
                  <SearchInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search blogs..."
                  />
                </div>
              </div>
              {!loading && blogs && blogs.map((blogitem) => {
                return (
                  <div className="col-sm-4" key={blogitem.id}>
                    <Card data={blogitem} key={blogitem.id} catSlug={category?.slug} />
                  </div>
                )
              })}
              {loading && <div className="text-center p-5 w-100">Loading...</div>}
              {!loading && blogs.length === 0 && <div className="text-center p-5 w-100">No blogs found in this category.</div>}
            </div>
          </div>

        </section >
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { category_slug } = context.params;
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    // 1. Fetch category details
    const catRes = await axios.get(`${BASE_URL}website/blog-category/${category_slug}`);
    const category = catRes.data?.data || null;

    if (!category) {
      return { notFound: true };
    }

    // 2. Fetch blogs for this category
    const blogsRes = await axios.get(`${BASE_URL}website/blog?category_id=${category.id}`);

    return {
      props: {
        initialCategory: category,
        initialBlogs: blogsRes.data?.data || [],
      },
    };
  } catch (err) {
    if (err.response?.status === 404) {
      return { notFound: true };
    }
    console.error("Error in Category getServerSideProps:", err);
    return { notFound: true };
  }
}

export default CategoryDetails;
