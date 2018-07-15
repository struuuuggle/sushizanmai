// contribution.js
// contribution visualizer

d3.csv("../data/score.csv").then(function(data) {
    var dict = {};
    data.forEach(function(d) {
        if(!(d.date in dict)) dict[d.date] = 1;
        else dict[d.date]++;
    });

    const parseTime = d3.timeParse("%Y%m%d");
    var chartData = [];
    for(key in dict) chartData.push({date: parseTime(key), count: dict[key]})

    var heatmap = calendarHeatmap()
        .data(chartData)
        .selector('.contribution')
        .tooltipEnabled(true)
        .colorRange(['#D8E6E7', '#218380'])
        .onClick(function (data) {
            console.log('data', data);
        });
    heatmap();  // render the chart
});
