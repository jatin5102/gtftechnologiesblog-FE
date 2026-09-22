import Link from "next/link";
import React, { useEffect, useState } from "react";

const Header = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 400) {
        if (currentScrollY < lastScrollY) {
          // Scrolling up
          setShowHeader(true);
        } else {
          // Scrolling down
          setShowHeader(false);
        }
      } else {
        // At top, don't show fixed header
        setShowHeader(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // Force cleanup on mount
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Disable scroll
      // document.body.style.overflow = 'hidden';
    } else {
      // Enable scroll
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      // Remove all active, show, and rotate classes when sidebar is closed
      if (typeof window !== "undefined") {
        const $ = window.$ || window.jQuery;
        if ($) {
          $(".sidebar a").removeClass("active");
          $(".sidebar .collapse").slideUp().removeClass("show");
          $('.sidebar a[data-toggle="collapse"] .arrow').removeClass("rotate");
        }
      }
    }

    // Clean up on component unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const initSidebar = async () => {
      if (typeof window === "undefined") return;

      const $ = (await import("jquery")).default;
      window.jQuery = $;
      window.$ = $;

      $('.sidebar a[data-toggle="collapse"]')
        .off("click")
        .on("click", function (e) {
          e.preventDefault();
          const targetSelector = $(this).attr("href");
          const $target = $(targetSelector);

          // Accordion behavior: Close other open menus
          $(".sidebar .collapse")
            .not($target)
            .not($(this).parents(".collapse"))
            .slideUp()
            .removeClass("show");
          $('.sidebar a[data-toggle="collapse"] .arrow')
            .not($(this).find(".arrow"))
            .not(
              $(this)
                .parents(".collapse")
                .prevAll('a[data-toggle="collapse"]')
                .find(".arrow"),
            )
            .removeClass("rotate");

          // Toggle current menu
          $target.slideToggle().toggleClass("show");
          $(this).find(".arrow").toggleClass("rotate");

          // Active class handling
          $(".sidebar a").removeClass("active");
          $('.sidebar a[data-toggle="collapse"]').each(function () {
            const href = $(this).attr("href");
            const $sub = $(href);
            if ($sub.hasClass("show")) {
              $(this).addClass("active");
            }
          });
        });
    };

    initSidebar();
  }, []);

  return (
    <>
      <div
        id="mySidenav"
        className={`sidenav ${isOpen ? "active" : ""}`}
        style={{ width: isOpen ? "500px" : "0" }}
      >
        <div className="inner-nav">
          <a href="https://www.gtftechnologies.com/">
            <img
              className="brand-logo"
              src="/assets/images/gtflogo-vector.svg"
              alt="GTF Logo"
            />
          </a>

          <div className="inner-menu">
            <div className="sidebar">
              <a href="https://www.gtftechnologies.com/">HOME</a>

              <a href="https://www.gtftechnologies.com/who-we-are/about-gtf">
                ABOUT US
              </a>

              <a data-toggle="collapse" href="#howWork">
                PROCESS OF WORKING
                <span className="arrow">&#8250;</span>
              </a>
              <div className="collapse submenu inner-sub" id="howWork">
                <a href="https://www.gtftechnologies.com/how-we-work/SEO_keyword_research">
                  Research
                </a>
                <a href="https://gtftechnologies.com/brand-strategy-launch">
                  Brand Strategy Launch
                </a>
                <a href="https://www.gtftechnologies.com/how-we-work/digital_media_planning">
                  Digital Media Planning
                </a>
                <a href="https://www.gtftechnologies.com/how-we-work/contentcreative">
                  Concept Content & Creative
                </a>
                <a href="https://www.gtftechnologies.com/how-we-work/data_analysis_roi">
                  Data Analysis & ROI
                </a>
              </div>

              <a data-toggle="collapse" href="#services">
                SERVICES
                <span className="arrow">&#8250;</span>
              </a>
              <div className="collapse submenu inner-sub" id="services">
                <a href="https://www.gtftechnologies.com/services/brand-strategy">
                  Brand Strategy
                </a>
                <a href="https://www.gtftechnologies.com/services/social-media-amplification">
                  Social Media Amplification
                </a>
                <a href="https://www.gtftechnologies.com/services/website-creative">
                  Website Creative
                </a>
                <a href="https://www.gtftechnologies.com/services/digital-marketing">
                  Digital Marketing
                </a>
                <a href="https://www.gtftechnologies.com/services/ai-innovation">
                  AI Innovation
                </a>
                <a href="https://www.gtftechnologies.com/services/celebrity-influencer-marketing">
                  Celebrity/Influencer Marketing
                </a>
              </div>

              <a data-toggle="collapse" href="#work">
                WORK
                <span className="arrow">&#8250;</span>
              </a>

              <div className="collapse submenu inner-sub" id="work">
                <a data-toggle="collapse" href="#portfolioSub">
                  Portfolio
                  <span className="arrow">&#8250;</span>
                </a>

                <div className="collapse submenu inner-sub" id="portfolioSub">
                  <a href="https://www.gtftechnologies.com/work/portfolio/websites_landing_pages">
                    Websites & Landing Pages
                  </a>
                  <a href="https://www.gtftechnologies.com/work/portfolio/creatives">
                    Creatives & AI Videos
                  </a>
                  <a href="https://www.gtftechnologies.com/work/portfolio/logos">
                    Logos
                  </a>
                </div>

                <a href="https://www.gtftechnologies.com/work/case_studies">
                  Case Studies
                </a>
                <a href="https://www.gtftechnologies.com/work/clients">
                  Clients
                </a>
              </div>

              <a href="https://blog.gtftechnologies.com/">BLOGS</a>

              <a data-toggle="collapse" href="#hr">
                HUMAN RESOURCE
                <span className="arrow">&#8250;</span>
              </a>
              <div className="collapse submenu inner-sub" id="hr">
                <a href="https://www.gtftechnologies.com/human-resource/work_culture">
                  Work Culture
                </a>
                <a href="https://www.gtftechnologies.com/human-resource/work_with_us">
                  Work With Us
                </a>
                <a href="https://www.gtftechnologies.com/human-resource/life_at_gtf">
                  Life At GTF Technologies
                </a>
              </div>

              <a data-toggle="collapse" href="#contact">
                CONTACT
                <span className="arrow">&#8250;</span>
              </a>
              <div className="collapse submenu inner-sub" id="contact">
                <a href="https://www.gtftechnologies.com/contact/request_quote">
                  Request For Quote
                </a>
                <a href="https://www.gtftechnologies.com/contact/say_hello">
                  Say Hello!
                </a>
              </div>
            </div>

            <div className="contact_details bottom">
              <div className="tab-content">
                <h5 className="state">
                  <a
                    className="state_url"
                    href="https://www.gtftechnologies.com/delhi-ncr"
                  >
                    {" "}
                    Delhi NCR{" "}
                  </a>
                </h5>
                <a className="num-call" href="tel:+91-9953917978">
                  +91-9953-91-7978
                </a>
              </div>

              <div className="tab-content">
                <h5 className="state">
                  <a
                    className="state_url"
                    href="https://www.gtftechnologies.com/mumbai/"
                  >
                    Mumbai
                  </a>
                </h5>
                <a className="num-call" href="tel:+91-9582532488">
                  +91-9582-53-2488
                </a>
              </div>

              <div className="tab-content">
                <h5 className="state">
                  <a
                    className="state_url"
                    href="https://www.gtftechnologies.com/pune"
                  >
                    Pune
                  </a>
                </h5>
                <a className="num-call" href="tel:+91-9953605303">
                  +91-9953-60-5303
                </a>
              </div>

              <div className="tab-content">
                <h5 className="state">
                  <a
                    className="state_url"
                    href="https://www.gtftechnologies.com/bangalore/"
                  >
                    Bangalore
                  </a>
                </h5>
                <a className="num-call" href="tel:+91-7838800248">
                  +91-7838-80-0248
                </a>
              </div>

              <div className="tab-content">
                <h5 className="state">
                  <a
                    className="state_url"
                    href="https://www.gtftechnologies.com/hyderabad/"
                  >
                    Hyderabad
                  </a>
                </h5>
                <a className="num-call" href="tel:+91-7838500356">
                  +91-7838-50-0356
                </a>
              </div>

              <div className="tab-content" id="myTabContent">
                <h5 className="state">Email</h5>
                <a className="num-call" href="mailto:hello@gtftechnologies.com">
                  hello@gtftechnologies.com
                </a>
              </div>

              <ul className="social_icons inline">
                <li>
                  <a
                    href="https://in.linkedin.com/company/gtftechnologies"
                    className="linkedin-color"
                    target="_blank"
                  >
                    in
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/gtfTechnologies"
                    className="twitter-color"
                    target="_blank"
                  >
                    tw
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/Gtftechnologiesindia/"
                    className="facebook-color"
                    target="_blank"
                  >
                    fb
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/gtf_technologies/"
                    className="instagram-color"
                    target="_blank"
                  >
                    insta
                  </a>
                </li>
                <li>
                  <a
                    href="https://in.pinterest.com/GTFTechnologies/"
                    className="pinterest-color"
                    target="_blank"
                  >
                    pi
                  </a>
                </li>
              </ul>

              <ul className="other_links">
                <li>
                  <a href="https://www.gtftechnologies.com/privacy_policy">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://gtftechnologies.com/sitemap.xml">Sitemap</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        id="mySidenavoff"
        className="sidenavoff"
        style={{ width: isOpen ? "0" : "92px" }}
      >
        <div className="inner-off">
          <div className="logo">
            <Link
              href="https://gtftechnologies.com/"
              className="cursor-pointer"
            >
              {" "}
              <img src="/assets/images/gtf-logo.svg" width="100%" alt="GTF Logo" />
            </Link>
          </div>
        </div>
      </div>
      <button
        type="button"
        id="nav-toggle"
        onClick={toggleNav}
        className={isOpen ? "active" : ""}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mySidenav"
      >
        <span></span>
      </button>
    </>
  );
};

export default Header;
