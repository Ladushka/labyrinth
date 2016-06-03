var state = {
    table: []
}
function ChartElement(day, time, temperature) {
    this.day = day;
    this.time = time;
    this.temperature = temperature;
}

function parse(str) {
    var types = [],
     line = str.split('|').forEach(function (item, i, line) {
         types = item.split(' ');
         state.table[i] = new ChartElement(types[0], types[1], types[3]);
     })

    return state.table;
}
function day(arr) {
    var temp = [],
    inputDay = document.getElementById('day'),
    beginTime = document.getElementById('begin'),
    endTime = document.getElementById('end');

    if (inputDay.value && beginTime.value && endTime.value) {
        temp = arr.filter(function (item, i, arr) {
            if (item.day === inputDay.value && item.time >= beginTime.value && item.time <= endTime.value)
            { return item; }
        })
    }
    else if (inputDay.value && beginTime.value) {
        temp = arr.filter(function (item, i, arr) {
            if (item.day === inputDay.value && item.time >= beginTime.value) { return item; }
        })
    }
    else if (inputDay.value) {
        temp = arr.filter(function (item, i, arr) {
            if (item.day === inputDay.value) { return item; }
        })
    }

    return temp.length ? temp : temp = arr.filter(function (item, i, arr) { return i <= 20; });
}
function draw() {
    var ctx = document.getElementById('myChart'), myChart, arrayOfTime = [], arrayOfTemperature = [];
    state.table = day(state.table);
    state.table.forEach(function (item, i, arr) {
        arrayOfTime[i] = item.time;
        arrayOfTemperature[i] = item.temperature;
    });
    myChart = new Chart.Line(ctx, {
        type: 'line',
        data: {
            labels: arrayOfTime,
            datasets: [{
                label: 'valueTemperature',
                data: arrayOfTemperature,
                backgroundColor: 'rgba(75,192,192,0.4)'
            }]

        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


function load() {
    var mydata = JSON.parse(data);
    var str = mydata[0].file;
    parse(str);
}