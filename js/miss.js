// miss.js
// ミスタイプ数のグラフを表示

Sushizanmai.scatter({
    selector: ".miss",
    value: (d) => +d.miss,
    yDomain: (values) => [0, d3.max(values) + 20],
    format: d3.format("d"),
    xLabel: "plays",
    yUnit: "misses"
});
