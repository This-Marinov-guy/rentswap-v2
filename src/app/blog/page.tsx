import { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/wordpress";
import BlogCard from "@/components/blog/BlogCard";
import BlogControls from "@/components/blog/BlogControls";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "RentSwap Blog - Tips for Tenants and Landlords",
    description:
        "Read the latest news, tips, and guides about renting in the Netherlands. Find out how to swap your rental home easily.",
};

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; perPage?: string }>;
}) {
    const params = await searchParams;
    const page = params.page ? parseInt(params.page) : 1;
    const perPage = params.perPage ? parseInt(params.perPage) : 6;

    // Validate perPage is one of the allowed values
    const itemsPerPage = [3, 6, 9].includes(perPage) ? perPage : 6;

    const { posts, found } = await getPosts(page, itemsPerPage);
    const totalPages = Math.ceil(found / itemsPerPage);

    // Calculate the range of posts being displayed
    const startPost = (page - 1) * itemsPerPage + 1;
    const endPost = Math.min(page * itemsPerPage, found);

    // Generate page numbers to display
    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5; // Maximum page numbers to show

        if (totalPages <= maxVisible + 2) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (page > 3) {
                pages.push("...");
            }

            // Show pages around current page
            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (page < totalPages - 2) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    // Helper function to build pagination URL
    const buildPageUrl = (pageNum: number) => {
        const params = new URLSearchParams();
        if (pageNum > 1) params.set('page', pageNum.toString());
        if (itemsPerPage !== 6) params.set('perPage', itemsPerPage.toString());
        const queryString = params.toString();
        return `/blog${queryString ? `?${queryString}` : ''}`;
    };

    return (
        <main>
            <Header />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={'highlight'}>RentSwap Blog</h1>
                    <p className={styles.subtitle}>
                        Everything you need to know about renting, swapping, and moving in the
                        Netherlands.
                    </p>
                </div>

                <BlogControls
                    itemsPerPage={itemsPerPage}
                    totalPosts={found}
                    startPost={startPost}
                    endPost={endPost}
                />

                <div className={styles.grid}>
                    {posts.map((post) => (
                        <BlogCard key={post.ID} post={post} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        {page > 1 ? (
                            <Link
                                href={buildPageUrl(page - 1)}
                                className={styles.paginationButton}
                            >
                                &larr; Previous
                            </Link>
                        ) : (
                            <span className={`${styles.paginationButton} ${styles.disabled}`}>
                                &larr; Previous
                            </span>
                        )}

                        <div className={styles.pageNumbers}>
                            {pageNumbers.map((pageNum, index) => {
                                if (pageNum === "...") {
                                    return (
                                        <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                                            ...
                                        </span>
                                    );
                                }
                                return (
                                    <Link
                                        key={pageNum}
                                        href={buildPageUrl(pageNum as number)}
                                        className={`${styles.pageNumber} ${
                                            page === pageNum ? styles.activePage : ""
                                        }`}
                                    >
                                        {pageNum}
                                    </Link>
                                );
                            })}
                        </div>

                        {page < totalPages ? (
                            <Link
                                href={buildPageUrl(page + 1)}
                                className={styles.paginationButton}
                            >
                                Next &rarr;
                            </Link>
                        ) : (
                            <span className={`${styles.paginationButton} ${styles.disabled}`}>
                                Next &rarr;
                            </span>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
