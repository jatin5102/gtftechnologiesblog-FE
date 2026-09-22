import axios from "axios";
import { SITE_URL } from "@/lib/urls";

// Helper to escape XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function formatDate(dateString) {
  if (!dateString) return new Date().toISOString();
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function generateSiteMap({ baseUrl, categories = [], blogs = [] }) {
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  // Filter valid categories and blogs
  const validCategories = categories.filter((cat) => cat && cat.slug);
  const validBlogs = blogs.filter((blog) => blog && blog.slug);

  // Create a lookup map for category ID -> category slug
  const categoryMap = new Map();
  validCategories.forEach((cat) => {
    if (cat.id && cat.slug) {
      categoryMap.set(cat.id, cat.slug);
      categoryMap.set(String(cat.id), cat.slug);
    }
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Home Page -->
  <url>
    <loc>${escapeXml(cleanBaseUrl)}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${validCategories
    .map((cat) => {
      const catUrl = `${cleanBaseUrl}/${cat.slug}/`;
      const lastMod = formatDate(cat.updated_at || cat.created_at);
      return `
  <!-- Category: ${escapeXml(cat.name || cat.slug)} -->
  <url>
    <loc>${escapeXml(catUrl)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join("")}
  ${validBlogs
    .map((blog) => {
      let catSlug = blog.category?.slug;
      if (!catSlug && blog.category_id) {
        catSlug = categoryMap.get(blog.category_id);
      }
      if (!catSlug && blog.category && (typeof blog.category === "string" || typeof blog.category === "number")) {
        catSlug = categoryMap.get(blog.category);
      }
      if (!catSlug || !blog.slug) return "";

      const blogUrl = `${cleanBaseUrl}/${catSlug}/${blog.slug}/`;
      const lastMod = formatDate(
        blog.updated_at || blog.created_at || blog.date_at
      );
      return `
  <!-- ${escapeXml(blog.heading || blog.slug)} -->
  <url>
    <loc>${escapeXml(blogUrl)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .join("")}
</urlset>`;
}

function SiteMap() {
  // getServerSideProps handles the XML response directly
  return null;
}

export async function getServerSideProps({ res }) {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-blog.gtftechnologies.com/api/v1/";
  // Same origin the canonical tags use, so the sitemap can't disagree with them
  const siteBaseUrl = process.env.NEXT_BASE_URL || SITE_URL;

  let categories = [];
  let blogs = [];

  try {
    const [categoriesRes, blogsRes] = await Promise.all([
      axios.get(`${apiBaseUrl}website/blog-category?limit=200`),
      axios.get(`${apiBaseUrl}website/blog?limit=1000`),
    ]);

    categories = categoriesRes?.data?.data || [];
    blogs = blogsRes?.data?.data || [];
  } catch (error) {
    console.error("Error fetching data for sitemap:", error.message);
  }

  const sitemap = generateSiteMap({
    baseUrl: siteBaseUrl,
    categories,
    blogs,
  });

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  // Cache for 6 hours, stale-while-revalidate for 24 hours
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=21600, stale-while-revalidate=86400"
  );
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
