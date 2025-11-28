"use client";

import { useRouter } from "next/navigation";
import styles from "./BlogControls.module.css";

interface BlogControlsProps {
    itemsPerPage: number;
    totalPosts: number;
    startPost: number;
    endPost: number;
}

const BlogControls = ({ itemsPerPage, totalPosts, startPost, endPost }: BlogControlsProps) => {
    const router = useRouter();

    const handlePerPageChange = (newPerPage: number) => {
        const params = new URLSearchParams();
        // Reset to page 1 when changing items per page
        if (newPerPage !== 6) {
            params.set('perPage', newPerPage.toString());
        }
        const queryString = params.toString();
        router.push(`/blog${queryString ? `?${queryString}` : ''}`);
    };

    return (
        <div className={styles.controls}>
            <div className={styles.perPageSelector}>
                <label htmlFor="perPage" className={styles.perPageLabel}>
                    Show:
                </label>
                <select
                    id="perPage"
                    className={styles.perPageSelect}
                    value={itemsPerPage}
                    onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
                >
                    <option value="3">3 posts</option>
                    <option value="6">6 posts</option>
                    <option value="9">9 posts</option>
                </select>
            </div>
            <div className={styles.resultCount}>
                Showing {startPost}-{endPost} of {totalPosts} posts
            </div>
        </div>
    );
};

export default BlogControls;
