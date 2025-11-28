import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    return {
      title: `${post.title} - RentSwap Blog`,
      description: post.excerpt.replace(/<[^>]*>/g, "").slice(0, 160),
    };
  } catch (error) {
    return {
      title: "Blog Post Not Found - RentSwap",
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  let post;
  try {
    post = await getPostBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  const date = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <main>
      <Header />
      <div className={styles.container}>
        <Link href="/blog" className={styles.backLink}>
          &larr; Back to Blog
        </Link>

        <article className={styles.article}>
          <header className={styles.header}>
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
            <h1
              className={styles.title}
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
          </header>

          {post.post_thumbnail && (
            <div className={styles.featuredImageContainer}>
              <Image
                src={post.post_thumbnail.URL}
                alt={post.title}
                fill
                className={styles.featuredImage}
                priority
                sizes="(max-width: 800px) 100vw, 800px"
              />
            </div>
          )}

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
      <Footer />
    </main>
  );
}
