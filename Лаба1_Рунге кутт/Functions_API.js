////////////////////////////////////
//FUNCTIONS
////////////////////////////////////
function tx(t,u){
      return {x:t,y:u.x}
  }

function ty(t,u){
      return {x:t,y:u.y}
  }

function xy(t,u){
      return {x:u.x,y:u.y}
  }
  function yx(t,u){
      return {x:u.y,y:u.x}
  }

function registerSistem(p,q) {
  return function(t,vec) {
    return new Vec2(p(t,vec),q(t,vec))
  }
}
function addDataTable() {
  return arguments;
}
function linspace(a,h,b) {
  var l = [];
  for (var i = a; i<=b; i+=h) {
    l.push(i);
  }
  return l;
}
function GetS(sistema,method,cur_t,cur_u,cur_h,p) {
  var u,u2;
  u = method(sistema,cur_t,cur_u,cur_h);
  u2 = method(sistema,cur_t + cur_h/2.0,method(sistema,cur_t,cur_u,cur_h/2.0),cur_h/2.0);
  return (u2.sub(u).length())/(Math.pow(2,p)-1);
}
function simpleNumCalculate(t0,u0,t_end,h,n_max,numMethod,sistema,p,Accurate_Solution) {
  var data_table = []; //table data
  var res_data = []; //numeric data
  var t = linspace(t0,h,t_end);  //'cause step is canstant
  var u_prev = u0; //start point
  res_data.push({t:t[0],u:u_prev}); //add information
  data_table.push(addDataTable(t0,t[0],u0,0,0,0,0,0,0,0,0)); //add information
  var i = 0;
  while((i<n_max)&&(i<t.length)) 
  {
    var u_new = numMethod(sistema,t[i],u_prev,h) 
    var S = GetS(sistema,numMethod,t[i],u_prev,h,p);
    var v2i = numMethod(sistema,t[i]+h/2.0,numMethod(sistema,t[i],u_prev,h/2.0),h/2.0);
    i++;

    if(Accurate_Solution == undefined) {
           vi = undefined;
           data_table.push(addDataTable(i,t[i],u_new,v2i,u_new.sub(v2i),S*Math.pow(2,p),h));
    }
    else {
           var vi = Accurate_Solution(t[i]); //accurate solution
           data_table.push(addDataTable(i,t[i],u_new,v2i,u_new.sub(v2i),S*Math.pow(2,p),h,vi,vi.sub(u_new).length()));
    }
    res_data.push({t:t[i],u:u_new})
    u_prev = u_new;
   }
      return {
      fullDataGraph:res_data,
      fullDataTable:data_table
    };
}
function ControlCalculate(t0,u0,t_end,h0,n_max,numMethod,sistema,p,eps) {
  console.log("КОНТРОЛЬ");
  var u_cur = u0; //start point
  var h_cur = h0; //start step
  var c1 = 0; //Num of devided step
  var c2 = 0; //Num of multiply step
  var i = 0; // Num of itrations
  var t = [t0];  
  var res_data = [];
  var data_table = [];
  res_data.push({t:t[0],u:u0});
  data_table.push(addDataTable(0,t[0],u0,0,0,0,0,0,0));
    while ((i<n_max)&&(t[t.length-1]<t_end)) {
        var S = GetS(sistema,numMethod,t[t.length-1],u_cur,h_cur,p);
        if(S>eps) { // devided step, current point is bad
          h_cur = h_cur/2.0;
          c1++;
          c2 = 0;
        } else 
        if(S<(eps/Math.pow(2,p))) { // multiply step, current point is good
          var v2i = numMethod(sistema,t[t.length-1] + h_cur/2.0,numMethod(sistema,t[t.length-1],u_cur,h_cur/2.0),h_cur/2.0); 
          u_cur = numMethod(sistema,t[t.length-1],u_cur,h_cur) //Принимаем точку с текущим слишком маленьким шагом
          t.push(t[t.length-1] + h_cur); //обнавляем новое текущее время
          res_data.push({t:t[t.length-1],u:u_cur}); //добавляем в результат
          i++; 
          c2 = 1;
          data_table.push(addDataTable(i,t[t.length-1],u_cur,v2i,u_cur.sub(v2i),S*Math.pow(2,p),h_cur,c1,c2));
          h_cur = 2*h_cur;
          c1 = 0;
        } else { // keep step, current point is good
          var v2i = numMethod(sistema,t[t.length-1] + h_cur/2.0,numMethod(sistema,t[t.length-1],u_cur,h_cur/2.0),h_cur/2.0);
          u_cur = numMethod(sistema,t[t.length-1],u_cur,h_cur) //Принимаем точку с текущим слишком маленьким шагом
          t.push(t[t.length-1] + h_cur); //обнавляем новое текущее время
          res_data.push({t:t[t.length-1],u:u_cur}); //добавляем в результат
          i++; 
          c2 = 0;
          data_table.push(addDataTable(i,t[t.length-1],u_cur,v2i,u_cur.sub(v2i),S*Math.pow(2,p),h_cur,c1,c2));
          c1 = 0;
        }
    }
    return {
      fullDataGraph:res_data,
      fullDataTable:data_table
    };
  }
function transformData(setDataForGraph_F,data_obj,Arr_Handle_title) {
  console.log(arguments);
  series = [];
  data_obj.fullDataGraph.forEach(function(item){
    series.push(setDataForGraph_F(item.t,item.u));
  })
  //create table HTML
  var table = document.createElement('table');
  var strings = document.createElement('tr');
  for(var i = 0; i<Arr_Handle_title.length;i++) {
    var row = document.createElement('th');
    row.innerHTML = String(Arr_Handle_title[i]);
    strings.appendChild(row);
  }
      table.appendChild(strings);

  for (var i = 0; i<data_obj.fullDataTable.length;i++) {
    strings = document.createElement('tr');
    for(var j = 0; j<Arr_Handle_title.length; j++) {
      row = document.createElement('th');
      row.innerHTML = String(data_obj.fullDataTable[i][j]);
      strings.appendChild(row);
    }
    table.appendChild(strings);

  }

  //search max Global 
  if(Arr_Handle_title.length>8) {
  strings = document.createElement('tr');
  var row1 = document.createElement('th');
  row1.innerHTML = "Global max";
  var n_row_last = data_obj.fullDataTable[1].length-1;
  var max = data_obj.fullDataTable[1][n_row_last];
  for (var i = 2; i<data_obj.fullDataTable.length-1; i++) {
    if(max<data_obj.fullDataTable[i][n_row_last]) {
      max = data_obj.fullDataTable[i][n_row_last];
    }
  }

var row2 =  document.createElement('th');
row2.innerHTML = String(max);

strings.appendChild(row1);
strings.appendChild(row2);
 table.appendChild(strings);
}
  //найдём максимум
  return {
    Data_graph:series,
    TableHTML:table
  };
}


