import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import CustomTable from '@/components/utilities/admin/CustomTable';
import TableBody from '@/components/utilities/admin/TableBody';
import TableData from '@/components/utilities/admin/TableData';
import TableHead from '@/components/utilities/admin/TableHead';
import TableHeader from '@/components/utilities/admin/TableHeader';
import TableRow from '@/components/utilities/admin/TableRow';
import Container from '@/components/utilities/Container';
import Heading from '@/components/utilities/Heading';
import Image from 'next/image';
import Link from 'next/link';
import withAuth from '@/login/withAuth';
import axiosAdmin from '@/login/axiosAdmin';
import { toast } from 'react-hot-toast';
import Pagination from '@/components/utilities/Pagination';
import Section from '@/components/utilities/Section';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { useRouter } from 'next/router';
const BlogFaq = () => {
  const [pagedata, setPageData] = useState([]);

  const [toc, setToc] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [savingId, setSavingId] = useState(null);
  const limit = 50;
  const Thead = ['Seq', 'Name', 'Action'];
  const API_ADMIN_URL = process.env.NEXT_PUBLIC_API_ADMIN_URL;
  const router = useRouter();
  const { blog_id } = router.query;
  const fetchTOC = async (page = 1) => {
    try {
      if (!blog_id) {
        toast.error('Blog ID is required');
        return;
      }

      const res = await axiosAdmin.get(
        `${API_ADMIN_URL}blog-faq?blog_id=${blog_id}&page=${page}&limit=${limit}`
      );

      const data = res.data;
      const rawList = data.data || [];
      const listWithSort = rawList.map((item, index) => {
        const initial = item.sort ?? item.seq ?? item.sequence ?? (index + 1);
        return {
          ...item,
          sort: initial,
          originalSort: initial,
        };
      });
      const sortedList = [...listWithSort].sort((a, b) => Number(a.sort) - Number(b.sort));
      setToc(sortedList);
      setCurrentPage(data.pagination?.page || 1);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch FAQs');
    }
  };

  const fetchPageData = async (blog_id) => {
    try {
      const res = await axiosAdmin.get(`${API_ADMIN_URL}blog/${blog_id}`);
      if (res.data && res.data.data) {
        setPageData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch blog details:", error);
    }
  };

  const handleSeqChange = (id, newSort) => {
    setToc((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, sort: newSort } : item
      )
    );
  };

  const handleSaveSingleSort = async (faq, newSort) => {
    const sortValue = Number(newSort);
    if (isNaN(sortValue) || sortValue < 1) {
      toast.error('Please enter a valid sequence number');
      return;
    }

    if (Number(faq.originalSort) === sortValue) {
      return;
    }

    setSavingId(faq.id);
    try {
      const res = await axiosAdmin.post(
        `${API_ADMIN_URL}blog-faq/sort-faq/${faq.id}`,
        { sort: sortValue }
      );

      if (res && (res.data?.status || res.status === 200)) {
        toast.success(res.data?.message || 'Sequence updated successfully');
        fetchTOC(currentPage);
      } else {
        toast.error(res?.data?.message || 'Failed to update sequence');
      }
    } catch (err) {
      console.error('Failed to update FAQ sequence:', err);
      toast.error(err.response?.data?.message || 'Failed to update sequence');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const res = await axiosAdmin.delete(
        `${API_ADMIN_URL}blog-faq/${id}`
      );
      if (res.data.status) {
        toast.success('FAQ deleted successfully');
        fetchTOC(currentPage);
      } else {
        toast.error('Failed to delete FAQ');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };


  useEffect(() => {
    if (router.isReady && blog_id) {
      fetchTOC(currentPage);
      fetchPageData(blog_id)
    }
  }, [currentPage, blog_id, router.isReady]);

  return (
    <>
      <AdminHeader />
      <Section className="!py-[30px]">
        <Container>
          <div className="shadow-sm">
            <div className="flex items-center justify-between px-[30px] py-[20px] border-b border-[var(--text-primary)]">
              <Link href={`/admin/blogs`}>Back </Link>
              <Link
                href={`/admin/faq/add?blog_id=${blog_id}`}
                className="bg-[var(--text-primary)] text-white px-[30px] py-[10px] rounded-[5px] hover:bg-[var(--text-primary-hover)]"
              >
                Add Faq
              </Link>
            </div>

            <div className="bg-white p-[40px]">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h4>Faq's {pagedata?.heading ? <span className="text-sm font-normal text-gray-500">({pagedata.heading})</span> : ''}</h4>
              </div>

              <div className="mt-[30px] overflow-auto">
                <CustomTable>
                  <TableHead>
                    <TableRow>
                      {Thead.map((item, index) => (
                        <TableHeader key={index} className={item === 'Seq' ? 'w-[120px]' : undefined}>
                          {item}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {toc.length > 0 ? (
                      toc.map((blog, index) => {
                        const currentSeq =
                          blog.sort !== undefined && blog.sort !== null && blog.sort !== ''
                            ? blog.sort
                            : index + 1;

                        return (
                          <TableRow key={blog.id || blog._id || index}>
                            <TableData className="w-[120px]">
                              <div className="relative inline-flex items-center justify-center">
                                <input
                                  type="number"
                                  min="1"
                                  disabled={savingId === blog.id}
                                  value={currentSeq}
                                  onChange={(e) => handleSeqChange(blog.id, e.target.value)}
                                  onBlur={(e) => {
                                    if (e.target.value !== '') {
                                      handleSaveSingleSort(blog, e.target.value);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.target.blur();
                                    }
                                  }}
                                  className="w-[70px] mx-auto text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)] disabled:bg-gray-100 disabled:opacity-60"
                                />
                                {savingId === blog.id && (
                                  <span className="absolute -right-5 top-1/2 -translate-y-1/2 flex items-center" title="Saving...">
                                    <svg className="animate-spin h-3.5 w-3.5 text-[var(--text-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                  </span>
                                )}
                              </div>
                            </TableData>

                            <TableData heading={blog.question && blog.question.length > 110 ? blog.question : undefined}>
                              {blog.question && blog.question.length > 110
                                ? `${blog.question.slice(0, 110)}...`
                                : blog.question}
                            </TableData>

                            <TableData>
                              <div className="w-full flex items-center justify-center gap-[10px]">
                                <Link
                                  href={`/admin/faq/edit/?id=${blog.id}`}
                                  className="hover:bg-[#ecebeb] inline-block  p-[10px] rounded-[5px]"
                                >
                                  <Image
                                    src="/assets/icons/edit.webp"
                                    alt="Edit icon"
                                    width={20}
                                    height={20}
                                  />
                                </Link>
                                <button
                                  onClick={() => handleDelete(blog.id)}
                                  className="hover:bg-[#ecebeb] p-[10px] rounded-[5px]"
                                >
                                  <Image
                                    src="/assets/icons/delete.webp"
                                    alt="Delete Icon "
                                    width={20}
                                    height={20}
                                  />
                                </button>
                              </div>
                            </TableData>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableData colSpan={Thead.length} className="text-center">
                          No Record found.
                        </TableData>
                      </TableRow>
                    )}
                  </TableBody>
                </CustomTable>

                {totalPages > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Lightbox Viewer */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={[{ src: lightboxImage }]}
        plugins={[Zoom]}
        carousel={{ finite: true }}
      />
    </>
  );
};

export default withAuth(BlogFaq);
