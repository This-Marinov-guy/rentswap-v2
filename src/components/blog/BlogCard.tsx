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
                {post.post_thumbnail ? (
                    <Image
                        src={post.post_thumbnail.URL}
                        alt={post.title}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className={styles.placeholderImage} />
                )}
            </div>
            <div className={styles.content}>
                <div className={styles.meta}>
                    <span className={styles.date} suppressHydrationWarning>
                        {date}
                    </span>
                    {Object.values(post.categories).length > 0 && (
                        <span className={styles.category}>
                            {Object.values(post.categories)[0].name}
                        </span>
                    )}
                </div>
                <h3
                    className={styles.title}
                    dangerouslySetInnerHTML={{ __html: post.title }}
                />
                <div
                    className={styles.excerpt}
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
                <span className={styles.readMore}>Read more &rarr;</span>
            </div>
        </Link>
    );
};

export default BlogCard;
