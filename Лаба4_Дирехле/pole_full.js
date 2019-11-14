function fxy(x,y) { //тестовая функция
    return Math.sin(Math.PI*x*y);
};
function NormZs(NormRs,n,m,h,k){
    return (1/getLambdaMin(n,m,h,k))*NormRs;
};
function getLambdaMin(n,m,h,k){
    return (4/(h**2))*(Math.pow( Math.sin(Math.PI/(2*n)) , 2) )+ (4/(k**2))*Math.pow( Math.sin(Math.PI/(2*m)) , 2);
};
function Z(h,k){
    var M = 7890;
    return (1/8)*M*(h**2 + k**2); 
}
function GetRs(V,n,m,f,a,b,c,d,X,Y){
    var res = ZerosMatrix(m+1,n+1);
    var h = (b-a)/n,
    k = (d-c)/m,
    A = -2*(1/(h**2)+1/(k**2));

    for (var j = 1; j<n; j++)
        for(var i = 1;i<m;i++){
            res[i][j] =  f(X[j],Y[i]) + V[i][j]*A + V[i+1][j]*(1/(k**2)) + V[i-1][j]*(1/(k**2)) + V[i][j+1]*(1/(h**2)) + V[i][j-1]*(1/(h**2));
        };
    return res;
};
function Norm(V,n,m){
    var res = 0;
    for(var j = 1; j < m; j++)
        for(var i = 1; i<n; i++){
            res+=Math.pow(V[j][i],2);   
        };
    return Math.pow(res,0.5);
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
    for (var i = 1; i<m;i++)
        for (var j = 1; j<n;j++)
            if (Math.abs(fxy(X[j],Y[i]) - V_new[i][j]) > maxEps) maxEps = Math.abs(fxy(X[j],Y[i]) - V_new[i][j]);
    return maxEps;
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
    for (var i = 0;i<=m;i++) { // левая правая
        V[i][0] = fxy(X[0],Y[i]);
        V[i][n] = fxy(X[n],Y[i]);
    };

    for (var i = 0;i<=n;i++) { // низ верх
        V[0][i] = fxy(X[i],Y[0]);
        V[m][i] = fxy(X[i],Y[m]);
    };

    count = 0;
    var t;
    const bar1 = new _cliProgress.Bar({format: 'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | AcurateMetod: {AcurateMetod}'});
    bar1.start(N, 0,{
        AcurateMetod: `${0}`,
    });
    var evolution = 0;
    do {
        var V_copy = getCopyMatrix(V);
        t = getTau(V_copy,f,n,m,a,b,c,d);
        // console.log('ТАУ',t);

        for(var i = 1;i<m;i++)
            for (var j = 1; j<n; j++){
                V[i][j] = V_copy[i][j] - t*(-f(X[j],Y[i]) - V_copy[i][j]*A -V_copy[i+1][j]*(1/(k**2)) - V_copy[i-1][j]*(1/(k**2)) - V_copy[i][j+1]*(1/(h**2)) - V_copy[i][j-1]*(1/(h**2)));
            };

        epsMethod = GetNormMethod(V_copy,V,n,m);
        bar1.update(evolution++,{
            AcurateMetod: `${epsMethod}`,
        });
        count++;
    } while(count<N&&epsMethod>eps);
    var Rs = GetRs(V,n,m,f,a,b,c,d,X,Y);
    console.log('ЧИСЛО ИТЕРАЦИЙ\n',count);
    console.log('ТОЧНОСТЬ Метода \n',epsMethod);
    console.log('ТОЧНОСТЬ ПОЛНАЯ \n',GetNormAccurate(V,fxy,X,Y,n,m));
    console.log('НОрма НЕвязки\n',Norm(Rs,n+1,m+1));
    console.log('Оценка НОрмы Zs\n',NormZs(Norm(Rs,n+1,m+1),n,m,h,k));
    console.log('Оценка Z',Z(h,k))

    return V;
};


var n = 400
var m = 400

var eps = 1e-8;
var N = 500000;

var a = 1, c = 2, b = 2, d = 3;

const _cliProgress = require('cli-progress');

console.log('       START       ');
var V = minDiscrepancy(fxy,f,a,b,c,d,n,m,N,eps);

// var V2 = minDiscrepancy([[(x,y)=>{return (y-2)*(y-3)},  
//                 (x,y)=>{return x*(x-1)*(x-2)}],  
//                 [(x,y)=>{return (x-1)*(x-2) },  
//                 (x,y)=>{return y*(y-2)*(y-3)}]],
//                 f,a,b,c,d,2*n,2*m,N,eps);

// console.log('РАЗНОСТЬ С ПОЛОВИННЫМ ШАГОМ\n',getDifferenceVAndV2(V,V2,n,m))
