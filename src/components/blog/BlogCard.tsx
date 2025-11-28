import Link from "next/link";
import Image from "next/image";
import { WordPressPost } from "@/lib/wordpress";
import styles from "./BlogCard.module.css";

interface BlogCardProps {
    post: WordPressPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
    const date = new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });

    return (
        <Link href={`/blog/${post.slug}`} className={styles.card}>
            <div className={styles.imageContainer}>
                <Image
                    src={post.post_thumbnail?.URL || "/assets/images/common/blog-thumbnail.jpg"}
                    alt={post.title}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className={styles.content}>
                <div className={styles.meta}>
                    {Object.values(post.categories).length > 0 &&
                     Object.values(post.categories)[0].name !== 'Uncategorized' && (
                        <span className={styles.category}>
                            {Object.values(post.categories)[0].name}
                        </span>
                    )}
                    <span className={styles.date} suppressHydrationWarning>
                        {date}
                    </span>
                </div>
                <h3
                    className={styles.title}
                    dangerouslySetInnerHTML={{ __html: post.title }}
                />
                <div
                    className={styles.excerpt}
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
                <span className={styles.readMore}>
                    Read article
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
            </div>
        </Link>
    );
};

export default BlogCard;
