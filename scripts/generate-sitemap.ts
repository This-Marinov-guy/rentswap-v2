import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

interface WordPressPost {
  ID: number;
  slug: string;
  modified: string;
}

interface WordPressPostResponse {
  found: number;
  posts: WordPressPost[];
}

const WORDPRESS_BLOG_ID = process.env.WORDPRESS_BLOG_ID;
const BASE_URL = 'https://public-api.wordpress.com/rest/v1.1/sites';

async function getPosts(
  page: number = 1,
  number: number = 100
): Promise<WordPressPostResponse> {
  if (!WORDPRESS_BLOG_ID) {
    throw new Error('WORDPRESS_BLOG_ID is not defined');
  }

  const res = await fetch(
    `${BASE_URL}/${WORDPRESS_BLOG_ID}/posts?page=${page}&number=${number}&fields=ID,slug,modified`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  return res.json();
}

async function generateSitemap() {
  const baseUrl = 'https://rentswap.com';
  const currentDate = new Date().toISOString();

  console.log('🚀 Starting sitemap generation...');

  // Static routes
  const staticRoutes = [
    { url: baseUrl, priority: '1.0', changefreq: 'daily' },
    { url: `${baseUrl}/pricing`, priority: '0.8', changefreq: 'weekly' },
    { url: `${baseUrl}/resources`, priority: '0.8', changefreq: 'weekly' },
    { url: `${baseUrl}/faq`, priority: '0.7', changefreq: 'monthly' },
    { url: `${baseUrl}/terms-conditions`, priority: '0.5', changefreq: 'monthly' },
    { url: `${baseUrl}/privacy-policy`, priority: '0.5', changefreq: 'monthly' },
    { url: `${baseUrl}/sign-up`, priority: '0.9', changefreq: 'weekly' },
    { url: `${baseUrl}/blog`, priority: '0.9', changefreq: 'daily' },
  ];

  // Fetch all blog posts
  let allPosts: WordPressPost[] = [];
  let page = 1;
  let hasMore = true;

  console.log('📝 Fetching blog posts from WordPress...');

  try {
    while (hasMore) {
      const { posts, found } = await getPosts(page, 100);
      allPosts = [...allPosts, ...posts];
      console.log(`   Fetched ${allPosts.length} of ${found} posts...`);

      hasMore = allPosts.length < found;
      page++;
    }

    console.log(`✅ Fetched ${allPosts.length} blog posts`);

    // Build XML sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static routes
    staticRoutes.forEach((route) => {
      xml += '  <url>\n';
      xml += `    <loc>${route.url}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    // Add blog post routes
    allPosts.forEach((post) => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(post.modified).toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    // Write sitemap to public folder
    const publicDir = path.resolve(__dirname, '../public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');

    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(sitemapPath, xml, 'utf-8');

    // Also save a timestamped copy for backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupPath = path.join(publicDir, `sitemap-${timestamp}.xml`);
    fs.writeFileSync(backupPath, xml, 'utf-8');

    console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
    console.log(`💾 Backup saved at ${backupPath}`);
    console.log(`📊 Total URLs: ${staticRoutes.length + allPosts.length}`);
    console.log(`   - Static routes: ${staticRoutes.length}`);
    console.log(`   - Blog posts: ${allPosts.length}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
