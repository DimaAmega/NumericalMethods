;(function() {

    function getGataTable(opt) { //fx,fxder,S,Sder,diffirenceS,diffirenceDerS,ControlGrid
        var res = [];
        var maxSubFS = [];
        var maxSubDerFS = [];
        var maxSubDer2FS = [];
        for(var i = 0; i<opt.controlGrid.length;i++){
            var chres = [];
            chres.push(               i,
                        opt.controlGrid[i],
                        opt.fx(opt.controlGrid[i]),
                        opt.continiousS(opt.controlGrid[i]),
                        opt.diffirenceS(opt.controlGrid[i]),
                        opt.fxder(opt.controlGrid[i]),
                        opt.continiousDerS(opt.controlGrid[i]),
                        opt.diffirenceDerS(opt.controlGrid[i]));
            res.push(chres);
            maxSubFS.push(Math.abs(opt.diffirenceS(opt.controlGrid[i])));
            maxSubDerFS.push(Math.abs( opt.diffirenceDerS(opt.controlGrid[i]) ));
            maxSubDer2FS.push(Math.abs( opt.diffirence2DerS(opt.controlGrid[i]) ));


        };
        console.log('max Sub F - S = ',d3.max(maxSubFS));
        console.log("max Sub Der F' - S' = ",d3.max(maxSubDerFS));
        console.log("max Sub Der2 F'' - S'' = ",d3.max(maxSubDer2FS));

        return res;
    };
    function createTable(data,handle){
    var table = document.getElementsByTagName('table')[0];
    if(table) table.remove();

    for(var i = data.length;i>0;i--) data[i] = data[i-1];
    data[i] = handle;

    var d =  d3.select("body")
      .append("table")
      .selectAll("tr")
      .data(data)
      .enter()
      .append('tr')
      .selectAll("td")
      .data(d=>d)
      .enter()
      .append("td")
      .text(d=>d)
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]); //Обновляем прогрузку латекса
    };

window.DTools = {
    getGataTable:getGataTable,
    createTable:createTable,
}
}());


