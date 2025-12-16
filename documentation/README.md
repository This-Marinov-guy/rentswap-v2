# Scripts

## SEO & PWA Setup

This directory contains scripts and documentation for SEO optimization and Progressive Web App (PWA) setup.

## Sitemap Generation

### Automatic Sitemap (Production)

The sitemap is automatically generated during the build process at `/sitemap.xml` using Next.js App Router's native sitemap functionality. This happens automatically when you run:

```bash
npm run build
```

The dynamic sitemap includes:
- All static routes (homepage, pricing, blog, faq, etc.)
- All blog posts fetched from WordPress
- Proper lastModified dates, changefreq, and priority values
- Automatic revalidation every hour

### Manual Sitemap Generation Script

For manual sitemap generation or debugging purposes, you can use the standalone script:

```bash
npm run generate-sitemap
```

This script:
- Fetches all blog posts from WordPress REST API
- Generates a `sitemap.xml` file in the `/public` directory
- Creates a timestamped backup copy (e.g., `sitemap-2025-11-28T10-33-35.xml`)
- Outputs detailed progress and statistics
- Can be used independently of the build process

**Note:** The manual script generates a static XML file in `/public/sitemap.xml`, while the automatic Next.js sitemap is dynamically generated at `/sitemap.xml` during build time and includes ISR (Incremental Static Regeneration) with 1-hour revalidation.

### Configuration

Make sure you have `WORDPRESS_BLOG_ID` set in your `.env.local` file:

```
WORDPRESS_BLOG_ID=your_blog_id_here
```

### Sitemap Routes

**Static Routes:**
- `/` (homepage) - priority 1.0, daily updates
- `/pricing` - priority 0.8, weekly updates
- `/resources` - priority 0.8, weekly updates
- `/faq` - priority 0.7, monthly updates
- `/terms-conditions` - priority 0.5, monthly updates
- `/privacy-policy` - priority 0.5, monthly updates
- `/sign-up` - priority 0.9, weekly updates
- `/blog` - priority 0.9, daily updates

**Dynamic Routes:**
- `/blog/[slug]` - priority 0.7, weekly updates (one entry per blog post)

---

## Robots.txt

The robots.txt file is automatically generated at `/robots.txt` during build time.

**Configuration:** [src/app/robots.ts](../src/app/robots.ts)

**Settings:**
- Allows all bots to crawl all pages
- Disallows crawling of `/api/`, `/admin/`, and `/_next/` directories
- Points to the sitemap at `https://rentswap.com/sitemap.xml`

**Generated Output:**
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

Sitemap: https://rentswap.com/sitemap.xml
```

---

## Progressive Web App (PWA) Manifest

The PWA manifest is automatically generated at `/manifest.webmanifest` during build time.

**Configuration:** [src/app/manifest.ts](../src/app/manifest.ts)

**Features:**
- App name: "RentSwap - Swap Your Rental Home"
- Standalone display mode for native app-like experience
- Theme color: #FA3C4C (RentSwap brand red)
- Portrait orientation
- Supports both maskable and any purpose icons
- Categories: lifestyle, business, real estate
- Includes screenshot placeholders for app stores

**Required Assets:**

Before deploying, you need to create the following icon files:

1. `/public/icons/icon-192x192.png` - 192x192 pixels
2. `/public/icons/icon-512x512.png` - 512x512 pixels

Optional screenshots for better app store presentation:

3. `/public/screenshots/home.png` - 540x720 pixels (mobile)
4. `/public/screenshots/desktop.png` - 1280x720 pixels (desktop)

See [generate-icons.md](./generate-icons.md) for detailed instructions on creating these assets.

---

## Testing

### Test Sitemap
```bash
curl http://localhost:3000/sitemap.xml
```

### Test Robots.txt
```bash
curl http://localhost:3000/robots.txt
```

### Test PWA Manifest
```bash
curl http://localhost:3000/manifest.webmanifest
```

### Validate PWA
- Chrome DevTools > Application > Manifest
- https://manifest-validator.appspot.com/
- Lighthouse audit for PWA score
