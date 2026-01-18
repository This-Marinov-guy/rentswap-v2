"use client";

import { useState, useMemo } from "react";
import { WordPressPost } from "@/lib/wordpress";
import BlogCard from "./BlogCard";
import BlogSearch from "./BlogSearch";
import BlogCategoryFilter from "./BlogCategoryFilter";
import styles from "./BlogPageContent.module.css";

interface BlogPageContentProps {
  allPosts: WordPressPost[];
  paginatedPosts: WordPressPost[];
  showPagination: boolean;
  paginationComponent: React.ReactNode;
  controlsComponent: React.ReactNode;
}

export default function BlogPageContent({
  allPosts,
  paginatedPosts,
  showPagination,
  paginationComponent,
  controlsComponent,
}: BlogPageContentProps) {
  const [hasSearchQuery, setHasSearchQuery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter posts by selected category
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) {
      return paginatedPosts;
    }

    return paginatedPosts.filter((post) => {
      return Object.values(post.categories || {}).some(
        (category) => category.name === selectedCategory
      );
    });
  }, [paginatedPosts, selectedCategory]);

  // Filter all posts by category for search
  const categoryFilteredAllPosts = useMemo(() => {
    if (!selectedCategory) {
      return allPosts;
    }

    return allPosts.filter((post) => {
      return Object.values(post.categories || {}).some(
        (category) => category.name === selectedCategory
      );
    });
  }, [allPosts, selectedCategory]);

  return (
    <>
      <BlogSearch 
        posts={categoryFilteredAllPosts} 
        onSearchStateChange={setHasSearchQuery}
      />
      
      <BlogCategoryFilter
        posts={allPosts}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      {!hasSearchQuery && (
        <>
          {controlsComponent}
          <div className={styles.grid}>
            {filteredPosts.map((post) => (
              <BlogCard key={post.ID} post={post} />
            ))}
          </div>
          {filteredPosts.length === 0 && selectedCategory && (
            <div className={styles.emptyState}>
              <p>No posts found in this category.</p>
            </div>
          )}
          {showPagination && !selectedCategory && paginationComponent}
        </>
      )}
    </>
  );
}
