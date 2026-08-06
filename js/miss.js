// miss.js
// Render the miss count graph.

import { scatter } from "./chart.js";

scatter({
    selector: ".miss",
    value: (d) => +d.miss,
    yDomain: (values) => [0, d3.max(values) + 20],
    format: d3.format("d"),
    xLabel: "plays",
    yUnit: "misses"
});
