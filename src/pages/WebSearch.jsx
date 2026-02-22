import React, { useState } from "react";

export default function WebSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const mockResults = [
    { title: "React Documentation", url: "react.dev", snippet: "The library for web and native user interfaces" },
    { title: "Vite - Next Generation Frontend Tooling", url: "vitejs.dev", snippet: "Get ready for a development environment that can finally catch up with you" },
    { title: "MDN Web Docs", url: "developer.mozilla.org", snippet: "Resources for developers, by developers" },
    { title: "Stack Overflow", url: "stackoverflow.com", snippet: "Where developers learn, share, & build careers" },
    { title: "GitHub", url: "github.com", snippet: "Where the world builds software" },
  ];

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      setResults(mockResults.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.snippet.toLowerCase().includes(query.toLowerCase())
      ));
      if (results.length === 0) setResults(mockResults.slice(0, 3));
      setSearching(false);
    }, 500);
  }

  return (
    <div className="page-container">
      <style>{css}</style>

      <div className="search-hero">
        <h1>Web Search</h1>
        <p>Search the web from your dashboard</p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search anything..."
          />
          <button type="submit">
            {searching ? "..." : "Search"}
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="results">
          <h3>{results.length} results for "{query}"</h3>
          {results.map((r, i) => (
            <div key={i} className="result-item">
              <span className="result-url">{r.url}</span>
              <h4 className="result-title">{r.title}</h4>
              <p className="result-snippet">{r.snippet}</p>
            </div>
          ))}
        </div>
      )}

      <div className="quick-links">
        <h3>Quick Links</h3>
        <div className="links-grid">
          {["Google", "GitHub", "Stack Overflow", "NPM", "MDN", "DevDocs"].map(link => (
            <button key={link} className="quick-link">{link}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

const css = `
.page-container {
  padding: 30px;
  color: white;
  min-height: 100%;
}

.search-hero {
  text-align: center;
  padding: 60px 20px;
}

.search-hero h1 {
  margin: 0;
  font-size: 36px;
}

.search-hero p {
  color: rgba(255,255,255,0.6);
  margin: 10px 0 30px;
}

.search-form {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  gap: 12px;
}

.search-form input {
  flex: 1;
  padding: 16px 24px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 14px;
  color: white;
  font-size: 16px;
}

.search-form button {
  padding: 16px 32px;
  background: #7c3aed;
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.search-form button:hover {
  background: #6d28d9;
}

.results {
  max-width: 700px;
  margin: 0 auto 40px;
}

.results h3 {
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 20px;
}

.result-item {
  padding: 20px;
  background: rgba(255,255,255,0.04);
  border-radius: 12px;
  margin-bottom: 12px;
}

.result-url {
  font-size: 12px;
  color: #22c55e;
}

.result-title {
  margin: 6px 0;
  font-size: 18px;
  color: #60a5fa;
}

.result-snippet {
  margin: 0;
  font-size: 14px;
  color: rgba(255,255,255,0.7);
}

.quick-links {
  max-width: 600px;
  margin: 0 auto;
}

.quick-links h3 {
  font-size: 16px;
  margin-bottom: 16px;
  text-align: center;
}

.links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.quick-link {
  padding: 10px 20px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

.quick-link:hover {
  background: rgba(255,255,255,0.1);
}
`;
