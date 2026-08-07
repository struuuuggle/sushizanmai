// latest.js
// Fill the latest-record banner with the most recent play.

import { scores } from "./chart.js";

const formatDate = d3.timeFormat("%Y/%m/%d");

/* id -> how to render that field of the row */
const fields = {
    "latest-keys": (d) => d3.format("d")(+d.keys),
    "latest-speed": (d) => d3.format(".1f")(+d.speed),
    "latest-miss": (d) => d3.format("d")(+d.miss),
};

scores.then((rows) => {
    // The CSV is append-only in play order, so the last row is the latest
    const latest = rows[rows.length - 1];
    if (!latest) return;

    for (const [id, format] of Object.entries(fields)) {
        document.getElementById(id).textContent = format(latest);
    }
    document.getElementById("latest-meta").textContent =
        formatDate(latest.date) + " (No. " + latest.index + ")";
});
