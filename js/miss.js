// miss.js
// ミスタイプ数のグラフを表示

var parseTime = d3.timeParse("%Y%m%d");

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960,
    height = 500;

/* axis */
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

/* line */
var lineMiss = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.miss); })
    .curve(d3.curveStepBefore); // Step(始点)

/* Generate svg */
var svgMiss = d3.select(".miss").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

// Load the data
d3.csv("https://raw.githubusercontent.com/struuuuggle/sushizanmai/master/dat/score.csv").then(function(data) {
    /* format the data */
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.miss = +d.miss;
    });

    /* Scale the range of the data */
    /* y.domain: [ymin, ymax] */
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.miss + 20; })]);

   // Add the X Axis
    svgMiss.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x));

   // Add the Y Axis
    svgMiss.append("g")
       .call(d3.axisLeft(y));

    /* Draw the line */
    svgMiss.append("path")
       .datum(data)
       .attr("class", "line")
       .attr("d", lineMiss);
});
