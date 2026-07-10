import { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { searchPlaces } from "../utils/geocode";

// Debounced location autocomplete backed by Nominatim. Calls onSelect(place) with
// { displayName, shortName, latitude, longitude, area, district }.
const LocationAutocomplete = ({
  onSelect,
  placeholder = "Search a location...",
  defaultValue = "",
  inputClassName = "loc-ac-input"
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [searching, setSearching] = useState(false);
  const skipSearch = useRef(false);

  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return undefined;
    }
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setResults([]);
      setOpen(false);
      return undefined;
    }
    const controller = new AbortController();
    // 450ms debounce also keeps us under Nominatim's 1 req/s usage policy
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const places = await searchPlaces(trimmed, { signal: controller.signal });
        setResults(places);
        setActive(-1);
        setOpen(true);
      } catch (err) {
        if (err.name !== "AbortError") {
          setResults([]);
          setOpen(false);
        }
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const choose = (place) => {
    skipSearch.current = true;
    setQuery(place.displayName);
    setResults([]);
    setOpen(false);
    onSelect(place);
  };

  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active >= 0 ? active : 0]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="loc-ac">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-label={placeholder}
        className={inputClassName}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {searching && <span className="loc-ac-spinner" aria-hidden="true" />}
      {open && results.length > 0 && (
        <ul className="loc-ac-list" role="listbox">
          {results.map((place, index) => (
            <li
              key={`${place.latitude},${place.longitude}`}
              role="option"
              aria-selected={index === active}
              className={index === active ? "loc-ac-item active" : "loc-ac-item"}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(place);
              }}
              onMouseEnter={() => setActive(index)}
            >
              <strong>
                <FaMapMarkerAlt aria-hidden="true" /> {place.shortName}
              </strong>
              <small>{place.displayName}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
