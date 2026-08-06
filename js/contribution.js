// contribution.js
// contribution visualizer

(function () {
    'use strict';

    d3.csv("./data/score.csv").then(function(data) {
        const dict = {};
        data.forEach(function(d) {
            if(!(d.date in dict)) dict[d.date] = 1;
            else dict[d.date]++;
        });

        const parseTime = d3.timeParse("%Y%m%d");
        const chartData = [];
        for (const key in dict) chartData.push({date: parseTime(key), count: dict[key]});

        const heatmap = calendarHeatmap()
            .data(chartData)
            .selector('.contribution')
            .tooltipEnabled(true)
            .colorRange(['#D8E6E7', '#218380']);
        heatmap();  // render the chart
    });
})();
