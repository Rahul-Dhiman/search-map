document.addEventListener("DOMContentLoaded", () => {
  const keywordInput = document.getElementById("keyword");
  const preview = document.getElementById("queryPreview");

  const operatorModules = [
    "exactMatch",
    "fileTypes",
    "forums",
    "pasteSites",
    "archives",
    "maxBreadth",
    "safeSearch"
  ];

  function buildBaseQuery() {
    let keyword = keywordInput.value.trim();
    if (!keyword) return "";

    if (document.getElementById("exactMatch").checked) {
      keyword = `"${keyword}"`;
    }

    if (document.getElementById("maxBreadth").checked) {
      keyword = `${keyword} OR ${keyword} 2026 OR ${keyword} download`;
    }

    return keyword;
  }

  function applyOperators(query) {
    if (!query) return "";

    if (document.getElementById("fileTypes").checked) {
      query += " (filetype:zip OR filetype:rar OR filetype:pdf OR filetype:docx)";
    }

    if (document.getElementById("forums").checked) {
      query += " (site:reddit.com OR site:forum.*)";
    }

    if (document.getElementById("pasteSites").checked) {
      query += " (site:pastebin.com OR site:hastebin.com)";
    }

    if (document.getElementById("archives").checked) {
      query += " (site:archive.org)";
    }

    const excludeDomain = document.getElementById("excludeDomain").value.trim();
    if (excludeDomain) {
      query += ` -site:${excludeDomain}`;
    }

    return query;
  }

  function buildGoogleURL(query) {
    const lang = document.getElementById("language").value;
    const region = document.getElementById("region").value;
    const results = document.getElementById("results").value;

    const safeParam = document.getElementById("safeSearch").checked ? "off" : "active";

    const encodedQuery = encodeURIComponent(query);
    return `https://www.google.com/search?q=${encodedQuery}&pws=0&safe=${safeParam}&filter=0&hl=${lang}&gl=${region}&num=${results}`;
  }

  function updatePreview() {
    let query = buildBaseQuery();
    query = applyOperators(query);
    preview.value = query;
    localStorage.setItem("lastQuery", query);
  }

  function handleSearch() {
    let query = buildBaseQuery();
    query = applyOperators(query);
    if (!query) {
      alert("Please enter a keyword.");
      return;
    }
    const url = buildGoogleURL(query);
    window.open(url, "_blank");
  }

  // Event listeners
  document.getElementById("searchBtn").addEventListener("click", handleSearch);
  document.getElementById("copyBtn").addEventListener("click", () => {
    preview.select();
    document.execCommand("copy");
    alert("Query copied!");
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });
  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  keywordInput.addEventListener("input", updatePreview);
  operatorModules.forEach(id => {
    document.getElementById(id).addEventListener("change", updatePreview);
  });
});
