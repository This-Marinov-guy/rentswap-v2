/**
 * Wix to WordPress Blog Migration Script
 * 
 * This script migrates blog posts from Wix (via RSS feed) to WordPress.com
 * 
 * Requirements (OAuth Method):
 * - WORDPRESS_BLOG_ID: Your WordPress.com blog ID
 * - WORDPRESS_CLIENT_ID: Your OAuth Client ID
 * - WORDPRESS_CLIENT_SECRET: Your OAuth Client Secret
 * - WORDPRESS_ACCESS_TOKEN: OAuth access token (get via OAuth flow)
 * - WORDPRESS_REDIRECT_URI: OAuth redirect URI (default: https://rentswap.nl)
 * - RSS_FEED_URL: URL to the RSS feed (default: https://www.rentswap.nl/blog-feed.xml)
 * 
 * Alternative (Application Password Method):
 * - WORDPRESS_BLOG_ID: Your WordPress.com blog ID
 * - WORDPRESS_API_TOKEN: WordPress.com Application Password
 * 
 * Usage:
 *   npm run migrate-blog
 *   or
 *   npx tsx scripts/migrate-wix-to-wordpress.ts
 */

import Parser from "rss-parser";
import * as cheerio from "cheerio";
import axios from "axios";
import * as path from "path";
import FormData from "form-data";

// Load environment variables
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const WORDPRESS_BLOG_ID = process.env.WORDPRESS_BLOG_ID;
const WORDPRESS_API_TOKEN = process.env.WORDPRESS_API_TOKEN; // Application Password (legacy)
const WORDPRESS_CLIENT_ID = process.env.WORDPRESS_CLIENT_ID;
const WORDPRESS_CLIENT_SECRET = process.env.WORDPRESS_CLIENT_SECRET;
const WORDPRESS_ACCESS_TOKEN = process.env.WORDPRESS_ACCESS_TOKEN; // OAuth access token
const WORDPRESS_REDIRECT_URI = process.env.WORDPRESS_REDIRECT_URI || "https://rentswap.nl";
const RSS_FEED_URL = process.env.RSS_FEED_URL || "https://www.rentswap.nl/blog-feed.xml";

const WORDPRESS_API_BASE = `https://public-api.wordpress.com/rest/v1.1/sites/${WORDPRESS_BLOG_ID}`;
const WORDPRESS_OAUTH_BASE = "https://public-api.wordpress.com/oauth2";

// Determine authentication method
// Allow OAuth flow if credentials are present (even without access token yet)
const HAS_OAUTH_CREDENTIALS = !!(WORDPRESS_CLIENT_ID && WORDPRESS_CLIENT_SECRET);
const USE_OAUTH = !!(HAS_OAUTH_CREDENTIALS && WORDPRESS_ACCESS_TOKEN);
const USE_BASIC_AUTH = !!(WORDPRESS_API_TOKEN);

if (!WORDPRESS_BLOG_ID) {
  console.error("❌ Missing required environment variable: WORDPRESS_BLOG_ID");
  process.exit(1);
}

// Only exit if we have no authentication method AND no OAuth credentials to start the flow
if (!USE_OAUTH && !USE_BASIC_AUTH && !HAS_OAUTH_CREDENTIALS) {
  console.error("❌ Missing authentication credentials!");
  console.error("   Either provide:");
  console.error("   - WORDPRESS_CLIENT_ID + WORDPRESS_CLIENT_SECRET (to start OAuth flow)");
  console.error("   - WORDPRESS_ACCESS_TOKEN (OAuth method - after completing OAuth flow)");
  console.error("   - WORDPRESS_API_TOKEN (Application Password method)");
  process.exit(1);
}

// Helper function to get auth headers
function getAuthHeaders() {
  if (USE_OAUTH) {
    return {
      Authorization: `Bearer ${WORDPRESS_ACCESS_TOKEN}`,
    };
  } else {
    return {}; // Basic auth is handled in axios auth config
  }
}

// Helper function to get auth config for axios
function getAuthConfig() {
  if (USE_OAUTH) {
    return {
      headers: getAuthHeaders(),
    };
  } else {
    return {
      auth: {
        username: WORDPRESS_BLOG_ID!,
        password: WORDPRESS_API_TOKEN!,
      },
    };
  }
}

// Helper function to get OAuth access token (one-time setup)
// This function helps you get an access token via OAuth flow
async function getOAuthAccessToken(): Promise<string | null> {
  if (!WORDPRESS_CLIENT_ID || !WORDPRESS_CLIENT_SECRET) {
    console.error("❌ Missing WORDPRESS_CLIENT_ID or WORDPRESS_CLIENT_SECRET");
    return null;
  }

  console.log("🔐 OAuth Authorization Flow\n");
  console.log("Step 1: Visit this URL to authorize the application:");
  console.log(
    `\n${WORDPRESS_OAUTH_BASE}/authorize?client_id=${WORDPRESS_CLIENT_ID}&redirect_uri=${encodeURIComponent(WORDPRESS_REDIRECT_URI)}&response_type=code&scope=global\n`
  );
  console.log("Step 2: After authorization, you'll be redirected to:");
  console.log(`   ${WORDPRESS_REDIRECT_URI}?code=AUTHORIZATION_CODE\n`);
  console.log("Step 3: Copy the 'code' parameter from the URL");
  console.log("Step 4: Run this script with the code as an argument:");
  console.log("   npx tsx scripts/migrate-wix-to-wordpress.ts <authorization_code>\n");

  // If code is provided as argument, exchange it for token
  const authCode = process.argv[2];
  if (authCode) {
    try {
      console.log("🔄 Exchanging authorization code for access token...\n");
      const tokenResponse = await axios.post(
        `${WORDPRESS_OAUTH_BASE}/token`,
        new URLSearchParams({
          client_id: WORDPRESS_CLIENT_ID!,
          client_secret: WORDPRESS_CLIENT_SECRET!,
          redirect_uri: WORDPRESS_REDIRECT_URI,
          grant_type: "authorization_code",
          code: authCode,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (tokenResponse.data?.access_token) {
        console.log("✅ Access token obtained!\n");
        console.log("Add this to your .env.local file:");
        console.log(`WORDPRESS_ACCESS_TOKEN=${tokenResponse.data.access_token}\n`);
        if (tokenResponse.data.refresh_token) {
          console.log("Refresh token (for future use):");
          console.log(`WORDPRESS_REFRESH_TOKEN=${tokenResponse.data.refresh_token}\n`);
        }
        return tokenResponse.data.access_token;
      }
    } catch (error: any) {
      console.error("❌ Error exchanging code for token:", error.response?.data || error.message);
      return null;
    }
  }

  return null;
}

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  enclosure?: {
    url: string;
    type: string;
  };
  creator?: string;
}

interface PostData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  featuredImageUrl?: string;
  images: string[];
  author?: string;
}


// Create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Fetch full content from post URL
async function fetchFullContent(url: string): Promise<{
  content: string;
  images: string[];
  featuredImage?: string;
}> {
  try {
    console.log(`  📄 Fetching full content from: ${url}`);
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 30000,
    });

    const $ = cheerio.load(response.data);
    const images: string[] = [];
    let featuredImage: string | undefined;

    // Try to find the main content area
    // Common selectors for blog post content
    const contentSelectors = [
      "article",
      ".post-content",
      ".blog-post-content",
      ".entry-content",
      "[data-testid='richTextElement']",
      "main",
    ];

    let content = "";
    for (const selector of contentSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        content = element.html() || "";
        break;
      }
    }

    // If no specific content area found, try to get body content
    if (!content) {
      // Remove common non-content elements
      $("script, style, nav, header, footer, .menu, .sidebar").remove();
      content = $("body").html() || "";
    }

    // Extract all images
    $("img").each((_, img) => {
      const src = $(img).attr("src");
      const dataSrc = $(img).attr("data-src");
      const imageUrl = src || dataSrc;

      if (imageUrl) {
        // Convert relative URLs to absolute
        const absoluteUrl = imageUrl.startsWith("http")
          ? imageUrl
          : new URL(imageUrl, url).toString();
        images.push(absoluteUrl);

        // Use first large image as featured image if not already set
        if (!featuredImage && imageUrl.includes("static.wixstatic.com")) {
          const width = $(img).attr("width");
          const height = $(img).attr("height");
          // Prefer larger images
          if (!width || parseInt(width) > 500) {
            featuredImage = absoluteUrl;
          }
        }
      }
    });

    // If we have an enclosure image, use it as featured
    if (!featuredImage && images.length > 0) {
      featuredImage = images[0];
    }

    return {
      content: content || response.data,
      images: [...new Set(images)], // Remove duplicates
      featuredImage,
    };
  } catch (error) {
    console.error(`  ⚠️  Error fetching content from ${url}:`, error);
    return {
      content: "",
      images: [],
    };
  }
}

// Check if post exists by slug
async function postExists(slug: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `${WORDPRESS_API_BASE}/posts/slug:${slug}`,
      getAuthConfig()
    );
    return response.status === 200;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
}

// Upload image to WordPress and return media ID
async function uploadImageToWordPress(
  imageUrl: string,
  filename: string
): Promise<number | null> {
  try {
    console.log(`  📸 Uploading image: ${filename}`);

    // Download image as buffer
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

    // Create form-data instance
    const formData = new FormData();
    
    // Append buffer to form data
    formData.append("media[]", Buffer.from(imageResponse.data), {
      filename: filename,
      contentType: imageResponse.headers["content-type"] || "image/jpeg",
    });

    const uploadResponse = await axios.post(
      `${WORDPRESS_API_BASE}/media/new`,
      formData,
      {
        ...getAuthConfig(),
        headers: {
          ...getAuthHeaders(),
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    if (uploadResponse.data?.media && uploadResponse.data.media.length > 0) {
      const mediaId = uploadResponse.data.media[0].ID;
      console.log(`  ✅ Image uploaded with ID: ${mediaId}`);
      return mediaId;
    }

    return null;
  } catch (error: any) {
    // Check if it's a permission error
    if (error.response?.data?.error === "unauthorized") {
      console.log(`  ⚠️  No permission to upload media. Keeping original image URL.`);
      return null;
    }
    console.error(`  ⚠️  Error uploading image ${filename}:`, error.response?.data || error.message);
    return null;
  }
}

// Replace image URLs in content with WordPress media URLs
async function processImagesInContent(
  content: string,
  postUrl: string
): Promise<string> {
  const $ = cheerio.load(content);
  const imagePromises: Promise<void>[] = [];

  $("img").each((_, img) => {
    const src = $(img).attr("src") || $(img).attr("data-src");
    if (src && (src.includes("static.wixstatic.com") || src.includes("wixstatic.com"))) {
      const absoluteUrl = src.startsWith("http")
        ? src
        : new URL(src, postUrl).toString();

      // Extract filename from URL
      const urlParts = absoluteUrl.split("/");
      let filename = urlParts[urlParts.length - 1] || "image.jpg";
      // Clean filename (remove query params)
      filename = filename.split("?")[0];

      // Upload image and replace URL
      const promise = uploadImageToWordPress(absoluteUrl, filename).then((mediaId) => {
        if (mediaId) {
          // Get media URL from WordPress
          return axios
            .get(`${WORDPRESS_API_BASE}/media/${mediaId}`, getAuthConfig())
            .then((mediaResponse) => {
              const wpImageUrl = mediaResponse.data?.URL;
              if (wpImageUrl) {
                $(img).attr("src", wpImageUrl);
                if ($(img).attr("data-src")) {
                  $(img).attr("data-src", wpImageUrl);
                }
              }
            })
            .catch((error) => {
              console.error(`  ⚠️  Error getting media URL:`, error);
            });
        }
      });

      imagePromises.push(promise);
    }
  });

  // Wait for all image uploads to complete
  await Promise.all(imagePromises);

  return $.html();
}

// Create post in WordPress
async function createWordPressPost(postData: PostData): Promise<boolean> {
  try {
    console.log(`  ✍️  Creating post: "${postData.title}"`);

    // Process images in content - upload and replace URLs
    let processedContent = postData.content;
    if (postData.content && postData.content.includes("img")) {
      processedContent = await processImagesInContent(
        postData.content,
        postData.images[0] || ""
      );
    }

    // Upload featured image if available
    let featuredImageId: number | null = null;
    if (postData.featuredImageUrl) {
      const filename =
        postData.featuredImageUrl.split("/").pop()?.split("?")[0] || "featured.jpg";
      featuredImageId = await uploadImageToWordPress(
        postData.featuredImageUrl,
        filename
      );
    }

    // Prepare post data - try as draft first to avoid permission issues
    const wpPostData: any = {
      title: postData.title,
      content: processedContent,
      excerpt: postData.excerpt,
      status: "draft", // Start as draft
      date: postData.date,
    };

    if (featuredImageId) {
      wpPostData.featured_image = featuredImageId.toString();
    }

    // Create post - try different statuses based on permissions
    let response;
    let postCreated = false;
    
    // Try to create as draft first
    try {
      response = await axios.post(
        `${WORDPRESS_API_BASE}/posts/new`,
        wpPostData,
        {
          ...getAuthConfig(),
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );
      postCreated = true;
    } catch (createError: any) {
      // If unauthorized, the token doesn't have permission
      if (createError.response?.data?.error === "unauthorized") {
        const errorMsg = createError.response?.data?.message || "Unknown error";
        console.error(`  ❌ Authorization error: ${errorMsg}`);
        console.error(`  📝 Your API token doesn't have permission to create posts.`);
        console.error(`  💡 Solutions:`);
        console.error(`     1. Check that your API token has 'Editor' or 'Administrator' role`);
        console.error(`     2. Verify the token is correct in your .env.local file`);
        console.error(`     3. Create a new Application Password with proper permissions`);
        throw createError;
      } else {
        throw createError;
      }
    }

    if (response.data?.ID) {
      console.log(`  ✅ Post created successfully! ID: ${response.data.ID}`);
      console.log(`  🔗 URL: ${response.data.URL}`);
      
      // Try to publish if created as draft
      if (wpPostData.status === "draft") {
        try {
          await axios.post(
            `${WORDPRESS_API_BASE}/posts/${response.data.ID}`,
            { status: "publish" },
            {
              ...getAuthConfig(),
              headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
              },
            }
          );
          console.log(`  ✅ Post published!`);
        } catch (publishError: any) {
          console.log(`  ⚠️  Post created as draft. You can publish it manually in WordPress.`);
          if (publishError.response?.data?.message) {
            console.log(`  📝 Reason: ${publishError.response.data.message}`);
          }
        }
      }
      
      return true;
    }

    return false;
  } catch (error: any) {
    console.error(`  ❌ Error creating post:`, error.response?.data || error.message);
    return false;
  }
}

// Check API permissions before starting
async function checkAPIPermissions(): Promise<boolean> {
  console.log("🔐 Checking API permissions...\n");
  
  try {
    // Try to get site info to verify authentication
    const siteResponse = await axios.get(
      `${WORDPRESS_API_BASE}`,
      getAuthConfig()
    );
    
    console.log(`✅ Connected to WordPress.com site: ${siteResponse.data?.name || WORDPRESS_BLOG_ID}\n`);
    
    // Try to create a test draft to check permissions
    try {
      const testPost = await axios.post(
        `${WORDPRESS_API_BASE}/posts/new`,
        {
          title: "Test Permission Check - Delete Me",
          content: "This is a test post to check permissions. You can delete it.",
          status: "draft",
        },
        {
          ...getAuthConfig(),
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );
      
      // Delete the test post
      if (testPost.data?.ID) {
        await axios.post(
          `${WORDPRESS_API_BASE}/posts/${testPost.data.ID}/delete`,
          {},
          getAuthConfig()
        );
      }
      
      console.log("✅ Permission check passed! You can create posts.\n");
      return true;
    } catch (permError: any) {
      if (permError.response?.data?.error === "unauthorized") {
        console.error("❌ Permission Error Detected!\n");
        console.error("Your API token doesn't have the required permissions:\n");
        console.error("Required permissions:");
        console.error("  - Create Posts (Editor or Administrator role)");
        console.error("  - Upload Media (Editor or Administrator role)");
        console.error("  - Publish Posts (Editor or Administrator role)\n");
        console.error("Solutions:");
        console.error("  1. Make sure your WordPress.com account has Editor or Administrator role");
        console.error("  2. Check your account role at: https://wordpress.com/people/team");
        console.error("  3. Create a new Application Password");
        console.error("  4. Verify WORDPRESS_BLOG_ID is correct\n");
        return false;
      }
      throw permError;
    }
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("❌ Authentication Failed!\n");
      console.error("Please check:");
      console.error("  - WORDPRESS_BLOG_ID is correct");
      console.error("  - WORDPRESS_API_TOKEN is correct");
      console.error("  - Token hasn't been revoked\n");
      return false;
    }
    console.error("⚠️  Could not verify permissions, but continuing anyway...\n");
    return true; // Continue anyway
  }
}

// Main migration function
async function migrateBlog() {
  console.log("🚀 Starting Wix to WordPress migration...\n");
  
  // Check permissions first
  const hasPermissions = await checkAPIPermissions();
  if (!hasPermissions) {
    console.error("❌ Migration aborted due to permission issues.");
    console.error("Please fix the permission issues and try again.\n");
    process.exit(1);
  }
  
  console.log(`📡 Fetching RSS feed from: ${RSS_FEED_URL}\n`);

  const parser = new Parser();
  let feed;

  try {
    feed = await parser.parseURL(RSS_FEED_URL);
  } catch (error) {
    console.error("❌ Error fetching RSS feed:", error);
    process.exit(1);
  }

  console.log(`📰 Found ${feed.items.length} posts in RSS feed\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < feed.items.length; i++) {
    const item = feed.items[i] as RSSItem;
    const slug = createSlug(item.title || "");

    console.log(`\n[${i + 1}/${feed.items.length}] Processing: ${item.title}`);
    console.log(`  🔗 URL: ${item.link}`);
    console.log(`  📝 Slug: ${slug}`);

    // Check if post already exists
    try {
      const exists = await postExists(slug);
      if (exists) {
        console.log(`  ⏭️  Post already exists, skipping...`);
        skipCount++;
        continue;
      }
    } catch (error: any) {
      console.error(`  ⚠️  Error checking if post exists:`, error.message);
      // Continue anyway
    }

    // Fetch full content
    const { content, images, featuredImage } = await fetchFullContent(
      item.link || ""
    );

    if (!content) {
      console.log(`  ⚠️  No content found, skipping...`);
      errorCount++;
      continue;
    }

    // Prepare post data
    const postData: PostData = {
      title: item.title || "",
      slug,
      content: content,
      excerpt: item.contentSnippet || item.content || "",
      date: item.pubDate || new Date().toISOString(),
      featuredImageUrl: featuredImage || item.enclosure?.url,
      images: images,
      author: item.creator,
    };

    // Create post
    const success = await createWordPressPost(postData);

    if (success) {
      successCount++;
    } else {
      errorCount++;
    }

    // Add delay to avoid rate limiting
    if (i < feed.items.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 Migration Summary:");
  console.log(`  ✅ Successfully migrated: ${successCount}`);
  console.log(`  ⏭️  Skipped (already exists): ${skipCount}`);
  console.log(`  ❌ Errors: ${errorCount}`);
  console.log("=".repeat(50));
}

// Main execution
async function main() {
  // If OAuth is configured but no access token, help user get one
  if (WORDPRESS_CLIENT_ID && WORDPRESS_CLIENT_SECRET && !WORDPRESS_ACCESS_TOKEN) {
    console.log("🔐 OAuth credentials found but no access token.\n");
    const token = await getOAuthAccessToken();
    if (!token) {
      console.log("\n⚠️  Please complete the OAuth flow:");
      console.log("   1. Visit the authorization URL shown above");
      console.log("   2. Authorize the application");
      console.log("   3. Copy the 'code' from the redirect URL");
      console.log("   4. Run: npx tsx scripts/migrate-wix-to-wordpress.ts <code>");
      console.log("   5. Add the access token to .env.local and run the script again");
      process.exit(0);
    } else {
      // Token was obtained from command line argument
      console.log("\n✅ Access token obtained! Please add it to .env.local and run the script again.");
      console.log("   The migration will start automatically once the token is in your .env.local file.\n");
      process.exit(0);
    }
  }

  // Run migration
  await migrateBlog();
}

main().catch((error) => {
  console.error("❌ Migration failed:", error);
  process.exit(1);
});

