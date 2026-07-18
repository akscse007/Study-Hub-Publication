import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";
import SectionHeader from "./SectionHeader";
import { fadeUp, viewportConfig } from "./motion";
const defaultCategories = [
  { label: "Nursery", value: "Nursery", count: 0 },
  { label: "Primary", value: "Primary", count: 0 },
  { label: "General Course", value: "General Course", count: 0 },
  { label: "Madhyamik", value: "Madhyamik", count: 0 },
  { label: "Higher Secondary", value: "H.S.", count: 0 }
];

const SearchBooksSection = ({ categories = defaultCategories }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    navigate(`/books${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <motion.section
      className="section search-books-section"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container">
        <SectionHeader
          title="Search Books"
          subtitle="Find the right book for every stage of learning"
        />
        <form className="search-panel" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              id="book-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
            />
          </div>
          <div className="input-group">
            <select id="book-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary search-submit">
            Search
          </button>
        </form>
        <div className="category-list">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.value}
              className="category-chip"
              onClick={() => navigate(`/books?category=${encodeURIComponent(cat.value)}`)}
            >
              <span>
                <FaBookOpen />
              </span>
              <strong>{cat.label}</strong>
              <small>{cat.count} Books</small>
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default SearchBooksSection;

