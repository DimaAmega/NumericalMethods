function fxy(x,y) { //тестовая функция
    return Math.sin(Math.PI*x*y);
};
function f(x,y){
    return Math.sin(Math.PI*x*y)*(Math.pow(Math.PI*y,2)+Math.pow(Math.PI*x,2));
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
function GetNormAccurate(V_new,fxy,X,Y,n,m) {
    var maxEps = 0;
    for (var i = 1; i<m/2;i++)
        for (var j = 1; j<n;j++)
            if (Math.abs(fxy(X[j],Y[i]) - V_new[i][j]) > maxEps) maxEps = Math.abs(fxy(X[j],Y[i]) - V_new[i][j]);

    for (var i = m/2; i<m;i++)
        for (var j = 1; j<n/2;j++)
            if (Math.abs(fxy(X[j],Y[i]) - V_new[i][j]) > maxEps) maxEps = Math.abs(fxy(X[j],Y[i]) - V_new[i][j]);
    return maxEps;
};
function getTau(V,f,n,m,a,b,c,d) {
    var X = getGrid(a,b,n);
    var Y = getGrid(c,d,m);
    var h = (b-a)/n,
        k = (d-c)/m,
        A = -2*(1/(h**2)+1/(k**2));

    var Rs =  ZerosMatrix(n+1,m+1),
        ARs = ZerosMatrix(n+1,m+1);


        for(var i = 1;i<m/2;i++)
            for (var j = 1; j<n; j++){
                Rs[i][j] =  f(X[j],Y[i]) + V[i][j]*A + V[i+1][j]*(1/(k**2)) + V[i-1][j]*(1/(k**2)) + V[i][j+1]*(1/(h**2)) + V[i][j-1]*(1/(h**2));
            };

        for(var i = m/2;i<m;i++)
            for (var j = 1; j<n/2; j++){
                Rs[i][j] =  f(X[j],Y[i]) + V[i][j]*A + V[i+1][j]*(1/(k**2)) + V[i-1][j]*(1/(k**2)) + V[i][j+1]*(1/(h**2)) + V[i][j-1]*(1/(h**2));
            };

        var Rs_zeros = getCopyMatrix(Rs);

       //НУЛЕВЫЕ ГРАН УСЛОВИЯ
    for (var i = 0;i<=m;i++) { // левая
        Rs_zeros[i][0] = 0
    };
    for (var i = 0;i<=m/2;i++) { // правая
        Rs_zeros[i][n] = 0;
    };
    for (var i = 0;i<=n;i++) { // низ
        Rs_zeros[0][i] = 0;
    };
    for (var i = 0;i<=n/2;i++) { // верх
        Rs_zeros[m][i] = 0;
    };
    for (var i = n/2;i<=n;i++) { 
        Rs_zeros[m/2][i] = 0;
    };
    for (var i = m/2;i<=m;i++) { 
        Rs_zeros[i][n/2] = 0;
    };
       // 

       /*
        for(var i = 1;i<m/2;i++)
            for (var j = 1; j<n; j++){
                Rs[i][j] =  f(X[j],Y[i]) + V[i][j]*A + V[i+1][j]*(1/(k**2)) + V[i-1][j]*(1/(k**2)) + V[i][j+1]*(1/(h**2)) + V[i][j-1]*(1/(h**2));
            };

        for(var i = m/2;i<m;i++)
            for (var j = 1; j<n/2; j++){
                Rs[i][j] =  f(X[j],Y[i]) + V[i][j]*A + V[i+1][j]*(1/(k**2)) + V[i-1][j]*(1/(k**2)) + V[i][j+1]*(1/(h**2)) + V[i][j-1]*(1/(h**2));
            }; 
       */
        for(var i = 1;i<m/2;i++)
            for (var j = 1; j<n; j++){
                ARs[i][j] = Rs_zeros[i][j]*A + Rs_zeros[i+1][j]*(1/(k**2)) + Rs_zeros[i-1][j]*(1/(k**2)) + Rs_zeros[i][j+1]*(1/(h**2)) + Rs_zeros[i][j-1]*(1/(h**2));
            };

        for(var i = m/2;i<m;i++)
            for (var j = 1; j<n/2; j++){
                ARs[i][j] = Rs_zeros[i][j]*A + Rs_zeros[i+1][j]*(1/(k**2)) + Rs_zeros[i-1][j]*(1/(k**2)) + Rs_zeros[i][j+1]*(1/(h**2)) + Rs_zeros[i][j-1]*(1/(h**2));
            };
        
        var denominator = 0;
        var numerator = 0;

        for (var j = 1; j<n; j++)
            for(var i = 1;i<m;i++)
                denominator+= Math.pow(ARs[i][j],2);
        
        for (var j = 1; j<n; j++)
            for(var i = 1;i<m;i++)
                numerator+= ARs[i][j]*Rs[i][j];
                
        var res = -numerator/denominator;
       return res;
};
function minDiscrepancy(fxy,f,a,b,c,d,n,m,N,eps){
    ///  ГРАН УСЛОВИЯ ///
    var X = getGrid(a,b,n);
    var Y = getGrid(c,d,m);
    var V = ZerosMatrix(n+1,m+1);
    var h = (b-a)/n,
        k = (d-c)/m,
        A = -2*(1/(h**2)+1/(k**2));
    // ГРАН УСЛОВИЯ
    for (var i = 0;i<=m;i++) { // левая
        V[i][0] = fxy(X[0],Y[i]);
    };
    for (var i = 0;i<=m/2;i++) { // правая
        V[i][n] = fxy(X[n],Y[i]);
    };
    for (var i = 0;i<=n;i++) { // низ
        V[0][i] = fxy(X[i],Y[0]);
    };
    for (var i = 0;i<=n/2;i++) { // верх
        V[m][i] = fxy(X[i],Y[m]);
    };

    for (var i = n/2;i<=n;i++) { 
        V[m/2][i] = fxy(X[i],Y[m/2]);
    };

    for (var i = m/2;i<=m;i++) { 
        V[i][n/2] = fxy(X[n/2],Y[i]);
    };
    count = 0;
    var t;
    // console.log(V);

    do {
        var V_copy = getCopyMatrix(V);
        t = getTau(V_copy,f,n,m,a,b,c,d);
        // console.log('TAU',t);

        for(var i = 1;i<m/2;i++)
            for (var j = 1; j<n; j++){
                V[i][j] = V_copy[i][j] - t*(-f(X[j],Y[i]) - V_copy[i][j]*A -V_copy[i+1][j]*(1/(k**2)) - V_copy[i-1][j]*(1/(k**2)) - V_copy[i][j+1]*(1/(h**2)) - V_copy[i][j-1]*(1/(h**2)));
            };

        for(var i = m/2;i<m;i++)
            for (var j = 1; j<n/2; j++){
                V[i][j] = V_copy[i][j] - t*(-f(X[j],Y[i]) - V_copy[i][j]*A -V_copy[i+1][j]*(1/(k**2)) - V_copy[i-1][j]*(1/(k**2)) - V_copy[i][j+1]*(1/(h**2)) - V_copy[i][j-1]*(1/(h**2)));
            };

        epsMethod = GetNormMethod(V_copy,V,n,m);
        // console.log('Точность',epsMethod);
        // console.log('ТАУ',t);
        count++;
    } while(count<N&&epsMethod>eps);

    console.log('ЧИСЛО ИТЕРАЦИЙ\n',count);
    console.log('ТОЧНОСТЬ Метода \n',epsMethod);
    console.log('ТОЧНОСТЬ ПОЛНАЯ \n',GetNormAccurate(V,fxy,X,Y,n,m));
    for (var i = 0; i < V.length;i++) 
        for (var j = 0; j < V[i].length;j++){
            V[i][j] = V[i][j].toFixed(2);
        };

//    for (var i = 0; i < V.length;i++)
//         console.log(V[i]);
    return V;
};

var readlineSync = require('readline-sync');
var lineData = readlineSync.question('n m -?\n').split(' ');
var n = Number(lineData[0]);
var m = Number(lineData[1]);

var eps = readlineSync.question('eps -? \n');
var N = readlineSync.question('N -? \n');

var a = 1, c = 2, b = 2, d = 3;
console.log('       START     ');
var V = minDiscrepancy(fxy,f,a,b,c,d,n,m,N,eps);

// var V2 = minDiscrepancy([[(x,y)=>{return (y-2)*(y-3)},  
//                 (x,y)=>{return x*(x-1)*(x-2)}],  
//                 [(x,y)=>{return (x-1)*(x-2) },  
//                 (x,y)=>{return y*(y-2)*(y-3)}]],
//                 f,a,b,c,d,2*n,2*m,N,eps);

// console.log('РАЗНОСТЬ С ПОЛОВИННЫМ ШАГОМ\n',getDifferenceVAndV2(V,V2,n,m))
