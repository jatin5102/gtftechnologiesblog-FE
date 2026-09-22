"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";

import useIsMobile from "./utilities/useIsMobile";

const Hero = ({
    video = false,
    imageSrc = "/assets/images/about-us/desktop/banner.webp",
    mobileSrc = "imageSrc = '/assets/images/about-us/mobile/banner.webp'",
    title,
    parent,
}) => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const handleUnmute = () => {
        if (videoRef.current) {
            const newMuted = !isMuted;
            videoRef.current.muted = newMuted;
            videoRef.current.play();
            setIsMuted(newMuted);
        }
    };
    const isMobile = useIsMobile();

    return (
        <section
            className="relative w-full h-[100vh] md:h-screen overflow-hidden"
            aria-label="Background media showing Liv Interio interiors"
            role="img"
        >
            {video ? (
                <>
                    <video
                        ref={videoRef}
                        className=" absolute top-0 left-0 w-full h-full object-cover"
                        src={
                            isMobile
                                ? "/assets/videos/Livinterio-mobile.mp4"
                                : "/assets/videos/Livinterio-desktop.mp4"
                        }
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                    />
                    <button
                        className="z-51 absolute right-[25px] bottom-[25px]"
                        onClick={handleUnmute}
                    >
                        <Image
                            src={
                                isMuted
                                    ? "/assets/icons/mute.webp"
                                    : "/assets/icons/volume.webp"
                            }
                            alt="Sound Icon"
                            width={20}
                            height={20}
                        />
                    </button>
                </>
            ) : (
                <>

                    <section className="breadcrumb-banner">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="page-heading">
                                        <h1>{title}</h1>

                                        <ul>
                                            <li><a href=""><i className='fa fa-angle-left'></i></a></li>
                                            <li><a href="">Home</a></li>
                                            <li><a href=""><i className='fa fa-angle-left'></i></a></li>
                                            <li><a href="">{title}</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="container">
                            <div className="col-sm-12">
                                <div className="bread-banner">
                                    <img src="/assets/frontend/images/breadcrumb.jpg" width="100%" alt="Blogs Image" />
                                </div>
                            </div>
                        </div>
                    </section>



                </>
            )}


        </section>
    );
};

export default Hero;