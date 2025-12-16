# Step-by-Step OAuth Setup Guide for Blog Migration

This guide will walk you through setting up OAuth authentication and migrating your blog from Wix to WordPress.com.

## Prerequisites

- Node.js installed
- WordPress.com account with Editor or Administrator role
- OAuth Client ID and Client Secret (you already have these)

## Step 1: Set Up Environment Variables

1. Open your `.env.local` file in the project root (create it if it doesn't exist)

2. Add the following variables:

```env
# Required
WORDPRESS_BLOG_ID=your_blog_id_here
WORDPRESS_CLIENT_ID=***
WORDPRESS_CLIENT_SECRET=***
WORDPRESS_REDIRECT_URI=https://rentswap.nl

# Optional (will be added after OAuth flow)
WORDPRESS_ACCESS_TOKEN=

# Optional (defaults to rentswap.nl feed)
RSS_FEED_URL=https://www.rentswap.nl/blog-feed.xml
```

3. **Find your WordPress Blog ID:**
   - Go to your WordPress.com site dashboard
   - The Blog ID is usually in the URL or site settings
   - Or check: `https://public-api.wordpress.com/rest/v1.1/sites/YOUR_SITE_URL`
   - Replace `YOUR_SITE_URL` with your site URL (e.g., `rentswap.wordpress.com`)

## Step 2: Get OAuth Access Token

### Option A: Using the Script (Recommended)

1. **Run the script without an access token:**
   ```bash
   npm run migrate-blog
   ```

2. **The script will show you an authorization URL.** It will look like:
   ```
   https://public-api.wordpress.com/oauth2/authorize?client_id=130354&redirect_uri=https://rentswap.nl&response_type=code&scope=global
   ```

3. **Copy and visit that URL in your browser**

4. **Authorize the application:**
   - You'll be asked to log in to WordPress.com (if not already logged in)
   - Review the permissions requested
   - Click "Authorize" or "Approve"

5. **Get the authorization code:**
   - After authorization, you'll be redirected to: `https://rentswap.nl?code=AUTHORIZATION_CODE`
   - Copy the `code` parameter from the URL (the part after `code=`)

6. **Exchange the code for an access token:**
   ```bash
   npx tsx scripts/migrate-wix-to-wordpress.ts YOUR_AUTHORIZATION_CODE
   ```
   Replace `YOUR_AUTHORIZATION_CODE` with the code you copied

7. **The script will output your access token.** It will look like:
   ```
   ✅ Access token obtained!
   
   Add this to your .env.local file:
   WORDPRESS_ACCESS_TOKEN=abc123xyz...
   ```

8. **Add the access token to `.env.local`:**
   - Open `.env.local`
   - Add or update: `WORDPRESS_ACCESS_TOKEN=abc123xyz...`
   - Save the file

### Option B: Manual OAuth Flow

1. **Visit the authorization URL:**
   ```
   https://public-api.wordpress.com/oauth2/authorize?client_id=130354&redirect_uri=https://rentswap.nl&response_type=code&scope=global
   ```

2. **Authorize the application** (same as Step 2.4 above)

3. **Copy the authorization code** from the redirect URL

4. **Exchange code for token using curl or Postman:**
   ```bash
   curl -X POST https://public-api.wordpress.com/oauth2/token \
     -d "client_id=130354" \
     -d "client_secret=JFUb5X2zUZkyQ0VqA8Atic2vsNzgzPPOID1HEJ4UHEEbGtuqab0yh2by2VSp4upX" \
     -d "redirect_uri=https://rentswap.nl" \
     -d "code=YOUR_AUTHORIZATION_CODE" \
     -d "grant_type=authorization_code"
   ```

5. **Copy the `access_token` from the response** and add it to `.env.local`

## Step 3: Verify Your Setup

Your `.env.local` should now look like this:

```env
WORDPRESS_BLOG_ID=your_blog_id
WORDPRESS_CLIENT_ID=130354
WORDPRESS_CLIENT_SECRET=JFUb5X2zUZkyQ0VqA8Atic2vsNzgzPPOID1HEJ4UHEEbGtuqab0yh2by2VSp4upX
WORDPRESS_ACCESS_TOKEN=your_access_token_here
WORDPRESS_REDIRECT_URI=https://rentswap.nl
RSS_FEED_URL=https://www.rentswap.nl/blog-feed.xml
```

## Step 4: Run the Migration

1. **Run the migration script:**
   ```bash
   npm run migrate-blog
   ```

2. **The script will:**
   - Check your API permissions
   - Fetch the RSS feed from Wix
   - For each post:
     - Check if it already exists (by slug)
     - Fetch full content from the post URL
     - Extract images
     - Upload images to WordPress (if you have permission)
     - Create the post in WordPress

3. **Watch the progress:**
   - You'll see detailed output for each post
   - Successfully migrated posts will show ✅
   - Posts that already exist will be skipped ⏭️
   - Errors will be shown with details ❌

4. **Review the summary:**
   - At the end, you'll see a summary of:
     - Successfully migrated posts
     - Skipped posts (already exist)
     - Errors encountered

## Step 5: Verify Migration

1. **Check your WordPress.com dashboard:**
   - Go to your WordPress.com site
   - Navigate to Posts
   - Verify that posts were created

2. **Check for drafts:**
   - If posts were created as drafts (due to permissions), you can publish them manually
   - Or fix permissions and re-run the script

## Troubleshooting

### "Missing authentication credentials"
- Make sure `WORDPRESS_ACCESS_TOKEN` is set in `.env.local`
- Or use `WORDPRESS_API_TOKEN` for Application Password method

### "User cannot upload media" or "User cannot publish posts"
- Your account needs Editor or Administrator role
- Check your role at: https://wordpress.com/people/team
- Ask the site owner to grant you proper permissions

### "Authorization error"
- Verify your access token is still valid
- Access tokens may expire - you may need to get a new one
- Check that your Client ID and Secret are correct

### Posts created as drafts
- This happens if you don't have publish permission
- You can publish them manually in WordPress
- Or fix your account permissions and re-run

### Images not uploading
- If you get "cannot upload media" errors, images will keep their original Wix URLs
- This is fine - the posts will still work, just with external images
- To fix: ensure your account has media upload permissions

## Next Steps

After successful migration:
1. Review posts in WordPress
2. Publish any drafts if needed
3. Check that images are displaying correctly
4. Update any post settings or categories as needed

## Need Help?

- Check the main README: `scripts/README-migration.md`
- Review error messages in the console output
- Verify all environment variables are set correctly

