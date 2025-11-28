import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

// Generate static params for the first 20 posts
export async function generateStaticParams() {
  try {
    const { posts } = await getPosts(1, 20);
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    return {
      title: `${post.title} - RentSwap Blog`,
      description: post.excerpt.replace(/<[^>]*>/g, "").slice(0, 160),
    };
  } catch (error) {
    console.error("Error generating metadata for blog post:", error);
    return {
      title: "Blog Post Not Found - RentSwap",
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let post;
  try {
    const { slug } = await params;
    post = await getPostBySlug(slug);
  } catch (error) {
    console.error("Error fetching blog post:", error);
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
            <h2
              className={'highlight'}
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
            <div className={styles.meta}>
              <span className={styles.date} suppressHydrationWarning>
                {date}
              </span>
              {Object.values(post.categories).length > 0 &&
                Object.values(post.categories)[0].name !== 'Uncategorized' && (
                <>
                  <span className={styles.separator}>•</span>
                  <span className={styles.category}>
                    {Object.values(post.categories)[0].name}
                  </span>
                </>
              )}
            </div>
          </header>

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
