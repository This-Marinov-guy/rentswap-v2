# Wix to WordPress Blog Migration Script

This script migrates blog posts from Wix (via RSS feed) to WordPress.com.

## Prerequisites

1. **WordPress.com Account**: You need a WordPress.com account with API access
2. **Application Password with Proper Permissions**: Generate an application password in WordPress.com:
   - Go to WordPress.com → Settings → Security → Application Passwords
   - Create a new application password
   - **IMPORTANT**: Make sure your WordPress.com account has **Editor** or **Administrator** role on the blog
   - Copy the generated token

3. **Blog ID**: Your WordPress.com blog ID (found in your site URL or API settings)

### ⚠️ Permission Requirements

Your API token needs the following permissions:
- **Create Posts** (Editor or Administrator role)
- **Upload Media** (Editor or Administrator role)  
- **Publish Posts** (Editor or Administrator role)

If you get "unauthorized" errors:
1. Check your account role on the WordPress.com site
2. Make sure you're using the correct blog ID
3. Verify the API token is correct
4. Try creating a new Application Password

## Setup

1. Add the following environment variables to your `.env.local` file:

```env
WORDPRESS_BLOG_ID=your_blog_id_here
WORDPRESS_API_TOKEN=your_application_password_here
RSS_FEED_URL=https://www.rentswap.nl/blog-feed.xml
```

## Usage

Run the migration script:

```bash
npm run migrate-blog
```

Or directly with tsx:

```bash
tsx scripts/migrate-wix-to-wordpress.ts
```

## What the Script Does

1. **Fetches RSS Feed**: Downloads and parses the RSS feed from Wix
2. **Checks for Duplicates**: Verifies if a post with the same slug already exists
3. **Fetches Full Content**: Downloads the full HTML content from each post URL
4. **Extracts Images**: Finds all images in the content and featured image
5. **Uploads Images**: Uploads images to WordPress media library
6. **Creates Posts**: Creates posts in WordPress with:
   - Full content (HTML)
   - Excerpt
   - Featured image
   - Publication date
   - Proper slug

## Features

- ✅ **Duplicate Prevention**: Skips posts that already exist (by slug)
- ✅ **Full Content**: Fetches complete post content, not just RSS description
- ✅ **Image Handling**: Uploads and replaces image URLs with WordPress media
- ✅ **Featured Images**: Sets featured image from post enclosure or first large image
- ✅ **Error Handling**: Continues processing even if individual posts fail
- ✅ **Progress Tracking**: Shows detailed progress and summary

## Troubleshooting

### Authentication Errors
- Verify your `WORDPRESS_API_TOKEN` is correct
- Make sure you're using an Application Password, not your regular password
- Check that your blog ID is correct

### Content Not Found
- Some Wix posts may have different HTML structure
- The script tries multiple selectors to find content
- Check the console output for warnings

### Image Upload Failures
- Images are downloaded and uploaded to WordPress
- If upload fails, original URLs are kept
- Check WordPress media library permissions

### Rate Limiting
- The script includes a 2-second delay between posts
- If you hit rate limits, increase the delay in the script

## Notes

- The script preserves original publication dates
- Slugs are generated from post titles (lowercase, hyphenated)
- Images are uploaded to WordPress media library
- Original post URLs are preserved in content if image upload fails

