import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "../hooks/useForm";
import { adminBookApi } from "../services/api";
import { parseImageList, getBookImages, getBookCover } from "../../utils/bookImages";
import { FaEdit, FaTrash, FaPlus, FaFilter } from "react-icons/fa";

const CATEGORIES = ["Nursery", "Primary", "General Course", "Madhyamik", "H.S."];

const filterCheckRow = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "8px",
  fontWeight: "normal",
  // Comfortable touch target on mobile — rows would otherwise be ~18px tall.
  padding: "6px 0"
};

const filterCheckBox = { width: "16px", height: "16px", flexShrink: 0, margin: 0 };

const emptyBook = {
  title: "",
  author: "",
  description: "",
  isbn: "",
  rating: "",
  category: "",
  imagesText: "",
  price: "",
  stock: "",
  isBestSeller: false,
  isFeatured: false
};

const Books = () => {
  const { data: books, loading, error, refetch } = useFetch(adminBookApi.getBooks);
  const [search, setSearch] = useState("");
  // Per group: `selected` drives filtering (empty = no filtering); `all` is an
  // explicit UI selection, mutually exclusive with `selected` entries.
  const [filters, setFilters] = useState({
    categories: { all: true, selected: [] },
    stocks: { all: true, selected: [] },
    tags: { all: true, selected: [] }
  });
  const [draftFilters, setDraftFilters] = useState(filters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const { values, setValues, handleChange, reset } = useForm(emptyBook);

  // Lock background scrolling while the filter panel is open (mobile scroll
  // chaining would otherwise move the page behind the overlay).
  useEffect(() => {
    if (!isFilterOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isFilterOpen]);

  const openCreate = () => {
    setEditingBook(null);
    reset(emptyBook);
    setIsModalOpen(true);
  };

  const openEdit = (book) => {
    setEditingBook(book);
    setValues({
      title: book.title,
      author: book.author ?? "",
      description: book.description ?? "",
      isbn: book.isbn ?? "",
      rating: book.rating ?? "",
      category: book.category,
      imagesText: getBookImages(book).join("\n"),
      // Older documents may lack price/stock; undefined would make the inputs
      // uncontrolled and submit NaN to the API.
      price: book.price ?? "",
      stock: book.stock ?? "",
      isBestSeller: book.isBestSeller,
      isFeatured: book.isFeatured
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const images = parseImageList(values.imagesText);
    if (!images.length) {
      alert("Please provide at least one valid image URL (http/https).");
      return;
    }
    const { imagesText, ...rest } = values;
    const payload = {
      ...rest,
      images,
      rating: Number(values.rating) || 0,
      price: Number(values.price) || 0,
      stock: Number(values.stock) || 0
    };
    try {
      if (editingBook) {
        await adminBookApi.updateBook(editingBook._id, payload);
      } else {
        await adminBookApi.createBook(payload);
      }
      closeModal();
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await adminBookApi.deleteBook(id);
      await refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const openFilters = () => {
    setDraftFilters(filters);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    setFilters(draftFilters);
    setIsFilterOpen(false);
  };

  const toggleDraft = (group, value) => {
    setDraftFilters((draft) => {
      const { selected } = draft[group];
      return {
        ...draft,
        [group]: selected.includes(value)
          ? { ...draft[group], selected: selected.filter((v) => v !== value) }
          : { all: false, selected: [...selected, value] }
      };
    });
  };

  const selectAllDraft = (group) => {
    setDraftFilters((draft) => ({
      ...draft,
      [group]: { all: true, selected: [] }
    }));
  };

  const filteredBooks = (books || []).filter((book) => {
    const matchesSearch =
      !search ||
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      (book.author || "").toLowerCase().includes(search.toLowerCase()) ||
      (book.isbn || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !filters.categories.selected.length || filters.categories.selected.includes(book.category);
    const matchesStock =
      !filters.stocks.selected.length ||
      filters.stocks.selected.some(
        (s) =>
          (s === "low" && book.stock > 0 && book.stock <= 5) ||
          (s === "out" && book.stock === 0)
      );
    const matchesTag =
      !filters.tags.selected.length ||
      filters.tags.selected.some(
        (t) =>
          (t === "bestseller" && book.isBestSeller) ||
          (t === "featured" && book.isFeatured)
      );
    return matchesSearch && matchesCategory && matchesStock && matchesTag;
  });

  if (loading) return <p className="empty-state">Loading books...</p>;
  if (error) return <p className="empty-state error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Book Management</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus /> Add Book
        </button>
      </div>

      <div className="admin-card">
        <div className="toolbar">
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search title, author, ISBN"
              aria-label="Search title, author, ISBN"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-secondary btn-sm" onClick={openFilters}>
              <FaFilter /> Filter
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book._id}>
                  <td>
                    <img src={getBookCover(book)} alt={book.title} className="cover-thumb" />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>₹{book.price}</td>
                  <td>{book.stock}</td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button className="btn btn-secondary btn-sm" aria-label={`Edit ${book.title}`} onClick={() => openEdit(book)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger btn-sm" aria-label={`Delete ${book.title}`} onClick={() => handleDelete(book._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFilterOpen && (
        <div className="modal-overlay" onClick={() => setIsFilterOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Filters</h3>
              <button className="icon-btn" onClick={() => setIsFilterOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body admin-form">
              {[
                {
                  group: "categories",
                  title: "Category",
                  allLabel: "All categories",
                  options: CATEGORIES.map((c) => ({ value: c, label: c }))
                },
                {
                  group: "stocks",
                  title: "Stock",
                  allLabel: "All stock",
                  options: [
                    { value: "low", label: "Low stock" },
                    { value: "out", label: "Out of stock" }
                  ]
                },
                {
                  group: "tags",
                  title: "Tag",
                  allLabel: "All tags",
                  options: [
                    { value: "bestseller", label: "Best Seller" },
                    { value: "featured", label: "Featured" }
                  ]
                }
              ].map(({ group, title, allLabel, options }) => (
                <fieldset key={group} className="form-group" style={{ border: 0, padding: 0, margin: 0 }}>
                  <legend style={{ padding: 0 }}>
                    <label>{title}</label>
                  </legend>
                  <label style={filterCheckRow}>
                    <input
                      type="checkbox"
                      style={filterCheckBox}
                      checked={draftFilters[group].all}
                      onChange={() => selectAllDraft(group)}
                    />
                    {allLabel}
                  </label>
                  {options.map(({ value, label }) => (
                    <label key={value} style={filterCheckRow}>
                      <input
                        type="checkbox"
                        style={filterCheckBox}
                        checked={draftFilters[group].selected.includes(value)}
                        onChange={() => toggleDraft(group, value)}
                      />
                      {label}
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsFilterOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={applyFilters}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingBook ? "Edit Book" : "Add Book"}</h3>
              <button className="icon-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="book-title">Title</label>
                    <input id="book-title" className="admin-input" name="title" value={values.title} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="book-author">Author (optional)</label>
                    <input id="book-author" className="admin-input" name="author" value={values.author} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="book-isbn">ISBN (optional)</label>
                    <input id="book-isbn" className="admin-input" name="isbn" value={values.isbn} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="book-rating">Rating (optional)</label>
                    <input
                      id="book-rating"
                      className="admin-input"
                      type="number"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={values.rating}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="book-category">Category</label>
                    <select id="book-category" className="admin-select" name="category" value={values.category} onChange={handleChange} required>
                      <option value="">Select</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="book-images">Cover Image URLs</label>
                  <textarea
                    id="book-images"
                    className="admin-textarea"
                    name="imagesText"
                    value={values.imagesText}
                    onChange={handleChange}
                    placeholder={"One URL per line, or comma separated.\nThe first URL becomes the main cover."}
                    rows={4}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="book-price">Price (₹)</label>
                    <input id="book-price" className="admin-input" type="number" name="price" min="0" value={values.price} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="book-stock">Stock (optional)</label>
                    <input id="book-stock" className="admin-input" type="number" name="stock" min="0" value={values.stock} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="book-description">Description</label>
                  <textarea id="book-description" className="admin-textarea" name="description" value={values.description} onChange={handleChange} />
                </div>
                <div className="form-row" style={{ gridTemplateColumns: "repeat(2, minmax(0, auto))", justifyContent: "start" }}>
                  <label className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
                    <input type="checkbox" name="isBestSeller" checked={values.isBestSeller} onChange={handleChange} />
                    Best Seller
                  </label>
                  <label className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
                    <input type="checkbox" name="isFeatured" checked={values.isFeatured} onChange={handleChange} />
                    Featured
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBook ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
