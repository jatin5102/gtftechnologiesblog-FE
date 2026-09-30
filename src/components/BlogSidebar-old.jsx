import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import WebsiteInputFields from "./WebsiteInputFields";
import { blogPath } from "@/lib/urls";

const BlogSidebar = ({ filtercategories, data, checkCategories, handleCategoryToggle, filter, sectionRef }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const sentinelRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        // Re-attach scroll listener whenever sectionRef becomes available
        const handleScroll = () => {
            const sentinel = sentinelRef.current;
            const form = formRef.current;
            const section = sectionRef?.current;

            if (!sentinel || !section || !form) return;

            const sentinelRect = sentinel.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();
            const formHeight = form.offsetHeight;

            const topPassed = sentinelRect.top <= 0;
            const bottomReached = sectionRect.bottom <= formHeight + 32;

            setIsSticky(topPassed && !bottomReached);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Run once immediately in case already scrolled
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [sectionRef]); // re-runs when sectionRef is ready

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        await axios.post(
            `https://api2.gtftech.com/AjaxHelper/AgentInstantQuerySetter.aspx?qAgentID=4587&qSenderName=${data.name}&qMobileNo=${data.phone}&qQueryMessage=${data.message}&qProjectName=GTF BLOG&qEmailID=${data.email}`,
        );
        toast.success('Form Submitted successfully!');
        reset();
        setIsSubmitting(false);
    };

    const fields = [
        { label: '', name: 'name', placeholder: 'Enter Name', col: 'md:col-span-12 lg:col-span-12' },
        { label: '', name: 'email', placeholder: 'Enter Email', col: 'md:col-span-12 lg:col-span-12', type: 'text' },
        { label: '', name: 'phone', placeholder: 'Enter Phone', col: 'md:col-span-12 lg:col-span-12', type: 'text' },
        { label: '', name: 'message', placeholder: 'Enter Message', col: 'md:col-span-12 lg:col-span-12', type: 'text' },
    ];

    const blogs = data || [];

    return (
        <>
            <div id="accordion">
                {filter && (
                    <div id="accordion" role="tablist" aria-multiselectable="true">
                        <div className="card">
                            <div className="card-header" role="tab" id="accordionHeadingOne">
                                <div className="mb-0 row">
                                    <div className="col-12 no-padding accordion-head">
                                        <a data-toggle="collapse" data-parent="#accordion" href="#accordionBodyOne"
                                            aria-expanded="false" aria-controls="accordionBodyOne" className="collapsed">
                                            <i className="fa fa-angle-down" aria-hidden="true"></i>
                                            <h5>Categories</h5>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div id="accordionBodyOne" className="collapse show visible" role="tabpanel"
                                aria-labelledby="accordionHeadingOne" aria-expanded="false" data-parent="accordion">
                                <div className="card-block col-12">
                                    <form>
                                        {filtercategories && filtercategories.map((item, index) => {
                                            const inputId = `cat-${item.id ?? index}`;
                                            return (
                                                <React.Fragment key={item.id ?? index}>
                                                    <input
                                                        type="checkbox"
                                                        id={inputId}
                                                        name="categories"
                                                        value={item.id}
                                                        checked={checkCategories ? checkCategories.includes(item.id) : false}
                                                        onChange={() => handleCategoryToggle && handleCategoryToggle(item.id)}
                                                    />
                                                    <label htmlFor={inputId}> {item.name}</label><br />
                                                </React.Fragment>
                                            );
                                        })}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="gap"></div>

                {blogs.length > 0 && (
                    <div id="accordion-popular" role="tablist" aria-multiselectable="true">
                        <div className="card">
                            <div className="card-header" role="tab" id="accordionHeadingTwo">
                                <div className="mb-0 row">
                                    <div className="col-12 no-padding accordion-head">
                                        <a data-toggle="collapse" data-parent="#accordion-popular" href="#accordionBodyTwo"
                                            aria-expanded="false" aria-controls="accordionBodyTwo" className="collapsed">
                                            <i className="fa fa-angle-down" aria-hidden="true"></i>
                                            <h5>Popular Posts</h5>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div id="accordionBodyTwo" className="collapse show visible" role="tabpanel"
                                aria-labelledby="accordionHeadingTwo" aria-expanded="false" data-parent="accordion-popular">
                                <div className="card-block col-12">
                                    <ul>
                                        {blogs.map((blogitem, index) => {
                                            // Skip posts missing a category or slug instead of
                                            // linking to /undefined/... — `category` can be absent
                                            // on the popular-posts payload.
                                            const href = blogPath(blogitem?.category?.slug, blogitem?.slug);
                                            if (!href) return null;
                                            return (
                                                <li key={blogitem?.id ?? index}>
                                                    <Link className="text-capitalize" href={href}>
                                                        {blogitem.heading}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="gap"></div>

                {/* ✅ Sentinel is now a SEPARATE div above the form, not wrapping it */}
                <div ref={sentinelRef} style={{ height: "1px" }} />

                {/* ✅ Form is outside sentinel */}
                <div className={`form-box ${isSticky ? "form-sticky" : ""}`} ref={formRef}>
                    <h4>Get in Touch</h4>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="">
                            {fields.map((field) => (
                                <WebsiteInputFields
                                    key={field.name}
                                    {...field}
                                    register={register}
                                    placeholder={field.placeholder}
                                    error={errors[field.name]}
                                />
                            ))}
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Submit...' : 'Submit'}
                        </button>
                    </form>
                </div>

            </div>
        </>
    );
};

export default BlogSidebar;