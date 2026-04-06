(function trackmanBrowserExtract() {
  function clean(text) {
    return (text || "")
      .replace(/\s+/g, " ")
      .replace(/\u00a0/g, " ")
      .trim();
  }

  function visible(element) {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      rect.width > 0 &&
      rect.height > 0
    );
  }

  function textOf(element) {
    return clean(element.innerText || element.textContent || "");
  }

  function collectTables() {
    return Array.from(document.querySelectorAll("table"))
      .filter(visible)
      .map((table, index) => {
        const rows = Array.from(table.querySelectorAll("tr")).map((row) =>
          Array.from(row.querySelectorAll("th,td"))
            .map((cell) => textOf(cell))
            .filter(Boolean)
        ).filter((row) => row.length > 0);

        return {
          index,
          rows,
        };
      })
      .filter((table) => table.rows.length > 0);
  }

  function collectMetricBlocks() {
    const candidates = Array.from(document.querySelectorAll("div, section, article, li"))
      .filter(visible)
      .map((element) => {
        const text = textOf(element);
        return {
          element,
          text,
          lineCount: text ? text.split(/\n/).length : 0,
        };
      })
      .filter((item) => item.text)
      .filter((item) => item.lineCount >= 2 && item.lineCount <= 12)
      .filter((item) => /(carry|ball speed|club speed|spin|attack|side|total|launch|smash)/i.test(item.text))
      .slice(0, 200);

    return candidates.map((item, index) => ({
      index,
      text: item.text,
    }));
  }

  function collectLinks() {
    return Array.from(document.querySelectorAll("a[href]"))
      .filter(visible)
      .map((link) => ({
        text: textOf(link),
        href: link.href,
      }))
      .filter((link) => link.text || link.href)
      .slice(0, 200);
  }

  function collectClubRows(lines) {
    return lines.filter((line) =>
      /\b(driver|dr|3wood|3w|5wood|5w|7wood|7w|4hybrid|4h|5hybrid|5h|7iron|7i|8iron|8i|9iron|9i|pw|sw)\b/i.test(line)
    );
  }

  function parseMetricLines(lines) {
    return lines
      .map((line) => {
        const lower = line.toLowerCase();
        const numbers = Array.from(line.matchAll(/-?\d+(?:\.\d+)?/g)).map((match) => Number(match[0]));
        return {
          raw: line,
          numbers,
          hasCarry: lower.includes("carry"),
          hasSide: lower.includes("side"),
          hasTotal: lower.includes("total"),
          hasSpin: lower.includes("spin"),
          hasLeft: /(^|[^a-z])l([^a-z]|$)|left|左/i.test(line),
          hasRight: /(^|[^a-z])r([^a-z]|$)|right|右/i.test(line),
        };
      })
      .filter((item) => item.numbers.length > 0);
  }

  function triggerDownload(filename, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const visibleText = clean(document.body.innerText || "");
  const lines = visibleText
    .split(/\n+/)
    .map((line) => clean(line))
    .filter(Boolean);

  const payload = {
    extractedAt: new Date().toISOString(),
    title: document.title,
    url: location.href,
    visibleText,
    lines,
    tables: collectTables(),
    metricBlocks: collectMetricBlocks(),
    links: collectLinks(),
    clubRows: collectClubRows(lines),
    parsedMetricLines: parseMetricLines(lines),
  };

  const filename = `trackman-extract-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  triggerDownload(filename, JSON.stringify(payload, null, 2));

  console.log("Trackman extract saved:", filename);
  console.log(payload);
  return payload;
})();
