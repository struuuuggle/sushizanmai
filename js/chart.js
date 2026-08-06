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
     *   selector: ".type",                 // container div; also used for the clipPath id
     *   value:    (d) => +d.type,          // CSV row -> y value
     *   yDomain:  (values) => [lo, hi],    // y values -> y domain
     *   format:   d3.format("d")           // y value -> tooltip label
     * }
     */
    function scatter(config) {
        const margin = {top: 20, right: 20, bottom: 30, left: 50},
              width = 960,
              height = 500;

        /* axis */
        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        // x scale reflecting the current zoom transform
        let zx = x;

        /* Generate svg */
        const svgRoot = d3.select(config.selector).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);
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

        const plot = svg.append("g")
            .attr("clip-path", "url(#" + clipId + ")");

        // データ読み込み
        d3.csv("./data/score.csv").then(function (data) {

            /* format the data */
            data.forEach(function (d) {
                d.date = parseTime(d.date);
                d.value = config.value(d);
            });

            /* Scale the range of the data */
            x.domain(d3.extent(data, (d) => d.date));
            y.domain(config.yDomain(data.map((d) => d.value)));

            // Add the X Axis
            const xAxisG = svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add the Y Axis
            svg.append("g")
                .call(d3.axisLeft(y));

            /* Draw the dots */
            const dots = plot.selectAll("circle.dot")
                .data(data)
                .join("circle")
                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", (d) => x(d.date))
                .attr("cy", (d) => y(d.value));

            /* Tooltip (SVG-based: the container div clips absolutely
               positioned HTML because of overflow-x-auto) */
            const tooltip = svg.append("g")
                .attr("class", "tooltip")
                .style("display", "none");
            const tooltipRect = tooltip.append("rect")
                .attr("rx", 4);
            const tooltipDate = tooltip.append("text").attr("class", "tooltip-text");
            const tooltipValue = tooltip.append("text").attr("class", "tooltip-text");

            dots.on("mouseover", function (event, d) {
                tooltipDate.text(formatDate(d.date));
                tooltipValue.text(config.format(d.value));
                tooltip.style("display", null);

                // Size the background to the wider of the two lines
                const dateBox = tooltipDate.node().getBBox();
                const valueBox = tooltipValue.node().getBBox();
                const lineHeight = 16, padX = 8, padY = 6;
                const boxW = Math.max(dateBox.width, valueBox.width) + padX * 2;
                const boxH = lineHeight * 2 + padY * 2;

                tooltipDate.attr("x", padX).attr("y", padY + lineHeight - 4);
                tooltipValue.attr("x", padX).attr("y", padY + lineHeight * 2 - 4);
                tooltipRect.attr("width", boxW).attr("height", boxH);

                // Place above the dot, clamped into the plot area
                const cx = zx(d.date), cy = y(d.value);
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
                    xAxisG.call(d3.axisBottom(zx));
                    dots.attr("cx", (d) => zx(d.date));
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
