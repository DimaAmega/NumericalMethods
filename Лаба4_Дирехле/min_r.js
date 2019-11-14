///// ВАРИАНТ 4 ////
// СЛУЖЕБНЫЕ ФУНКЦИИ
function f(x,y){
    return -Math.pow(Math.E,-x*(y**2));
};
function ZerosMatrix(n,m){
    var res = [];
    for(var i = 0; i<m; i++){
        res[i] = [];
        for (var j = 0; j<n;j++)
            res[i][j] = 0;
    };
    return res;
};
function getGrid(a,b,n) {
    var linspace,h;
    linspace = [];
    h = (b-a)/n;
    for (var i = a; i<=b+h/2; i+=h) {
        linspace.push(i);
    }
    return linspace;
};
function getCopyMatrix(V) {
    var res = V.slice();
    for (var i = 0; i<V.length; i++) res[i] = V[i].slice();
    return res;
};
function GetNormMethod(V_new,V_old,n,m) {
    var maxEps = 0;
    for (var i = 1; i<m;i++)
        for (var j = 1; j<n;j++)
            if (Math.abs(V_old[i][j] - V_new[i][j]) > maxEps) maxEps = Math.abs(V_old[i][j]- V_new[i][j]);
    return maxEps;
};
function getDifferenceVAndV2(V,V2,n,m){
var res = 0;
var point = {};
var h = (b-a)/n;
var k = (d-c)/m;
var xi = (i)=> {return a + i*h};
var yi = (i)=> {return c + i*k};

    for(i=1;i<m;i++)
        for(j=1;j<n;j++){
            var dif = Math.abs(V[i][j]-V2[i*2][j*2]);
            if (dif>res) {
                res = dif;
                point.x = xi(j);
                point.y = yi(i);
                point.i = j;
                point.j = i;
            };
        };
    console.log('точка',point);
    return res;
};
function getTau(V,f,n,m,a,b,c,d) {
    var X = getGrid(a,b,n);
    var Y = getGrid(c,d,m);
    var h = (b-a)/n,
        k = (d-c)/m,
        A = -2*(1/(h**2)+1/(k**2));

    var Rs = ZerosMatrix(n+1,m+1),
        ARs =ZerosMatrix(n+1,m+1);

        for (var j = 1; j<n; j++)
            for(var i = 1;i<m;i++){
                Rs[i][j] =  f(X[j],Y[i]) + V[i][j]*A + V[i+1][j]*(1/(k**2)) + V[i-1][j]*(1/(k**2)) + V[i][j+1]*(1/(h**2)) + V[i][j-1]*(1/(h**2));
            };
        
        var Rs_zeros = getCopyMatrix(Rs);
        for (var i = 1;i<m;i++) { // 0 и n последние по y
            Rs_zeros[i][0] = 0;
            Rs_zeros[i][n] = 0;
        };
        for (var i = 1;i<n;i++) { // 0 и n последние по x
            Rs_zeros[0][i] = 0;
            Rs_zeros[m][i] = 0;
        };
        // ГРАН УСЛ УГЛОВ
        Rs_zeros[0][0] = 0;
        Rs_zeros[0][n] = 0;
        Rs_zeros[m][n] = 0;
        Rs_zeros[m][0] = 0;

        for (var j = 1; j<n; j++)
            for(var i = 1;i<m;i++){
                ARs[i][j] = Rs_zeros[i][j]*A + Rs_zeros[i+1][j]*(1/(k**2)) + Rs_zeros[i-1][j]*(1/(k**2)) + Rs_zeros[i][j+1]*(1/(h**2)) + Rs_zeros[i][j-1]*(1/(h**2));
            };
        var denominator = 0;
        var numerator = 0;

        for (var j = 1; j<n; j++) // Знаменатель
            for(var i = 1;i<m;i++)
                denominator+= Math.pow(ARs[i][j],2);
        
        for (var j = 1; j<n; j++) // Числитель
            for(var i = 1;i<m;i++)
                numerator+= ARs[i][j]*Rs[i][j];

        var res = -numerator/denominator;
       return res;
};
function minDiscrepancy(Mu,f,a,b,c,d,n,m,N,eps){
    ///  ГРАН УСЛОВИЯ ///
    var X = getGrid(a,b,n);
    var Y = getGrid(c,d,m);
    var V = ZerosMatrix(n+1,m+1);
    var h = (b-a)/n,
        k = (d-c)/m,
        A = -2*(1/(h**2)+1/(k**2));
    // ГРАН УСЛОВИЯ
    for (var i = 1;i<m;i++) { // 0 и n последние по y
        V[i][0] = Mu[0][0](X[0],Y[i]);
        V[i][n] = Mu[1][1](X[n],Y[i]);
    };
    for (var i = 1;i<n;i++) { // 0 и n последние по x
        V[0][i] = Mu[1][0](X[i],Y[0]);
        V[m][i] = Mu[0][1](X[i],Y[m]);
    };
    // ГРАН УСЛ УГЛОВ
    V[0][0] = Mu[0][0](X[0],Y[0]);
    V[0][n] = Mu[0][0](X[n],Y[0]);
    V[m][n] = Mu[1][1](X[n],Y[m]);
    V[m][0] = Mu[1][1](X[0],Y[m]);

    count = 0;

    var t;
    do {
        var V_copy = getCopyMatrix(V);
        t = getTau(V_copy,f,n,m,a,b,c,d);
        for (var j = 1; j<n; j++)
            for(var i = 1;i<m;i++){
                V[i][j] = V_copy[i][j] - t*(-f(X[j],Y[i]) - V_copy[i][j]*A -V_copy[i+1][j]*(1/(k**2)) - V_copy[i-1][j]*(1/(k**2)) - V_copy[i][j+1]*(1/(h**2)) - V_copy[i][j-1]*(1/(h**2)));
            }
        epsMethod = GetNormMethod(V_copy,V,n,m);
        count++;
    } while(count<N&&epsMethod>eps);

    console.log('ЧИСЛО ИТЕРАЦИЙ\n',count);
    console.log('ТОЧНОСТЬ Метода \n',epsMethod);
    // console.log(V);
    return V;
};

var readlineSync = require('readline-sync');
var lineData = readlineSync.question('n m -?\n').split(' ');
var n = Number(lineData[0]);
var m = Number(lineData[1]);
var eps = readlineSync.question('eps -? \n');
var N = readlineSync.question('N -? \n');

                //// MAIN ////
var a = 1, c = 2, b = 2, d = 3;
console.log('START');

var V = minDiscrepancy([[(x,y)=>{return (y-2)*(y-3)},  
                (x,y)=>{return x*(x-1)*(x-2)}],  
                [(x,y)=>{return (x-1)*(x-2) },  
                (x,y)=>{return y*(y-2)*(y-3)}]],
                f,a,b,c,d,n,m,N,eps);

var V2 = minDiscrepancy([[(x,y)=>{return (y-2)*(y-3)},  
                (x,y)=>{return x*(x-1)*(x-2)}],  
                [(x,y)=>{return (x-1)*(x-2) },  
                (x,y)=>{return y*(y-2)*(y-3)}]],
                f,a,b,c,d,2*n,2*m,N,eps);

console.log('РАЗНОСТЬ С ПОЛОВИННЫМ ШАГОМ\n',getDifferenceVAndV2(V,V2,n,m))
