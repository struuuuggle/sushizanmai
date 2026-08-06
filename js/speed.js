// speed.js
// タイピング速度のグラフを表示

Sushizanmai.scatter({
    selector: ".speed",
    value: (d) => +d.speed,
    yDomain: (values) => [4.0, d3.max(values)],
    format: d3.format(".1f")
});
