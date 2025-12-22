import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/wordpress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
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
    
    // Clean title and description
    const cleanTitle = post.title.replace(/<[^>]*>/g, "").trim();
    const cleanExcerpt = post.excerpt.replace(/<[^>]*>/g, "").trim();
    const description = cleanExcerpt.slice(0, 160) || `${cleanTitle} - RentSwap Blog`;
    
    // Get category and tags for keywords
    const categories = Object.values(post.categories || {})
      .map((cat) => cat.name)
      .filter((name) => name !== "Uncategorized");
    const tags = Object.values(post.tags || {}).map((tag) => tag.name);
    const keywords = [...categories, ...tags, "rentswap", "rental", "housing", "netherlands"].join(", ");
    
    // Get featured image or post thumbnail
    const imageUrl = post.post_thumbnail?.URL || post.featured_image || "https://rentswap.nl/android-chrome-512x512.png";
    const imageWidth = post.post_thumbnail?.width || 1200;
    const imageHeight = post.post_thumbnail?.height || 630;
    
    // Build canonical URL
    const canonicalUrl = `https://rentswap.nl/blog/${slug}`;
    
    // Format dates
    const publishedTime = new Date(post.date).toISOString();
    const modifiedTime = new Date(post.modified || post.date).toISOString();
    
    // Get author info
    const authorName = post.author?.name || "RentSwap";
    
    return {
      title: `${cleanTitle} - RentSwap Blog`,
      description,
      keywords,
      authors: [{ name: authorName }],
      creator: authorName,
      publisher: "RentSwap",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL("https://rentswap.nl"),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "article",
        locale: "en_US",
        url: canonicalUrl,
        siteName: "RentSwap",
        title: cleanTitle,
        description,
        publishedTime,
        modifiedTime,
        authors: [authorName],
        tags: tags.length > 0 ? tags : undefined,
        images: [
          {
            url: imageUrl,
            width: imageWidth,
            height: imageHeight,
            alt: cleanTitle,
            type: post.post_thumbnail?.mime_type || "image/png",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: cleanTitle,
        description,
        images: [imageUrl],
        creator: "@rentswap",
        site: "@rentswap",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      other: {
        "article:published_time": publishedTime,
        "article:modified_time": modifiedTime,
        "article:author": authorName,
        "article:section": categories[0] || "Blog",
        ...(tags.length > 0 && { "article:tag": tags.join(", ") }),
      },
    };
  } catch (error) {
    console.error("Error generating metadata for blog post:", error);
    return {
      title: "Blog Post Not Found - RentSwap",
      description: "The blog post you're looking for could not be found.",
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

  // Calculate reading time (average reading speed: 200 words per minute)
  const contentText = post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = contentText.split(' ').filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

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

  // Prepare structured data for Article
  const cleanTitle = post.title.replace(/<[^>]*>/g, "").trim();
  const cleanExcerpt = post.excerpt.replace(/<[^>]*>/g, "").trim();
  const imageUrl = post.post_thumbnail?.URL || post.featured_image || "https://rentswap.nl/android-chrome-512x512.png";
  const authorName = post.author?.name || "RentSwap";
  const categories = Object.values(post.categories || {})
    .map((cat) => cat.name)
    .filter((name) => name !== "Uncategorized");
  const tags = Object.values(post.tags || {}).map((tag) => tag.name);
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: cleanTitle,
    description: cleanExcerpt || cleanTitle,
    image: imageUrl,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.modified || post.date).toISOString(),
    author: {
      "@type": "Person",
      name: authorName,
      url: post.author?.profile_URL || "https://rentswap.nl",
    },
    publisher: {
      "@type": "Organization",
      name: "RentSwap",
      logo: {
        "@type": "ImageObject",
        url: "https://rentswap.nl/android-chrome-512x512.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://rentswap.nl/blog/${post.slug}`,
    },
    ...(categories.length > 0 && {
      articleSection: categories[0],
    }),
    ...(tags.length > 0 && {
      keywords: tags.join(", "),
    }),
    wordCount: wordCount,
    timeRequired: `PT${readingTime}M`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://rentswap.nl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://rentswap.nl/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cleanTitle,
        item: `https://rentswap.nl/blog/${post.slug}`,
      },
    ],
  };

  return (
    <main>
      <Header />
      {/* Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
