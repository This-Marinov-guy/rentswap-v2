import { logIntegration } from "@/lib/axiom";

export interface WordPressPost {
  ID: number;
  site_ID: number;
  author: {
    ID: number;
    login: string;
    email: false;
    name: string;
    first_name: string;
    last_name: string;
    nice_name: string;
    URL: string;
    avatar_URL: string;
    profile_URL: string;
  };
  date: string;
  modified: string;
  title: string;
  URL: string;
  short_URL: string;
  content: string;
  excerpt: string;
  slug: string;
  guid: string;
  status: string;
  sticky: boolean;
  password: string;
  parent: false;
  type: string;
  discussion: {
    comments_open: boolean;
    comment_status: string;
    pings_open: boolean;
    ping_status: string;
    comment_count: number;
  };
  likes_enabled: boolean;
  sharing_enabled: boolean;
  like_count: number;
  i_like: boolean;
  is_reblogged: boolean;
  is_following: boolean;
  global_ID: string;
  featured_image: string;
  post_thumbnail: {
    ID: number;
    URL: string;
    guid: string;
    mime_type: string;
    width: number;
    height: number;
  } | null;
  format: string;
  geo: false;
  menu_order: number;
  page_template: string;
  publicize_URLs: string[];
  terms: {
    category: {
      [key: string]: {
        ID: number;
        name: string;
        slug: string;
        description: string;
        post_count: number;
        parent: number;
        meta: {
          links: {
            self: string;
            help: string;
            site: string;
          };
        };
      };
    };
    post_tag: {
      [key: string]: {
        ID: number;
        name: string;
        slug: string;
        description: string;
        post_count: number;
        parent: number;
        meta: {
          links: {
            self: string;
            help: string;
            site: string;
          };
        };
      };
    };
  };
  tags: {
    [key: string]: {
      ID: number;
      name: string;
      slug: string;
      description: string;
      post_count: number;
      parent: number;
      meta: {
        links: {
          self: string;
          help: string;
          site: string;
        };
      };
    };
  };
  categories: {
    [key: string]: {
      ID: number;
      name: string;
      slug: string;
      description: string;
      post_count: number;
      parent: number;
      meta: {
        links: {
          self: string;
          help: string;
          site: string;
        };
      };
    };
  };
  attachments: {
    [key: string]: {
      ID: number;
      URL: string;
      guid: string;
      mime_type: string;
      width: number;
      height: number;
    };
  };
  attachment_count: number;
  metadata: any[];
  meta: {
    links: {
      self: string;
      help: string;
      site: string;
      replies: string;
      likes: string;
    };
  };
}

export interface WordPressPostResponse {
  found: number;
  posts: WordPressPost[];
  meta: {
    next_page?: string;
  };
}

const WORDPRESS_BLOG_ID = process.env.WORDPRESS_BLOG_ID;
const BASE_URL = "https://public-api.wordpress.com/rest/v1.1/sites";

export async function getPosts(
  page: number = 1,
  number: number = 20
): Promise<WordPressPostResponse> {
  if (!WORDPRESS_BLOG_ID) {
    throw new Error("WORDPRESS_BLOG_ID is not defined");
  }

  const startedAt = Date.now();
  try {
    const res = await fetch(
      `${BASE_URL}/${WORDPRESS_BLOG_ID}/posts?page=${page}&number=${number}&fields=ID,title,slug,date,excerpt,post_thumbnail,author,categories`,
      {
        next: { revalidate: 10 * 60 },
      }
    );

    if (!res.ok) {
      throw new Error(`WordPress returned ${res.status}`);
    }

    const data = await res.json();
    void logIntegration('wordpress', 'list_posts', {
      duration: Date.now() - startedAt,
      statusCode: res.status,
      success: true,
    });
    return data;
  } catch (error) {
    void logIntegration('wordpress', 'list_posts', {
      duration: Date.now() - startedAt,
      success: false,
      message: error instanceof Error ? error.message : 'WordPress request failed',
    });
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<WordPressPost> {
  if (!WORDPRESS_BLOG_ID) {
    throw new Error("WORDPRESS_BLOG_ID is not defined");
  }

  const url = `${BASE_URL}/${WORDPRESS_BLOG_ID}/posts/slug:${slug}`;
  console.log(`Fetching post by slug: ${slug} from ${url}`);

  const startedAt = Date.now();
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`WordPress returned ${res.status}`);
    }

    const data = await res.json();
    void logIntegration('wordpress', 'get_post', {
      duration: Date.now() - startedAt,
      statusCode: res.status,
      success: true,
    });
    return data;
  } catch (error) {
    void logIntegration('wordpress', 'get_post', {
      duration: Date.now() - startedAt,
      success: false,
      message: error instanceof Error ? error.message : 'WordPress request failed',
    });
    throw error;
  }
}
