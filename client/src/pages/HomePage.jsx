import { useMemo } from "react";
import { motion } from "framer-motion";
import HeroSlider from "../components/HeroSlider";
import AutoBanner from "../components/AutoBanner";
import SearchBooksSection from "../components/SearchBooksSection";
import BookGridSection from "../components/BookGridSection";
import UsefulLinksSection from "../components/UsefulLinksSection";
import ContactPreviewSection from "../components/ContactPreviewSection";
import { useBooks } from "../hooks/useBooks";
import { fadeIn, viewportConfig } from "../components/motion";
import { BOOK_CATEGORIES } from "../constants/categories";

const HomePage = () => {
  const { books, loading, error } = useBooks();
  const {
    books: mostSearched,
    loading: mostSearchedLoading,
    error: mostSearchedError
  } = useBooks({ sortBy: "mostSearched", limit: 4 }, { refreshIntervalMs: 15000 });
  const homeCategories = BOOK_CATEGORIES;

  const bestSellers = useMemo(() => books.filter((book) => book.isBestSeller).slice(0, 6), [books]);
  const categoryCounts = useMemo(
    () =>
      books.reduce((acc, book) => {
        acc[book.category] = (acc[book.category] || 0) + 1;
        return acc;
      }, {}),
    [books]
  );
  const categoriesWithCounts = useMemo(
    () =>
      homeCategories.map((category) => ({
        ...category,
        count: categoryCounts[category.value] || 0
      })),
    [homeCategories, categoryCounts]
  );

  return (
    <>
      <HeroSlider />
      <AutoBanner />
      <SearchBooksSection categories={categoriesWithCounts} />

      <motion.section
        className="section compact-section"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <div className="container">
          {loading || mostSearchedLoading ? <p className="status-text">Loading books...</p> : null}
          {error || mostSearchedError ? (
            <p className="status-text error">{error || mostSearchedError}</p>
          ) : null}
        </div>
      </motion.section>
      {!loading && !mostSearchedLoading && !error && !mostSearchedError ? (
        <>
          <BookGridSection
            title="Best Selling Books"
            kicker="Our Collection"
            actionLabel="View All Books"
            actionTo="/books"
            subtitle=""
            books={bestSellers}
          />
          <BookGridSection
            title="Most Searched Books"
            kicker="Trending Now"
            actionLabel="Browse Catalogue"
            actionTo="/books?sortBy=mostSearched"
            subtitle=""
            books={mostSearched}
            tone="cream"
          />
        </>
      ) : null}

      <UsefulLinksSection />
      <ContactPreviewSection />
    </>
  );
};

export default HomePage;

