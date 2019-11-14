(function(){

def_options = {
options: {
    height: 550,
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
            axisTitle: "U1(x)",
            axisClass: "ct-axis-title",
           offset: {
             x: 400,
             y: 30
           },
           textAnchor: "middle"
          },
          axisY: {
            axisTitle: "U2(x)",
            axisClass: "ct-axis-title",
            offset: {
            x: -200,
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
}())
