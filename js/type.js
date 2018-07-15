// type.jso
// 総タイプ数のグラフを表示

var parseTime = d3.timeParse("%Y%m%d");

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960,
    height = 500;

/* axis */
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

/* line */
var lineType = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.type); });

/* Generate svg */
var svgType = d3.select(".type").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

// データ読み込み
d3.csv("../data/score.csv").then(function(data) {

    /* format the data */
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.type = +d.type;
    });

    /* Scale the range of the data */
    /* y.domain: [ymin, ymax] */
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.type; })]);

   // Add the X Axis
    svgType.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));

   // Add the Y Axis
    svgType.append("g")
       .call(d3.axisLeft(y));

    /* Draw the line */
    svgType.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", lineType);
});
