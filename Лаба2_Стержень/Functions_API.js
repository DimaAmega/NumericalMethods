////////////////////////////////////
//FUNCTIONS
////////////////////////////////////
function accurate_solution_test(x){
	return 2*Math.pow(x,2)+x+1;
}
function accurate_solution_test2(x){
	var c1,c2,c3,c4,alpha,betta;
	c1= -0.42602387538775010611;
	c2= 0.79356834335407444581;
	c3=-3.5137378382749204775;
	c4=-1.7921851269236865889;
	alpha = Math.sqrt(1/(2 + Math.cos(k2.ksi)));
	betta = Math.sqrt(q2.ksi/(2 + Math.sin(q2.ksi)));
	if(x<accurate_solution_test2.ksi){
		return c1*Math.pow(Math.E,alpha*x) + c2*Math.pow(Math.E,-alpha*x) + 2*(1/Math.pow(10,0.5)); 
	} else
		return c3*Math.pow(Math.E,betta*x) + c4*Math.pow(Math.E,-betta*x) + 2*Math.sqrt(10);
} 
accurate_solution_test2.ksi = 1/Math.pow(10,0.5);
function k1(x) {
 return -1;
}
k1.ksi = undefined;
function q1(x) {
	return 0;
}
q1.ksi = undefined;
function f1(x) {
	return 4;
}
f1.ksi = undefined;
/////////////TEST2/////////////////
function k2(x) {
	if(x<k2.ksi) return 2 + Math.cos(k2.ksi);  
	else return 2 + Math.sin(k2.ksi);
}
k2.ksi = 1/Math.pow(10,0.5);
function q2(x) {
	if(x<q2.ksi) return 1;  
	else return q2.ksi;
}
q2.ksi = 1/Math.pow(10,0.5);
function f2(x) {
	if(x<f2.ksi) return 2*f2.ksi;  
	else return 2;
}
f2.ksi = 1/Math.pow(10,0.5);
////////////////MAIN////////////////////////
function k3(x) {
	if(x<k3.ksi) return 2 + Math.cos(x);  
	else return 2 + Math.sin(x);
}
k3.ksi = 1/Math.pow(10,0.5);
function q3(x) {
	if(x<q3.ksi) return 1;  
	else return x;
}
q3.ksi = 1/Math.pow(10,0.5);
function f3(x) {
	if(x<f3.ksi) return 2*x;  
	else return 2;
}
f3.ksi = 1/Math.pow(10,0.5);
function getNumericSolution(k,q,f,m1,m2,a_start,b_start,n){
	var M_Data = Create3diagonalMatrix(k,q,f,m1,m2,a_start,b_start,n);
	return RunningMethod(M_Data.A,M_Data.C,M_Data.B,M_Data.b);
}
function CenterIntegrate(f,x1,x2) {
	if(f.ksi==undefined||(!(x1<f.ksi&&x2>f.ksi))) {
		return (x2-x1)*f((x2+x1)/2);
	}
	else {
		return CenterIntegrate(f,x1,f.ksi) + CenterIntegrate(f,f.ksi,x2);
	}
}
function zerosVector(n) {
	var a = [];
	for (var i = 0; i<n; i++) {
		a.push(0);
	}
	return a;
}
function zerosMatrix(n) {
	var A = [];
	for (var i = 0; i<n;i++) {
		var B = [];
		for(var j = 0;j<n;j++) {
		B.push(0);
		}
		A.push(B);
	} 
	return A;
}
function RunningMethod(A,C,B,b) { //сверху вниз
	var alpha_1,betta_1,Alpha_arr,Betta_arr,Y_arr,yn;
	Alpha_arr = [-A[0]];
	Betta_arr = [b[0]];
	for (var i = 1;i<C.length-1;i++) {  
		var ai = A[i]/(-C[i] - lch(Alpha_arr)*B[i-1]);
		var bi = ( -b[i] + lch(Betta_arr)*B[i-1] )/( -C[i] - lch(Alpha_arr)*B[i-1]);
		Alpha_arr.push(ai);
		Betta_arr.push(bi);
	}
	yn = (lch(b) - lch(B)*lch(Betta_arr))/(1 + lch(Alpha_arr)*lch(B)); 
	Y_arr = [yn];
	for(i = C.length-2;i>=0;i--) {
		Y_arr.push( Alpha_arr[i]*Y_arr[Y_arr.length-1] + Betta_arr[i]);
	}
	Y_arr = Y_arr.reverse();
	return Y_arr;
}
function getGrid(a,b,n) {
	var linspace,h;
	linspace = [];
	h = (b-a)/n;
	for (var i = a; i<=b+h/2; i+=h) {
		linspace.push(i);
	}
	return linspace;
}
function lch(arr) {
	return arr[arr.length-1]
}
function getAuxiliaryGrid(a,b,n) {
	 var h = (b-a)/n;
	 n = n-1;
	 a = a+h/2;
	 b = b-h/2;
	 return getGrid(a,b,n);
}
function Create3diagonalMatrix(k,q,f,m1,m2,a_start,b_start,n) {
	var k_1 = function(x) {
		return 1/k(x);
	};
	k_1.ksi = k.ksi;
	var main_grid,auxilary_grid,A,C,B,b;
	main_grid = getGrid(a_start,b_start,n);
	auxilary_grid = getAuxiliaryGrid(a_start,b_start,n);
	A = zerosVector(n);
	C = zerosVector(n+1); //n+1 - количество эллементов в матрице
	B = zerosVector(n);
	b = zerosVector(n+1)
	h = (b_start-a_start)/n;
	C[0] = 1;
	C[C.length-1] = 1;
	b[0] = m1;
	b[b.length-1] = m2;       
	for(var i = 1; i<b.length-1;i++) {
		b[i] = -CenterIntegrate(f,auxilary_grid[i-1],auxilary_grid[i])/h;  //тут интеграл!
	}
		for(var i = 0; i<n-1;i++) {
			B[i] = 1/(h*CenterIntegrate(k_1,main_grid[i],main_grid[i+1]));
			C[i+1] = -(1/CenterIntegrate(k_1,main_grid[i],main_grid[i+1]) + 1/CenterIntegrate(k_1,main_grid[i+1],main_grid[i+2]) )/h - CenterIntegrate(q,auxilary_grid[i],auxilary_grid[i+1])/h;
			A[i+1] = 1/(h*CenterIntegrate(k_1,main_grid[i+1],main_grid[i+2]));
		}
	return {A:A,B:B,C:C,b:b}
}
function GetDataGraph(x,y) {
	res = [];
	for(var i = 0;i<x.length;i++)
		res.push({x:x[i],y:y[i]});
	return res;	
}
function searchMax(a) {
	var y_i = a[0];
	var index = 0;
	for (var i = 1; i<a.length;i++) {
		if(a[i]>y_i) {
			y_i = a[i];
			index = i;
		}
	}
	return {max:y_i,ind:index}
}
function Create_table(Handle_arr,Data_arr){
var table = document.createElement('table');
var strings = document.createElement('tr');
for(var i = 0; i<Handle_arr.length;i++) {
  var row = document.createElement('th');
  row.innerHTML = String(Handle_arr[i]);
  strings.appendChild(row);
} 
table.appendChild(strings);
 for (var i = 0; i<Data_arr.length;i++) {
    strings = document.createElement('tr');
    for(var j = 0; j<Handle_arr.length; j++) {
      row = document.createElement('th');
      row.innerHTML = String(Data_arr[i][j]);
      strings.appendChild(row);
    }
    table.appendChild(strings);
  }
  return table;
}
function removeTables(query) { //".table > table"
	document.querySelectorAll(query).forEach(function(item){
            item.remove();
          })
};
