////////////////////////////////////
//MAIN
///////////////////////////////////
var a,b;
a = 1;
b = 2;
function getAccuratesolution(y0,x0) {
  return function(x) {
    return new Vec2(y0*Math.pow(Math.E,2*(x-x0)),0);
  }
}
function p(t,vec) {
  return  2*vec.x;         //Math.pow(vec.x,2)/(Math.pow((1+Math.pow(t,2)),1/3)) + vec.x - Math.pow(vec.x,3)*Math.sin(10*t);
}
function q(t,vec) {
  return  0;
}
testSistem = registerSistem(p,q); 

function p1(t,vec) {
  return  Math.pow(vec.x,2)/(Math.pow((1+Math.pow(t,2)),1/3)) + vec.x - Math.pow(vec.x,3)*Math.sin(10*t);
}
MainSistem1 = registerSistem(p1,q);
function p2(t,vec) {
  return  vec.y;         //Math.pow(vec.x,2)/(Math.pow((1+Math.pow(t,2)),1/3)) + vec.x - Math.pow(vec.x,3)*Math.sin(10*t);
}
function q2(t,vec) {
  return  -a*Math.pow(Math.pow(vec.y,2) +1 + b,0.5);
}
MainSistem2 = registerSistem(p2,q2);

var graphick;

var Options = {
  mode:"SS",
  t0:0,
  h:0.01,
  t_end:9,
  n_max:1000,
  numMethod:RungeKutt,
  type_sistem:undefined,
  p:4,
  Accurate_Solution:undefined,
  eps:0.001,
  u0:new Vec2(1,1),
  isRefresh:false,
  axis:xy
}

var keys = {
  test:testSistem,
  main1:MainSistem1,
  main2:MainSistem2,
}

var data_and_table;

var data = {
  series: s
}
var s = [];
//////////////////////////////////////////
//Создание пустого графика
/////////////////////////////////////////

 graphick = new Chartist.Line('.ct-chart',data,Graph_options.options);
        var Clone = FastClone.factory(graphick.options);
        var chartOptionsClone = new Clone(graphick.options);
        Graph_options.onZoomOptions.push(chartOptionsClone);

//////////////////////////////////////////
//Создание пустого графика
/////////////////////////////////////////
function Start() {
console.log(Options);

    if(Options.type_sistem == "test") {
      console.log("УСТАНОВИЛИ ТИП ТЕСТ");
      Options.Accurate_Solution = getAccuratesolution(Options.u0.x,Options.t0);
      console.log(Options.Accurate_Solution);
    }






switch (Options.mode) {
  case 'KLP':
  data_and_table = transformData(
  Options.axis,
  ControlCalculate(Options.t0,Options.u0,Options.t_end,Options.h,Options.n_max,Options.numMethod,keys[Options.type_sistem],4,Options.eps),
  ["i","\\(x_{i}\\)","\\(v_{i}\\)","\\(v2_{i}\\)","\\(v_{i}-v2_{i}\\)","\\(ОЛП\\)","\\(h_{i}\\)","\\(Число\\) \\(деления\\) \\(шага\\)","\\(Число\\) \\(удвоения\\) \\(шага\\)"]);
  break;
  case 'SS':
  data_and_table = transformData(Options.axis,
  simpleNumCalculate(Options.t0,Options.u0,Options.t_end,Options.h,Options.n_max,Options.numMethod,keys[Options.type_sistem],4,Options.Accurate_Solution),
  ["i","\\(x_{i}\\)","\\(v_{i}\\)","\\(v2_{i}\\)","\\(v_{i}-v2_{i}\\)","\\(ОЛП\\)","\\(h_{i}\\)","\\(u_i\\)","\\(|u_i-v_i|\\)"]);
  break;
}
  
  if(Options.isRefresh == true) {
          s = [];
          var tables = document.querySelectorAll(".table > table");
          tables.forEach(function(item){
            item.remove();
          })
          console.log("Удалённая",tables);
      }


      if(Options.type_sistem == "test") {
        //настоящее решение
        accoratesolution = [];
        for(var i = 0; i<data_and_table.Data_graph.length; i++) {
        console.log(Options.Accurate_Solution);
        accoratesolution.push({x:data_and_table.Data_graph[i].x,y:Options.Accurate_Solution(data_and_table.Data_graph[i].x).x});
      }

        s.push(accoratesolution);
        Options.Accurate_Solution = undefined;
      }

      s.push(data_and_table.Data_graph);

      var data = {
      series: s
      }

  document.getElementsByClassName("table")[0].appendChild(data_and_table.TableHTML);

  MathJax.Hub.Queue(["Typeset",MathJax.Hub]); //Обновляем прогрузку латекса

    graphick.update(data,Graph_options.options);
    var Clone = FastClone.factory(graphick.options);
    var chartOptionsClone = new Clone(graphick.options);
    Graph_options.onZoomOptions.push(chartOptionsClone);
}









