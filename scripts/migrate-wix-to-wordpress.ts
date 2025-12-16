/**
 * Wix to WordPress Blog Migration Script
 * (MAX IMAGE QUALITY + AUTO THUMBNAILS)
 */

import Parser from "rss-parser";
import * as cheerio from "cheerio";
import axios from "axios";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const WORDPRESS_BLOG_ID = process.env.WORDPRESS_BLOG_ID;
const WORDPRESS_API_TOKEN = process.env.WORDPRESS_API_TOKEN;
const WORDPRESS_ACCESS_TOKEN = process.env.WORDPRESS_ACCESS_TOKEN;
const RSS_FEED_URL = process.env.RSS_FEED_URL;

const WORDPRESS_API_BASE = `https://public-api.wordpress.com/rest/v1.1/sites/${WORDPRESS_BLOG_ID}`;

if (!WORDPRESS_BLOG_ID || !RSS_FEED_URL) {
  throw new Error("Missing WORDPRESS_BLOG_ID or RSS_FEED_URL");
}

/* ================= AUTH (UNCHANGED) ================= */

function getAuthConfig() {
  if (WORDPRESS_ACCESS_TOKEN) {
    return {
      headers: { Authorization: `Bearer ${WORDPRESS_ACCESS_TOKEN}` },
    };
  }
  return {
    auth: {
      username: WORDPRESS_BLOG_ID!,
      password: WORDPRESS_API_TOKEN!,
    },
  };
}

/* ================= IMAGE QUALITY ================= */

/**
 * Get ORIGINAL Wix image (no /v1/, no resize)
 */
function getOriginalWixImageUrl(url: string): string {
  try {
    if (!url.includes("static.wixstatic.com")) return url;

    if (url.includes("/v1/")) {
      return url.split("/v1/")[0];
    }

    const clean = new URL(url);
    clean.search = "";
    return clean.toString();
  } catch {
    return url;
  }
}

/**
 * Log image size without downloading full content twice
 */
async function logImageSize(url: string) {
  try {
    const head = await axios.head(url);
    const size = Number(head.headers["content-length"] || 0);

    if (size > 0) {
      const mb = (size / 1024 / 1024).toFixed(2);
      console.log(`🖼️ Image: ${url}`);
      console.log(`   📦 Size: ${mb} MB`);
    }
  } catch {
    console.log(`🖼️ Image: ${url}`);
    console.log(`   📦 Size: unknown`);
  }
}

/* ================= CONTENT PROCESSING ================= */

async function processImagesInContent(
  content: string,
  postUrl: string
): Promise<{ html: string; firstImage?: string }> {
  const $ = cheerio.load(content);
  let firstImage: string | undefined;

  const imagePromises: Promise<void>[] = [];

  $("img").each((index, img) => {
    const src = $(img).attr("src") || $(img).attr("data-src");
    if (!src || !src.includes("wixstatic.com")) return;

    const absoluteUrl = src.startsWith("http")
      ? src
      : new URL(src, postUrl).toString();

    const originalUrl = getOriginalWixImageUrl(absoluteUrl);

    // Capture first image for thumbnail
    if (!firstImage) {
      firstImage = originalUrl;
    }

    // Log image size (async, non-blocking)
    imagePromises.push(logImageSize(originalUrl));

    // Replace image source
    $(img).attr("src", originalUrl);
    $(img).removeAttr("data-src");
  });

  await Promise.all(imagePromises);

  return {
    html: $.html(),
    firstImage,
  };
}

/* ================= POST CREATION ================= */

async function createWordPressPost(post: {
  title: string;
  content: string;
  date: string;
}) {
  const { html, firstImage } = await processImagesInContent(post.content, "");

  const payload: any = {
    title: post.title,
    content: html,
    status: "publish",
    date: post.date,
  };

  // ✅ Set thumbnail if available
  if (firstImage) {
    payload.featured_image = firstImage;
    console.log(`🖼️ Thumbnail set: ${firstImage}`);
  } else {
    console.log(`⚠️ No images found for thumbnail`);
  }

  await axios.post(`${WORDPRESS_API_BASE}/posts/new`, payload, getAuthConfig());

  console.log(`✅ Published: ${post.title}`);
}

/* ================= MAIN ================= */

async function migrate() {
  const parser = new Parser();
  const feed = await parser.parseURL(RSS_FEED_URL!);

  console.log(`📰 Found ${feed.items.length} posts`);

  for (const item of feed.items) {
    if (!item.link || !item.title) continue;

    console.log(`➡️ ${item.title}`);

    const page = await axios.get(item.link);
    const $ = cheerio.load(page.data);

    const content =
      $("article").html() ||
      $(".post-content").html() ||
      $(".entry-content").html() ||
      $("main").html();

    if (!content) {
      console.warn(`⚠️ No content found for ${item.title}`);
      continue;
    }

    await createWordPressPost({
      title: item.title,
      content,
      date: item.pubDate || new Date().toISOString(),
    });

    await new Promise((r) => setTimeout(r, 2000));
  }
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
