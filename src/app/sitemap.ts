import { MetadataRoute } from 'next';
import { getPosts, WordPressPost } from '@/lib/wordpress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rentswap.nl';
  const siteUpdatedAt = new Date('2026-08-10');
  const legalUpdatedAt = new Date('2025-11-28');

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: siteUpdatedAt,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: siteUpdatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: siteUpdatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: siteUpdatedAt,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: siteUpdatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/whatsapp-netherlands/housing`,
      lastModified: siteUpdatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/whatsapp-netherlands/jobs`,
      lastModified: siteUpdatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/roommate-finder`,
      lastModified: siteUpdatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: legalUpdatedAt,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: legalUpdatedAt,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Fetch all blog posts dynamically
  let allPosts: WordPressPost[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const { posts, found } = await getPosts(page, 100);
      allPosts = [...allPosts, ...posts];

      // Check if there are more posts
      hasMore = allPosts.length < found;
      page++;
    }

    // Generate only the canonical blog post routes.
    const blogRoutes: MetadataRoute.Sitemap = allPosts.map((post) => {
      // Validate and parse the date
      const modifiedDate = post.modified ? new Date(post.modified) : new Date();
      const isValidDate = !isNaN(modifiedDate.getTime());

      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: isValidDate ? modifiedDate : siteUpdatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });

    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static routes if blog fetching fails
    return staticRoutes;
  }
}
