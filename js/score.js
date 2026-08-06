// score.js
// 0.01 * (type - miss) * speedで算出される指標のグラフを描画

Sushizanmai.scatter({
    selector: ".score",
    value: (d) => 0.01 * (+d.type - +d.miss) * +d.speed,
    yDomain: (values) => [0, d3.max(values)],
    format: d3.format(".1f")
});
