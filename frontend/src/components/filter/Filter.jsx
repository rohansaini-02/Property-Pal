import { useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    const newQuery = {
      ...query,
      [e.target.name]: e.target.value,
    };
    setQuery(newQuery);

    // Auto-reset results when city input is cleared
    if (e.target.name === "city" && e.target.value.trim() === "") {
      const filteredQuery = {};
      Object.entries(newQuery).forEach(([key, value]) => {
        if (value !== "" && value !== "0" && value !== 0) {
          filteredQuery[key] = value;
        }
      });
      setSearchParams(filteredQuery);
    }
  };

  const handleFilter = (e) => {
    if (e) e.preventDefault();
    // Only include non-empty values in the query string
    const filteredQuery = {};
    Object.entries(query).forEach(([key, value]) => {
      if (value !== "" && value !== "0" && value !== 0) {
        filteredQuery[key] = value;
      }
    });
    setSearchParams(filteredQuery);
  };

  const cityLabel = searchParams.get("city");

  return (
    <div className="filter">
      <h1>
        {cityLabel
          ? <>Search results for <b>{cityLabel}</b></>
          : "All Properties"
        }
      </h1>
      <form onSubmit={handleFilter}>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City Location"
            onChange={handleChange}
            value={query.city}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Type</label>
          <select name="type" id="type" onChange={handleChange} value={query.type}>
            <option value="">any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Property</label>
          <select name="property" id="property" onChange={handleChange} value={query.property}>
            <option value="">any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="any"
            onChange={handleChange}
            value={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="any"
            onChange={handleChange}
            value={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Bedroom</label>
          <input
            type="number"
            id="bedroom"
            name="bedroom"
            placeholder="any"
            min={0}
            onChange={handleChange}
            value={query.bedroom}
          />
        </div>
        <button type="submit">
          <img src="/search.png" alt="" />
        </button>
      </div>
      </form>
    </div>
  );
}

export default Filter;
