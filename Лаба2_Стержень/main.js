//////////////////////////////////////////
//Создание пустого графика
/////////////////////////////////////////
var graphick = new Chartist.Line('#graph1',data,Graph_options.options);
        var Clone = FastClone.factory(graphick.options);
        var chartOptionsClone = new Clone(graphick.options);
        Graph_options.onZoomOptions.push(chartOptionsClone);

var graphick2 = new Chartist.Line('#graph2',data,Graph_options2.options);
        var Clone = FastClone.factory(graphick2.options);
        var chartOptionsClone2 = new Clone(graphick2.options);
        Graph_options2.onZoomOptions.push(chartOptionsClone2);
//////////////////////////////////////////
//MAIN variables
/////////////////////////////////////////
var Main_settings = {
	tasknumber:undefined,
	N: undefined,
	isRefresh:true,
};
var Test1_task = {
	k:k1,
	q:q1,
	f:f1
}
var Test2_task = {
	k:k2,
	q:q2,
	f:f2
}
var Main_task = {
	k:k3,
	q:q3,
	f:f3
}
var data = {
  series: []
}
var tables = document.getElementsByClassName("table")[0];
var olp = document.getElementById("OLP");
var data1 = { //данные для графика численного решения
  series: []
}
var data2 = { //данные для графика погрешности
  series: []
}
////////////////////////////////////////
//SWITCH
////////////////////////////////////////
function Start() {
	var data_table = [];

	if (Main_settings.isRefresh){
		removeTables(".table > table");
		data1.series = [];
		data2.series = [];
	}

	switch (Main_settings.tasknumber) {
case "test1":
var y_sol = [];
var ksi = [];
var m1 = 1;
var m2 = 4;
var main_grid = getGrid(0,1,Main_settings.N);
var y_num = getNumericSolution(Test1_task.k,Test1_task.q,Test1_task.f,m1,m2,0,1,Main_settings.N);

for(var i = 0; i<main_grid.length; i++) {
	y_sol.push(accurate_solution_test(main_grid[i]));
	ksi.push(  Math.abs(accurate_solution_test(main_grid[i]) - y_num[i]) );
	data_table.push([i,main_grid[i],y_sol[i],y_num[i],ksi[i]]);
}

var s1 = GetDataGraph(main_grid,y_num);
var s2 = GetDataGraph(main_grid,y_sol);
var s3 = GetDataGraph(main_grid,ksi);

var max_data = searchMax(ksi);
olp.innerHTML = `Максимальная Погрешность ${max_data.max} <br> В точке ${main_grid[max_data.ind]}`;

tables.appendChild(Create_table(["i","\\(x_{i}\\)","\\(u_{i}\\)","\\(v_{i}\\)","\\(|u_i-v_i|\\)"],data_table));
data1.series.push(s1);
data1.series.push(s2);
data2.series.push(s3);
	break;
case "test2":
var y_sol = [];
var ksi = [];
var m1 = 1;
var m2 = 0;
var main_grid = getGrid(0,1,Main_settings.N);
var y_num = getNumericSolution(Test2_task.k,Test2_task.q,Test2_task.f,m1,m2,0,1,Main_settings.N);

for(var i = 0; i<main_grid.length; i++) {
	y_sol.push(accurate_solution_test2(main_grid[i]));
	ksi.push(  Math.abs(accurate_solution_test2(main_grid[i]) - y_num[i] ) );
	data_table.push([i,main_grid[i],y_sol[i],y_num[i],ksi[i]]);
}
var s1 = GetDataGraph(main_grid,y_num);
var s2 = GetDataGraph(main_grid,y_sol);
var s3 = GetDataGraph(main_grid,ksi);
var max_data = searchMax(ksi);
olp.innerHTML = `Максимальная Погрешность ${max_data.max} <br> В точке ${main_grid[max_data.ind]}`;

tables.appendChild(Create_table(["i","\\(x_{i}\\)","\\(u_{i}\\)","\\(v_{i}\\)","\\(|u_i-v_i|\\)"],data_table));
data1.series.push(s1);
data1.series.push(s2);
data2.series.push(s3);
	break;
case "main":
var ksi = [];
var m1 = 1;
var m2 = 0;
var main_grid = getGrid(0,1,Main_settings.N);
var main_grid_double = getGrid(0,1,2*Main_settings.N);
var y_num = getNumericSolution(Main_task.k,Main_task.q,Main_task.f,m1,m2,0,1,Main_settings.N);
var y_num2 = getNumericSolution(Main_task.k,Main_task.q,Main_task.f,m1,m2,0,1,2*Main_settings.N);

for(var i = 0;i<main_grid.length;i++){
	ksi.push(  Math.abs(y_num[i] -  y_num2[2*i] ) );
	data_table.push([i,main_grid[i],y_num[i],y_num2[2*i],ksi[i]]);

}
var s1 = GetDataGraph(main_grid,y_num);
var s2 = GetDataGraph(main_grid_double,y_num2);
var max_data = searchMax(ksi);
var s3 = GetDataGraph(main_grid,ksi);
olp.innerHTML = `Разница с сеткой с вдвое большим числом разбиенний ${max_data.max} <br> В точке ${main_grid[max_data.ind]}`;

tables.appendChild(Create_table(["i","\\(x_{i}\\)","\\(v_{i}\\)","\\(v2_{i}\\)","\\(|v2_i-v_i|\\)"],data_table));
data1.series.push(s1);
data1.series.push(s2);
data2.series.push(s3);
	break;
};
////////////////////////////////////////////////
//ОБНОВЛЕНИЕ ГРАФИКОВ!
////////////////////////////////////////////////
if(Main_settings.N<10000){
graphick.update(data1,Graph_options.options);
var Clone = FastClone.factory(graphick.options);
var chartOptionsClone = new Clone(graphick.options);
Graph_options.onZoomOptions.push(chartOptionsClone);

graphick2.update(data2,Graph_options2.options);
var Clone = FastClone.factory(graphick2.options);
var chartOptionsClone2 = new Clone(graphick2.options);
Graph_options2.onZoomOptions.push(chartOptionsClone2);
} else alert("Графики не обновлены, слишком большой размер данных");
MathJax.Hub.Queue(["Typeset",MathJax.Hub]); //Обновляем прогрузку латекса
}








































 /* MathJax.Hub.Queue(["Typeset",MathJax.Hub]); //Обновляем прогрузку латекса*/
//////////////////////////////////////////
//обновление графика
/////////////////////////////////////////
/*    graphick.update(data,Graph_options.options);
    var Clone = FastClone.factory(graphick.options);
    var chartOptionsClone = new Clone(graphick.options);
    Graph_options.onZoomOptions.push(chartOptionsClone);*/










