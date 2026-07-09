import { useFetch } from "../hooks/useFetch";
import { inventoryApi } from "../services/api";

const Inventory = () => {
  const { data, loading, error } = useFetch(inventoryApi.getInventory);

  if (loading) return <p className="empty-state">Loading inventory...</p>;
  if (error) return <p className="empty-state error">{error}</p>;

  const renderTable = (title, books, badgeClass) => (
    <div className="admin-card">
      <h3>
        {title}{" "}
        <span className={`badge ${badgeClass}`}>{books.length}</span>
      </h3>
      {books.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-state">No items</p>
      )}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h2>Inventory</h2>
      </div>

      {renderTable("Low Stock Alerts", data?.lowStock || [], "badge-low")}
      {renderTable("Out of Stock", data?.outOfStock || [], "badge-out")}

      <div className="admin-card">
        <h3>All Books</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.books || []).map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.stock}</td>
                  <td>
                    {book.stock === 0 ? (
                      <span className="badge badge-out">Out of stock</span>
                    ) : book.stock <= 5 ? (
                      <span className="badge badge-low">Low stock</span>
                    ) : (
                      <span className="badge badge-contacted">In stock</span>
                    )}
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

export default Inventory;
