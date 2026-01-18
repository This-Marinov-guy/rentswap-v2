"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { WordPressPost } from "@/lib/wordpress";
import styles from "./BlogCategoryFilter.module.css";

interface BlogCategoryFilterProps {
  posts: WordPressPost[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export default function BlogCategoryFilter({
  posts,
  selectedCategory,
  onCategorySelect,
}: BlogCategoryFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();

    posts.forEach((post) => {
      Object.values(post.categories || {}).forEach((category) => {
        if (category.name !== "Uncategorized") {
          const count = categoryMap.get(category.name) || 0;
          categoryMap.set(category.name, count + 1);
        }
      });
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Sort by count (most posts first)
  }, [posts]);

  // Check if we need to show arrows based on scroll position
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      // Check after a short delay to ensure layout is complete
      setTimeout(checkScroll, 100);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Don't render if no categories
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className={styles.categoryFilterContainer}>
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className={styles.scrollArrow}
          aria-label="Scroll left"
        >
          ‹
        </button>
      )}
      <div
        ref={scrollContainerRef}
        className={styles.categoryList}
      >
        <button
          onClick={() => onCategorySelect(null)}
          className={`${styles.categoryButton} ${
            selectedCategory === null ? styles.active : ""
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategorySelect(category.name)}
            className={`${styles.categoryButton} ${
              selectedCategory === category.name ? styles.active : ""
            }`}
          >
            {category.name}
            <span className={styles.categoryCount}>({category.count})</span>
          </button>
        ))}
      </div>
      {showRightArrow && (
        <button
          onClick={scrollRight}
          className={styles.scrollArrow}
          aria-label="Scroll right"
        >
          ›
        </button>
      )}
    </div>
  );
}
