// speed.js
// Render the typing speed graph.

import { scatter } from "./chart.js";

scatter({
    selector: ".speed",
    value: (d) => +d.speed,
    yDomain: (values) => [0, d3.max(values)],
    format: d3.format(".1f"),
    xLabel: "plays",
    yUnit: "keys/sec"
});
