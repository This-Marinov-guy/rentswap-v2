"use client";

import { useState, useEffect, useMemo } from "react";
import { WordPressPost } from "@/lib/wordpress";
import BlogCard from "./BlogCard";
import styles from "./BlogSearch.module.css";

interface BlogSearchProps {
  posts: WordPressPost[];
  onSearchStateChange?: (hasQuery: boolean) => void;
}

export default function BlogSearch({ posts, onSearchStateChange }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query with 0.8 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Notify parent about search state
  useEffect(() => {
    if (onSearchStateChange) {
      onSearchStateChange(!!debouncedQuery.trim());
    }
  }, [debouncedQuery, onSearchStateChange]);

  // Filter posts by title and category
  const filteredPosts = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return posts;
    }

    const query = debouncedQuery.toLowerCase().trim();

    return posts.filter((post) => {
      // Search in title (remove HTML tags)
      const title = post.title.replace(/<[^>]*>/g, "").toLowerCase();
      const titleMatch = title.includes(query);

      // Search in categories
      const categories = Object.values(post.categories || {})
        .map((cat) => cat.name.toLowerCase())
        .join(" ");
      const categoryMatch = categories.includes(query);

      return titleMatch || categoryMatch;
    });
  }, [posts, debouncedQuery]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search blogs by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className={styles.clearButton}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {debouncedQuery && (
        <>
          <div className={styles.resultsInfo}>
            {filteredPosts.length === 0 ? (
              <p className={styles.noResults}>
                No blogs found matching &quot;{debouncedQuery}&quot;
              </p>
            ) : (
              <p className={styles.resultsCount}>
                Found {filteredPosts.length} {filteredPosts.length === 1 ? "blog" : "blogs"} matching &quot;{debouncedQuery}&quot;
              </p>
            )}
          </div>

          <div className={styles.grid}>
            {filteredPosts.map((post) => (
              <BlogCard key={post.ID} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className={styles.emptyState}>
              <p>Try searching with different keywords</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
