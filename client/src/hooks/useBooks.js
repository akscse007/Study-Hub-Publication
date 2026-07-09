import { useEffect, useState, useCallback, useRef } from "react";
import { bookApi } from "../services/api";

export const useBooks = (params = {}, options = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { refreshIntervalMs = 0 } = options;
  const paramsKey = JSON.stringify(params);
  const fetchRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let intervalId;

    const fetchBooks = async (showLoader = false) => {
      try {
        if (showLoader) {
          setLoading(true);
        }
        setError("");
        const data = await bookApi.getBooks(params);
        if (!cancelled) {
          setBooks(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load books");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRef.current = fetchBooks;

    fetchBooks(true);
    if (refreshIntervalMs > 0) {
      intervalId = setInterval(() => {
        fetchBooks(false);
      }, refreshIntervalMs);
    }
    return () => {
      cancelled = true;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [paramsKey, refreshIntervalMs]);

  const refetch = useCallback(() => {
    fetchRef.current?.(false);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      refetch();
    };
    window.addEventListener("studyhub:books-updated", handleUpdate);
    return () => window.removeEventListener("studyhub:books-updated", handleUpdate);
  }, [refetch]);

  return { books, loading, error, refetch };
};
