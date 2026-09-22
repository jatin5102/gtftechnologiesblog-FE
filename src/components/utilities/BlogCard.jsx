import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Heading from './Heading'
import Pera from './Pera'
import { BlogContent } from './BlogContent'
import CustomImage from './CustomImage'

const BlogCard = ({ data, detailsPage }) => {
  const {heading,short_description,feature_image,mb_image,alt, tags="GTF Blog",date_at,description,slug} = data;
  const titleLimit = 8;
  const peraLimit = 30;
  const BASE_URL =process.env.NEXT_PUBLIC_API_BASE_URL;

  
  // Limit title to 10 words
  const limitedTitle = (heading || "")
    .split(' ')
    .slice(0, titleLimit)
    .join(' ') + (heading.split(' ').length > titleLimit ? '...' : '');

   // Limit to 100 words
   const limitedDescription = (short_description || "")
   .split(' ')
   .slice(0, peraLimit)
   .join(' ') + (description.split(' ').length > peraLimit ? '...' : '');
  return (
    <div className="overflow-hidden transition-shadow duration-300">
      {/* Image Section */}
      <div data-aos="fade-up" className={`relative w-full`} style={{ height: detailsPage ? '400px' : '12rem' }}>
                      <CustomImage
                        src={`${BASE_URL}${feature_image}`}
                        mobileSrc={`${BASE_URL}${mb_image}`}
                        alt={alt || heading || "Blog image"}
                        className="object-cover rounded-[10px] w-full h-full"
                      />
      </div>

      {/* Content Section */}
      <div className="mt-4">
        {/* Title and Date Row */}
        <div className="flex justify-between items-center mb-3">
          <h3 data-aos="fade-right" className="bg-primary text-white rounded-5 py-7 px-15 text-12">{tags || "Interior Design"}</h3>
          <span data-aos="fade-left" className="text-12 text-black">{date_at}</span>
        </div>
         <Heading animation='fade-up' className='text-left md:text-18 my-20'>{detailsPage ? heading : limitedTitle}</Heading>
        <Pera className='mb-20 text-justify'>{detailsPage ? short_description : limitedDescription}</Pera>
        {/* Description */}
        {detailsPage && <BlogContent html={description}/> }
        

        {/* View Details Button */}
        {!detailsPage && (
        <Link 
          data-aos="fade-right"
          href={`/blog/${slug}`}
          className="inline-block pb-10 text-[var(--text-primary)] transition-all border-b"
        >
          View Details <Image src="/assets/icons/next-arrow.webp" alt='next arrow' width={20} height={0} className='h-auto inline-block ml-5'/>
        </Link>
        )}
      </div>
    </div>
  )
}

export default BlogCard
