import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "../hooks/useForm";
import { adminBookApi } from "../services/api";
import { parseImageList, getBookImages, getBookCover } from "../../utils/bookImages";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

const CATEGORIES = ["Pre School", "Nursery", "General Course", "Madhyamik", "H.S."];

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
  const [category, setCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const { values, setValues, handleChange, reset } = useForm(emptyBook);

  const openCreate = () => {
    setEditingBook(null);
    reset(emptyBook);
    setIsModalOpen(true);
  };

  const openEdit = (book) => {
    setEditingBook(book);
    setValues({
      title: book.title,
      author: book.author,
      description: book.description,
      isbn: book.isbn,
      rating: book.rating,
      category: book.category,
      imagesText: getBookImages(book).join("\n"),
      price: book.price,
      stock: book.stock,
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
      rating: Number(values.rating),
      price: Number(values.price),
      stock: Number(values.stock)
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

  const applyFilters = async () => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (category) params.category = category;
    if (stockStatus) params.stockStatus = stockStatus;
    // useFetch doesn't support dynamic fetcher args easily, refetch uses initial fetcher
    // workaround: reload with query string via window or keep simple local filter
    // For now, refetch all and filter client-side
    await refetch();
  };

  const filteredBooks = (books || []).filter((book) => {
    const matchesSearch =
      !search ||
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || book.category === category;
    const matchesStock =
      !stockStatus ||
      (stockStatus === "low" && book.stock > 0 && book.stock <= 5) ||
      (stockStatus === "out" && book.stock === 0);
    return matchesSearch && matchesCategory && matchesStock;
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="admin-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select className="admin-select" value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
              <option value="">All stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
            <button className="btn btn-secondary btn-sm" onClick={applyFilters}>
              <FaSearch /> Filter
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
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(book)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book._id)}>
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
                    <label>Title</label>
                    <input className="admin-input" name="title" value={values.title} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Author</label>
                    <input className="admin-input" name="author" value={values.author} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>ISBN</label>
                    <input className="admin-input" name="isbn" value={values.isbn} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Rating</label>
                    <input
                      className="admin-input"
                      type="number"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={values.rating}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select className="admin-select" name="category" value={values.category} onChange={handleChange} required>
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
                  <label>Cover Image URLs</label>
                  <textarea
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
                    <label>Price (₹)</label>
                    <input className="admin-input" type="number" name="price" min="0" value={values.price} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input className="admin-input" type="number" name="stock" min="0" value={values.stock} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="admin-textarea" name="description" value={values.description} onChange={handleChange} />
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
