import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../../blog/[slug]/page.module.css";
import Button from "@/components/common/Button";

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

  // Calculate "X days ago"
  const postDate = new Date(post.date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - postDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const daysAgo = diffDays === 0 ? "Today" : diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;

  // Calculate reading time (average reading speed: 200 words per minute)
  const contentText = post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = contentText.split(' ').filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);
  const readingTimeText = readingTime === 1 ? "1 min read" : `${readingTime} min read`;

  // Clean content - remove duplicate titles (h1, h2 at the start)
  let cleanedContent = post.content;
  if (cleanedContent) {
    // Get plain text title for comparison
    const titleText = post.title.replace(/<[^>]*>/g, '').trim();
    
    // Remove h1/h2 tags that match the post title (likely duplicates)
    // Match h1 or h2 tags with the title text (case-insensitive, with optional whitespace)
    const escapedTitle = titleText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const titleRegex = new RegExp(
      `<h[12][^>]*>\\s*${escapedTitle}\\s*</h[12]>`,
      'gi'
    );
    cleanedContent = cleanedContent.replace(titleRegex, '');
    
    // Also remove any h1/h2 at the very beginning of content (first element)
    cleanedContent = cleanedContent.replace(/^\s*(<h[12][^>]*>.*?<\/h[12]>)\s*/i, '');
    
    // Remove h1/h2 wrapped in p tags at the start
    cleanedContent = cleanedContent.replace(/^\s*<p[^>]*>\s*(<h[12][^>]*>.*?<\/h[12]>)\s*<\/p>\s*/i, '');
  }

  // Get category name
  const categoryName = Object.values(post.categories).length > 0 &&
    Object.values(post.categories)[0].name !== 'Uncategorized'
    ? Object.values(post.categories)[0].name
    : null;

  return (
    <main>
      <Header />
      <div className={styles.container}>
        <Button variant="secondary" href="/blog" className={styles.backLink}>
          &larr; Back to Blog
        </Button>

        <article className={styles.article}>
          <header className={styles.header}>
            <h1
              className={styles.title + " highlight"}
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
            <div className={styles.dateMeta}>
              <span className={styles.date} suppressHydrationWarning>
                {date}
              </span>
            </div>
            <div className={styles.meta}>
              {categoryName && (
                <>
                  <span className={styles.category}>{categoryName}</span>
                </>
              )}
              {/* <span className={styles.daysAgo}>
                {daysAgo}
              </span>
              <span className={styles.readingTime}>
                {readingTimeText}
              </span> */}
            </div>
          </header>

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: cleanedContent }}
          />
        </article>
      </div>
      <Footer />
    </main>
  );
}



