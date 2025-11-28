import { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/wordpress";
import BlogCard from "@/components/blog/BlogCard";
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
    searchParams: { page?: string };
}) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const { posts, found, meta } = await getPosts(page);
    const totalPages = Math.ceil(found / 20);

    return (
        <main>
            <Header />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={'higlight'}>RentSwap Blog</h1>
                    <p className={styles.subtitle}>
                        Everything you need to know about renting, swapping, and moving in the
                        Netherlands.
                    </p>
                </div>

                <div className={styles.grid}>
                    {posts.map((post) => (
                        <BlogCard key={post.ID} post={post} />
                    ))}
                </div>

                <div className={styles.pagination}>
                    {page > 1 ? (
                        <Link
                            href={`/blog?page=${page - 1}`}
                            className={styles.paginationButton}
                        >
                            &larr; Previous
                        </Link>
                    ) : (
                        <span className={`${styles.paginationButton} ${styles.disabled}`}>
                            &larr; Previous
                        </span>
                    )}

                    <span className={styles.pageInfo}>
                        Page {page} of {totalPages}
                    </span>

                    {meta.next_page ? (
                        <Link
                            href={`/blog?page=${page + 1}`}
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
            </div>
            <Footer />
        </main>
    );
}
