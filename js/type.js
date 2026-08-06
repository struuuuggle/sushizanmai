// type.js
// 総タイプ数のグラフを表示

Sushizanmai.scatter({
    selector: ".type",
    value: (d) => +d.type,
    yDomain: (values) => [500, d3.max(values)],
    format: d3.format("d")
});
