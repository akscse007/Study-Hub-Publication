import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import BookCard from "../components/BookCard";
import SectionHeader from "../components/SectionHeader";
import { useBooks } from "../hooks/useBooks";
import { fadeUp, viewportConfig } from "../components/motion";
const categories = [
  { label: "Pre School", value: "Pre School" },
  { label: "Nursery", value: "Nursery" },
  { label: "General Course", value: "General Course" },
  { label: "Madhyamik", value: "Madhyamik" },
  { label: "Higher Secondary", value: "H.S." }
];

const BooksPage = () => {
  const [params, setParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(params.get("search") || "");
  const currentCategory = params.get("category") || "";
  const currentSort = params.get("sortBy") || "";

  const query = useMemo(
    () => ({
      search: params.get("search") || "",
      category: currentCategory,
      sortBy: currentSort
    }),
    [params, currentCategory, currentSort]
  );

  const { books, loading, error } = useBooks(query);

  const onFilter = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (searchInput.trim()) next.set("search", searchInput.trim());
    else next.delete("search");
    setParams(next);
  };

  const onCategoryChange = (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set("category", value);
    else next.delete("category");
    setParams(next);
  };

  return (
    <motion.section
      className="section books-page"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container">
        <SectionHeader title="Books" subtitle="Browse our complete books catalogue from MongoDB." />
        <form onSubmit={onFilter} className="search-panel books-search-panel">
          <div className="input-group">
            <label htmlFor="books-search">Search</label>
            <input
              id="books-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title or author"
            />
          </div>
          <div className="input-group">
            <label htmlFor="books-category">Category</label>
            <select
              id="books-category"
              value={currentCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-primary" type="submit">
            Apply
          </button>
        </form>

        {loading ? <p className="status-text">Loading books...</p> : null}
        {error ? <p className="status-text error">{error}</p> : null}

        {!loading && !error && (
          <div className="books-grid-wrap">
            <div className="book-grid">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default BooksPage;

