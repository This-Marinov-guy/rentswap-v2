# Wix to WordPress Blog Migration Script

This script migrates blog posts from Wix (via RSS feed) to WordPress.com.

## 📖 Quick Start Guide

**For detailed step-by-step instructions, see: [OAUTH-SETUP-GUIDE.md](./OAUTH-SETUP-GUIDE.md)**

## Prerequisites

### Option 1: OAuth Method (Recommended)

1. **WordPress.com OAuth Application**: You need an OAuth application registered at https://developer.wordpress.com/apps/
   - Client ID: Your OAuth Client ID
   - Client Secret: Your OAuth Client Secret
   - Redirect URI: Your redirect URI (e.g., https://rentswap.nl)

2. **Get OAuth Access Token**:
Run the script - it will show you the authorization URL
Visit the URL: https://public-api.wordpress.com/oauth2/authorize?client_id=130354&redirect_uri=https://rentswap.nl&response_type=code&scope=global
Authorize the application
Copy the code from the redirect URL
Run: npx tsx scripts/migrate-wix-to-wordpress.ts <authorization_code>
The script will exchange the code for an access token
Add the access token to your .env.local file
The script now uses OAuth with your Client ID and Client Secret, which should resolve the authorization issues.

3. **Blog ID**: Your WordPress.com blog ID (found in your site URL or API settings)

### Option 2: Application Password Method (Legacy)

1. **WordPress.com Account**: You need a WordPress.com account with API access
2. **Application Password**: Generate an application password in WordPress.com:
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
3. Verify the API token/access token is correct
4. For OAuth: Make sure you authorized with the correct scope

## Setup

1. Add the following environment variables to your `.env.local` file:

**For OAuth Method:**
```env
WORDPRESS_BLOG_ID=your_blog_id_here
WORDPRESS_CLIENT_ID=your_oauth_client_id
WORDPRESS_CLIENT_SECRET=your_oauth_client_secret
WORDPRESS_ACCESS_TOKEN=your_oauth_access_token
WORDPRESS_REDIRECT_URI=https://rentswap.nl
RSS_FEED_URL=https://www.rentswap.nl/blog-feed.xml
```

**For Application Password Method:**
```env
WORDPRESS_BLOG_ID=your_blog_id_here
WORDPRESS_API_TOKEN=your_application_password_here
RSS_FEED_URL=https://www.rentswap.nl/blog-feed.xml
```

### Getting OAuth Access Token

If you have OAuth credentials but no access token yet:

1. Run the script - it will show you the authorization URL
2. Visit the URL and authorize the application
3. Copy the `code` parameter from the redirect URL
4. Run: `npx tsx scripts/migrate-wix-to-wordpress.ts <authorization_code>`
5. The script will exchange the code for an access token
6. Add the access token to your `.env.local` file

## Usage

Run the migration script:

```bash
npm run migrate-blog
```

Or directly with npx tsx:

```bash
npx tsx scripts/migrate-wix-to-wordpress.ts
```

Or if you have tsx globally installed:

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

