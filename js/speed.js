// speed.js
// タイピング速度のグラフを表示

Sushizanmai.scatter({
    selector: ".speed",
    value: (d) => +d.speed,
    yDomain: (values) => [0, d3.max(values)],
    format: d3.format(".1f"),
    xLabel: "plays",
    yUnit: "keys/sec"
});
