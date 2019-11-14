(function(){

def_options = {
options: {
    height: 250,
    showPoint: true,
    lineSmooth: false,
    axisX: {
      showGrid: true,
      showLabel: true,
      scaleMinSpace:60,
      onlyInteger: false,
      type: Chartist.AutoScaleAxis,
      },
    plugins: [
      Chartist.plugins.zoom({
        onZoom : function(chart, reset) { 
        var Clone = FastClone.factory(chart.options);
        var chartOptionsClone = new Clone(chart.options);
        Graph_options.onZoomOptions.push(chartOptionsClone);
        }
      }) , 
      Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: " ",
            axisClass: "ct-axis-title",
           offset: {
             x: 400,
             y: 30
           },
           textAnchor: "middle"
          },
          axisY: {
            axisTitle: " ",
            axisClass: "ct-axis-title",
            offset: {
            x: 0,
             y: 0
            },
            flipTitle: false
          }
        })
    ]
  },
  onZoomOptions: []
}

def_options2 = {
options: {
    height: 250,
    showPoint: true,
    lineSmooth: false,
    axisX: {
      showGrid: true,
      showLabel: true,
      scaleMinSpace:60,
      onlyInteger: false,
      type: Chartist.AutoScaleAxis,
      },
    plugins: [
      Chartist.plugins.zoom({
        onZoom : function(chart, reset) { 
        var Clone = FastClone.factory(chart.options);
        var chartOptionsClone = new Clone(chart.options);
        Graph_options2.onZoomOptions.push(chartOptionsClone);
        }
      }) , 
      Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: "X",
            axisClass: "ct-axis-title",
           offset: {
             x: 400,
             y: 30
           },
           textAnchor: "middle"
          },
          axisY: {
            axisTitle: " ",
            axisClass: "ct-axis-title",
            offset: {
            x: 0,
             y: 0
            },
            flipTitle: false
          }
        })
    ]
  },
  onZoomOptions: []
}


window.Graph_options = def_options;
window.Graph_options2 = def_options2;
}())
