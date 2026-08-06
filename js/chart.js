// chart.js
// 散布図の共通描画モジュール。
// 各グラフのスクリプトは Sushizanmai.scatter({...}) に設定を渡すだけでよい。

(function () {
    'use strict';

    const parseTime = d3.timeParse("%Y%m%d");
    const formatDate = d3.timeFormat("%Y/%m/%d");

    /**
     * Render a scatter plot with x-axis zoom/pan and hover tooltips.
     *
     * config = {
     *   selector: ".keys",                 // container div; also used for the clipPath id
     *   value:    (d) => +d.keys,          // CSV row -> y value
     *   yDomain:  (values) => [lo, hi],    // y values -> y domain
     *   format:   d3.format("d"),          // y value -> tooltip label
     *   xLabel:   "plays",                 // optional x-axis label
     *   yUnit:    "keys"                   // optional y-axis unit label
     * }
     */
    function scatter(config) {
        const margin = {top: 20, right: 20, bottom: 45, left: 50},
              width = 960,
              height = 500;

        /* axis */
        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        // Keep only integer ticks so zooming never shows fractional indices
        const xAxis = (scale) => d3.axisBottom(scale)
            .tickValues(scale.ticks().filter(Number.isInteger))
            .tickFormat(d3.format("d"))
            .tickSizeOuter(0);

        // x scale reflecting the current zoom transform
        let zx = x;

        /* Generate svg. A viewBox (instead of fixed width/height) lets CSS
           scale the chart down to the container width on narrow screens;
           all internal coordinates stay in viewBox user units, so zoom and
           tooltip math is unaffected. */
        const svgRoot = d3.select(config.selector).append("svg")
                    .attr("class", "chart-svg")
                    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) +
                          " " + (height + margin.top + margin.bottom));
        const svg = svgRoot.append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");

        // Clip dots to the plot area so panning doesn't spill over the axes
        const clipId = "clip-" + config.selector.replace(/^\./, "");
        svg.append("defs").append("clipPath")
            .attr("id", clipId)
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        // Gridline layer sits before the plot group so dots draw on top
        const gridG = svg.append("g")
            .attr("class", "grid");

        const plot = svg.append("g")
            .attr("clip-path", "url(#" + clipId + ")");

        // データ読み込み
        d3.csv("./data/score.csv").then(function (data) {

            /* format the data */
            data.forEach(function (d, i) {
                d.date = parseTime(d.date);
                d.index = i + 1; // CSV line number minus the header line
                d.value = config.value(d);
            });

            /* Scale the range of the data, padded slightly beyond the
               extremes so dots on the edges aren't clipped by the plot area */
            const [minIndex, maxIndex] = d3.extent(data, (d) => d.index);
            const xPad = (maxIndex - minIndex) * 0.01;
            x.domain([minIndex - xPad, maxIndex + xPad]);
            const [yMin, yMax] = config.yDomain(data.map((d) => d.value));
            y.domain([yMin, yMax + (yMax - yMin) * 0.02]);

            // Horizontal gridlines; y never zooms, so drawing once is enough
            gridG.call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""));
            gridG.select(".domain").remove();

            // Add the X Axis
            const xAxisG = svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis(x));

            // Add the Y Axis
            svg.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y).tickSizeOuter(0));

            /* Axis labels: the x label sits below the tick labels at the
               right edge, the y unit sits above the tick label column */
            if (config.xLabel) {
                svg.append("text")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "end")
                    .attr("x", width)
                    .attr("y", height + 40)
                    .text(config.xLabel);
            }
            if (config.yUnit) {
                // Start-anchored at the SVG's left edge so long units
                // ("keys/sec") aren't clipped by the left margin
                svg.append("text")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "start")
                    .attr("x", -margin.left + 2)
                    .attr("y", -8)
                    .text(config.yUnit);
            }

            /* Draw the dots */
            const dots = plot.selectAll("circle.dot")
                .data(data)
                .join("circle")
                .attr("class", "dot")
                .attr("r", 4)
                .attr("cx", (d) => x(d.index))
                .attr("cy", (d) => y(d.value));

            /* Tooltip (drawn inside the SVG so it scales with the viewBox
               and never escapes the chart card) */
            const tooltip = svg.append("g")
                .attr("class", "tooltip")
                .style("display", "none");
            const tooltipRect = tooltip.append("rect")
                .attr("rx", 4);
            const tooltipDate = tooltip.append("text").attr("class", "tooltip-text");
            const tooltipIndex = tooltip.append("text").attr("class", "tooltip-text");
            const tooltipValue = tooltip.append("text").attr("class", "tooltip-text tooltip-value");

            dots.on("mouseover", function (event, d) {
                tooltipDate.text(formatDate(d.date));
                tooltipIndex.text("No. " + d.index);
                tooltipValue.text(config.format(d.value));
                tooltip.style("display", null);

                // Size the background to the widest of the three lines
                const dateBox = tooltipDate.node().getBBox();
                const indexBox = tooltipIndex.node().getBBox();
                const valueBox = tooltipValue.node().getBBox();
                const lineHeight = 16, padX = 8, padY = 6;
                const boxW = Math.max(dateBox.width, indexBox.width, valueBox.width) + padX * 2;
                const boxH = lineHeight * 3 + padY * 2;

                tooltipDate.attr("x", padX).attr("y", padY + lineHeight - 4);
                tooltipIndex.attr("x", padX).attr("y", padY + lineHeight * 2 - 4);
                tooltipValue.attr("x", padX).attr("y", padY + lineHeight * 3 - 4);
                tooltipRect.attr("width", boxW).attr("height", boxH);

                // Place above the dot, clamped into the plot area
                const cx = zx(d.index), cy = y(d.value);
                const tx = Math.max(0, Math.min(width - boxW, cx - boxW / 2));
                let ty = cy - boxH - 10;
                if (ty < 0) ty = cy + 10; // flip below near the top edge
                tooltip.attr("transform", "translate(" + tx + "," + ty + ")");
            })
            .on("mouseout", function () {
                tooltip.style("display", "none");
            });

            /* Zoom & pan (x-axis only) */
            const zoom = d3.zoom()
                .scaleExtent([1, 50])
                .extent([[0, 0], [width, height]])
                .translateExtent([[0, 0], [width, height]])
                .filter((event) => {
                    // Zoom on modifier + wheel only, so plain wheel still
                    // scrolls the page. Drag-to-pan needs no modifier.
                    if (event.type === "wheel") return event.ctrlKey || event.metaKey;
                    return !event.button;
                })
                .on("zoom", (event) => {
                    zx = event.transform.rescaleX(x);
                    xAxisG.call(xAxis(zx));
                    dots.attr("cx", (d) => zx(d.index));
                    tooltip.style("display", "none");
                });

            svgRoot.call(zoom);

            // Replace d3's default dblclick behavior (zoom in) with a reset
            svgRoot.on("dblclick.zoom", function () {
                svgRoot.transition().duration(250)
                    .call(zoom.transform, d3.zoomIdentity);
            });
        });
    }

    window.Sushizanmai = { scatter: scatter };
})();
