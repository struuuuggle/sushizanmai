// keys.js
// 正しく打ったキーの数のグラフを表示

Sushizanmai.scatter({
    selector: ".keys",
    value: (d) => +d.keys,
    yDomain: (values) => [0, d3.max(values)],
    format: d3.format("d"),
    xLabel: "plays",
    yUnit: "keys"
});
