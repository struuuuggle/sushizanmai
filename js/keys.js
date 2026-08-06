// keys.js
// Render the correctly-typed key count graph.

import { scatter } from "./chart.js";

scatter({
    selector: ".keys",
    value: (d) => +d.keys,
    yDomain: (values) => [0, d3.max(values)],
    format: d3.format("d"),
    xLabel: "plays",
    yUnit: "keys"
});
