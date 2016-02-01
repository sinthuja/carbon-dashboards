var BAR_CHART_TYPE = "bar";
var LINE_CHART_TYPE = "line";
var AREA_CHART_TYPE = "area";
var TABLE_CHART_TYPE = "tabular";
var ARC_CHART_TYPE = "arc";
var SCATTER_CHART_TYPE = "scatter";
var MAP_CHART_TYPE = "map";
var NUMBER_CHART_TYPE = "number";

//initialise all chart types supported by gadget generation wizard
var charts= [
    {
        name: 'Bar',
        type: BAR_CHART_TYPE,
        value: new BarChart()
    }, {
        name: 'Line',
        type: LINE_CHART_TYPE,
        value: new LineChart()
    }, {
        name: 'Area',
        type: AREA_CHART_TYPE,
        value: new AreaChart()
    }, {
        name: 'Table',
        type: TABLE_CHART_TYPE,
        value: new TableChart()
    }, {
        name: 'Arc',
        type: ARC_CHART_TYPE,
        value: new ArcChart()
    }, {
        name: 'Scatter',
        type: SCATTER_CHART_TYPE,
        value: new ScatterChart()
    }, {
        name: 'Map',
        type: MAP_CHART_TYPE,
        value: new MapChart()
    }, {
        name: 'Number',
        type: NUMBER_CHART_TYPE,
        value: new NumberChart()
    }
];

var chartConfig;

var initCharts = function(columns) {
    charts.forEach(function(item,i){
        var chart = item.value;
        chart.bindConfigs(columns);
    });
};

var drawChart = function(config, dataTable) {
    charts.forEach(function(item,i){
        if(config.chartType === item.type) {
            var chart = item.value;
            chart.draw(config,dataTable);
        }
    });
};

var configureChart = function(config) {
    charts.forEach(function(item,i){
        if(config.chartType === item.type) {
            var chart = item.value;
            chart.configure(config);
        }
    });
};

function genericConfigure(config) {
    var xAxis = $("#xAxis").val();
    var maxDataLength = $("#maxDataLength").val();
    var newConfig = {
        "x": xAxis,
        "maxLength": maxDataLength
    };
    chartConfig = newConfig;
}

function genericDraw(config, dataTable) {
    var chart = igviz.setUp("#chartDiv", config, dataTable);
    chart.setXAxis({
        "labelAngle": -35,
        "labelAlign": "right",
        "labelDy": 0,
        "labelDx": 0,
        "titleDy": 25
    }).setYAxis({
        "titleDy": -30
    })
    chart.plot(dataTable.data);
};

/////////////////////////////////////////// Bar chart //////////////////////////////////////////
function BarChart() {};

BarChart.prototype.bindConfigs = function(columns) {
    console.log("****** Initializing BarChart *** ");
    $("#xAxis").empty();
    $("#yAxis").empty();
    $("#xAxis").append($('<option></option>')
        .val("-1")
        .html("-- Select --"));
    $("#yAxis").append($('<option></option>')
        .val("-1")
        .html("-- Select --"));
    columns.forEach(function(column, i) {
        $("#xAxis").append($('<option></option>')
            .val(column.name)
            .html(column.name)
            .attr("data-type", column.type));
        $("#yAxis").append($('<option></option>')
            .val(column.name)
            .html(column.name)
            .attr("data-type", column.type));
    });
};

BarChart.prototype.configure = function(config) {
    genericConfigure(config);
    var yAxis = $("#yAxis").val();
    chartConfig.charts = [{type: config.chartType,  y : yAxis}];

};

BarChart.prototype.draw = function(config, dataTable) {
    genericConfigure(config);
    console.log("Bar:: X " + chartConfig.xAxis + " Y " + chartConfig.yAxis);
    dataTable.metadata.types[chartConfig.xAxis] = "C";
    genericDraw(chartConfig, dataTable);
};

///////////////////////////////////// Line chart /////////////////////////////////////////////
function LineChart() {};

LineChart.prototype.bindConfigs = function(columns) {
    console.log("****** Initializing LineChart *** ");
    $("#color").empty();
    $("#color").append($('<option></option>')
        .val("-1")
        .html("-- Select --"));
    columns.forEach(function(column, i) {
        $("#color").append($('<option></option>')
            .val(column.name)
            .html(column.name)
            .attr("data-type", column.type));
    });
};

LineChart.prototype.configure = function(config) {
    genericConfigure(config);
    var yAxis = $("#yAxis").val();
    var colorAxis = $("#color").val();
    if(colorAxis != -1){
        chartConfig.charts = [{type: config.chartType,  y : yAxis, color:colorAxis}];
    }else{
        chartConfig.charts = [{type: config.chartType,  y : yAxis}];
    }

};

LineChart.prototype.draw = function(config, dataTable) {
    this.configure(config);
    genericDraw(config, dataTable);
};

///////////////////////////////////////////// Area chart ///////////////////////////////////////////////////
function AreaChart() {};

AreaChart.prototype.bindConfigs = function(columns) {
    console.log("****** Initializing AreaChart *** ");
};

AreaChart.prototype.configure = function(config) {
    genericConfigure(config);
    var yAxis = $("#yAxis").val();
    chartConfig.charts = [{type: config.chartType,  y : yAxis}];
};

AreaChart.prototype.draw = function(config, dataTable) {
    genericConfigure(config);
    console.log("Area:: X " + chartConfig.xAxis + " Y " + chartConfig.yAxis);
    // dataTable.metadata.types[chartConfig.xAxis] = "C";
    genericDraw(chartConfig, dataTable);
};

////////////////////////////////////////////////// Table chart /////////////////////////////////////////
function TableChart() {};

TableChart.prototype.bindConfigs = function(columns) {
    console.log("****** Initializing TableChart *** ");
    $("#key").empty();
    $("#key").append($('<option></option>')
        .val("-1")
        .html("-- Select --"));
    $("#columns").append($('<option></option>')
        .val("-1")
        .html("*(All Attributes)"));
    columns.forEach(function(column, i) {
        defaultTableColumns.push(column.name);
        $("#columns").append($('<option></option>')
            .val(column.name)
            .html(column.name)
            .attr("data-type", column.type));
        $("#key").append($('<option></option>')
            .val(column.name)
            .html(column.name)
            .attr("data-type", column.type));

    });
};

TableChart.prototype.configure = function(config) {

    var columns = [];
    var columnTitles = [];
    var maxDataLength = $("#maxDataLength").val();
    var key = $("#key").val();

    if(selectedTableCoulumns.length != 0){
        for(i=0;i<selectedTableCoulumns.length;i++){
            var cusId = "#cusId"+selectedTableCoulumns[i]+"";
            columns.push(selectedTableCoulumns[i]);
            if($(cusId).val() != ""){
                columnTitles.push($(cusId).val());
            }else{
                columnTitles.push(selectedTableCoulumns[i]);
            }
        }
    }else{
        for(i=0;i<defaultTableColumns.length;i++){
            columns.push(defaultTableColumns[i]);
            columnTitles.push(defaultTableColumns[i]);
        }
    }

    config.charts = [{type: "table", key : key, maxLength : maxDataLength, columns: columns, columnTitles:columnTitles}];
    chartConfig = config;
};

TableChart.prototype.draw = function(config, dataTable) {
    this.configure(config);
    var chart = igviz.draw("#chartDiv", chartConfig, dataTable);
    chart.plot(dataTable.data);
};

//////////////////////////////////////////////// Scatter Chart ////////////////////////////////////////////////
function ScatterChart() {};

ScatterChart.prototype.bindConfigs = function(columns) {
    $("#pointSize").empty();
    $("#pointColor").empty();
    $("#pointColor").append($('<option></option>')
        .val("-1")
        .html("-- Select --"));
    $("#pointSize").append($('<option></option>')
        .val("-1")
        .html("-- Select --"));
    columns.forEach(function(column, i) {
        $("#pointColor").append($('<option></option>')
            .val(column.name)
            .html(column.name)
            .attr("data-type", column.type));
        $("#pointSize").append($('<option></option>')
            .val(column.name)
            .html(column.name)
            .attr("data-type", column.type));
    });
};

ScatterChart.prototype.configure = function(config) {
    genericConfigure(config);

    var yAxis = $("#yAxis").val();
    var pointSize = $("#pointSize").val();
    var pointColor = $("#pointColor").val();

    chartConfig.charts = [{type: config.chartType,  y : yAxis,color: pointColor, size: pointSize,
        "maxColor":"#ffff00","minColor":"#ff00ff"}];
};

ScatterChart.prototype.draw = function(config, dataTable) {
    this.configure(config);
    genericDraw(chartConfig, dataTable);
};

//////////////////////////////////////////// Arc chart ////////////////////////////////////////////////////////
function ArcChart() {};

ArcChart.prototype.bindConfigs = function(columns) {
    columns.forEach(function(column, i) {
        $("#percentage").append($('<option></option>')
            .val(column.name)
            .html(column.name)
            .attr("data-type", column.type));
    });
};

ArcChart.prototype.configure = function(config) {
    config.percentage = getColumnIndex($("#percentage").val());
    chartConfig = config;
};

ArcChart.prototype.draw = function(config, dataTable) {
    this.configure(config);
    igviz.draw("#chartDiv", config, dataTable);
};

///////////////////////////////////////////////////// Map ///////////////////////////////////////////////////////////
function MapChart() {};

MapChart.prototype.bindConfigs = function(columns) {
    // body...
};

MapChart.prototype.configure = function(config) {
    genericConfigure(config);
    var region;
    if ($("#region").val().trim() != "") {
        region = $("#region").val();
    }
    var yAxis = $("#yAxis").val();
    chartConfig.charts = [{type: config.chartType, y : yAxis, mapType: region}];
};

MapChart.prototype.draw = function(config, dataTable) {
    this.configure(config);
    var chart = igviz.draw("#chartDiv", chartConfig, dataTable);
    chart.plot(dataTable.data,null,0);
};

///////////////////////////////////////////////////// Number ///////////////////////////////////////////////////////////
function NumberChart() {};

NumberChart.prototype.bindConfigs = function(columns) {
    // body...
};

NumberChart.prototype.configure = function(config) {
    genericConfigure(config);
    var attrDescription = $("#attrDescription").val();
    chartConfig.charts = [{type: config.chartType,title:attrDescription}];
};

NumberChart.prototype.draw = function(config, dataTable) {
    this.configure(config);
    var chart = igviz.draw("#chartDiv", chartConfig, dataTable);
    chart.plot(dataTable.data,null,0);
};

	

	