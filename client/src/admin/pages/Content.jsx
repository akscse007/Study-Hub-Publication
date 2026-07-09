import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { contentApi, adminBookApi } from "../services/api";

const Content = () => {
  const { data, loading, error, refetch } = useFetch(contentApi.getContent);
  const { data: books } = useFetch(adminBookApi.getBooks);
  const [homepage, setHomepage] = useState({ heroTitle: "", heroSubtitle: "" });
  const [featuredIds, setFeaturedIds] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setHomepage(data.homepage || { heroTitle: "", heroSubtitle: "" });
      setFeaturedIds((data.featuredBooks || []).map((b) => b._id));
    }
  }, [data]);

  const handleHomepageChange = (e) => {
    setHomepage((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleFeatured = (id) => {
    setFeaturedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await contentApi.updateContent({ featuredBookIds: featuredIds, homepage });
      await refetch();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="empty-state">Loading content...</p>;
  if (error) return <p className="empty-state error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Content Management</h2>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="admin-card">
        <h3>Homepage Content</h3>
        <div className="admin-form">
          <div className="form-group">
            <label>Hero Title</label>
            <input
              className="admin-input"
              name="heroTitle"
              value={homepage.heroTitle}
              onChange={handleHomepageChange}
            />
          </div>
          <div className="form-group">
            <label>Hero Subtitle</label>
            <input
              className="admin-input"
              name="heroSubtitle"
              value={homepage.heroSubtitle}
              onChange={handleHomepageChange}
            />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3>Featured Books</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Featured</th>
              </tr>
            </thead>
            <tbody>
              {(books || []).map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={featuredIds.includes(book._id)}
                      onChange={() => toggleFeatured(book._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Content;
