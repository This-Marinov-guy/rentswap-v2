# Fixing "Unknown client_id" Error

## The Problem
WordPress.com doesn't recognize your Client ID `130354`. This means the OAuth application either:
- Wasn't created properly
- Has been deleted/deactivated
- The Client ID is incorrect

## Solution 1: Create/Verify OAuth Application

1. **Go to WordPress.com Developer Portal:**
   - Visit: https://developer.wordpress.com/apps/
   - Log in with your WordPress.com account

2. **Check if your app exists:**
   - Look for an app with Client ID `130354`
   - If it doesn't exist, you need to create a new one

3. **Create a New OAuth Application:**
   - Click "Create New Application" or "Add New"
   - Fill in the details:
     - **Application Name**: RentSwap Blog Migration (or any name)
     - **Description**: Blog migration script
     - **Website URL**: https://rentswap.nl
     - **Redirect URLs**: 
       - Add: `https://rentswap.nl`
       - Make sure this EXACTLY matches what's in your `.env.local`
   - Click "Create" or "Save"

4. **Copy Your New Credentials:**
   - After creating, you'll see:
     - **Client ID**: (a new number, different from 130354)
     - **Client Secret**: (a long string)
   - Copy both values

5. **Update `.env.local`:**
   ```env
   WORDPRESS_CLIENT_ID=YOUR_NEW_CLIENT_ID
   WORDPRESS_CLIENT_SECRET=YOUR_NEW_CLIENT_SECRET
   WORDPRESS_REDIRECT_URI=https://rentswap.nl
   ```

6. **Try the OAuth flow again:**
   ```bash
   npm run migrate-blog
   ```

## Solution 2: Use Application Password (Easier Alternative)

If OAuth is too complicated, you can use Application Password instead:

1. **Go to WordPress.com Security Settings:**
   - Visit: https://wordpress.com/me/security
   - Or: WordPress.com → Settings → Security → Application Passwords

2. **Create Application Password:**
   - Scroll to "Application Passwords" section
   - Enter a name: "Blog Migration Script"
   - Click "Add New Application Password"
   - **Copy the generated password** (you'll only see it once!)

3. **Update `.env.local`:**
   ```env
   # Remove or comment out OAuth credentials:
   # WORDPRESS_CLIENT_ID=130354
   # WORDPRESS_CLIENT_SECRET=...
   
   # Add Application Password instead:
   WORDPRESS_API_TOKEN=your_application_password_here
   WORDPRESS_BLOG_ID=your_blog_id
   ```

4. **Run the migration:**
   ```bash
   npm run migrate-blog
   ```

## Which Method to Use?

- **OAuth (Solution 1)**: More secure, better for production, tokens can be refreshed
- **Application Password (Solution 2)**: Easier to set up, simpler, but password doesn't expire

## Troubleshooting

### "Redirect URI mismatch"
- Make sure the redirect URI in your `.env.local` EXACTLY matches what's registered in WordPress.com
- Check for trailing slashes, http vs https, etc.

### "Invalid client_secret"
- Make sure you copied the entire Client Secret (it's usually very long)
- No extra spaces or line breaks

### "User cannot publish posts"
- Your WordPress.com account needs Editor or Administrator role
- Check at: https://wordpress.com/people/team




