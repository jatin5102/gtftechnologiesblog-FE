import Image from "next/image";
import React from "react";
import Heading from "./Heading";
import Link from "next/link";
import { blogPath } from "@/lib/urls";

const Card = ({ data, catSlug }) => {

  const changeDateFormate = (dateString) => {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric"
    });
    return formatted;
  }

  if (!data) return null;

  const finalCatSlug = data?.category?.slug || catSlug;
  // null when either slug is missing, so we never render /undefined/undefined/
  const href = blogPath(finalCatSlug, data?.slug);

  const content = (
    <div className=" inner-smb ">
      <img src={data.feature_image} width="100%" alt={data.heading || "Blog image"} />
      <div className="content">
        <span className="catogories two-line-text mb-0">{data.heading}</span>
        <p className="main-text two-line-text">{data.short_description}</p>
        <p className="btn-action">
          <span className="calander d-flex align-items-center">
            <img src="/assets/frontend/images/check-mark.png" width="16px" alt="check" /> {changeDateFormate(data.date_at)}
          </span>

          <span className="link-arrow"><img src="/assets/frontend/images/right-ar.png" width="16px" alt="arrow" /> </span>

        </p>
      </div>
    </div >
  );

  // Render the card unlinked rather than pointing crawlers at a broken URL
  if (!href) return <div className="card-link">{content}</div>;

  return (
    <Link href={href} className="card-link">
      {content}
    </Link>
  );
};

export default Card;
