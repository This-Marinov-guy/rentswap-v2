import { MetadataRoute } from 'next';
import { getPosts, WordPressPost } from '@/lib/wordpress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rentswap.nl';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog-1`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/application-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/whatsapp-netherlands`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/roommate-finder`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
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

    // Generate blog post routes (both /blog/[slug] and /post/[slug])
    const blogRoutes: MetadataRoute.Sitemap = allPosts.flatMap((post) => {
      // Validate and parse the date
      const modifiedDate = post.modified ? new Date(post.modified) : new Date();
      const isValidDate = !isNaN(modifiedDate.getTime());

      return [
        {
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: isValidDate ? modifiedDate : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        },
        {
          url: `${baseUrl}/post/${post.slug}`,
          lastModified: isValidDate ? modifiedDate : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        },
      ];
    });

    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static routes if blog fetching fails
    return staticRoutes;
  }
}
