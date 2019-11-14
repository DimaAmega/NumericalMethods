///// ВАРИАНТ 4 ////
const _cliProgress = require('cli-progress');
const bar1 = new _cliProgress.Bar({format: 'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | AcurateMetod: {AcurateMetod}'});
function f(x,y){
    return -Math.pow(Math.E,-x*Math.pow(y,2));
};
function Norm(V,n,m){
    var res = 0;
    for(var j = 1; j < m; j++)
        for(var i = 1; i<n; i++){
            res+=Math.pow(V[j][i],2);   
        };
    return Math.pow(res,0.5);
};
function NormZs(NormRs,n,m,h,k){
    return (1/getLambdaMin(n,m,h,k))*NormRs;
};
function getLambdaMin(n,m,h,k){
    return (4/(h**2))*(Math.pow( Math.sin(Math.PI/(2*n)) , 2) )+ (4/(k**2))*Math.pow( Math.sin(Math.PI/(2*m)) , 2);
};
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
function ZerosMatrix(n,m){
    var res = [];
    for(var i = 0; i<n; i++){
        res[i] = [];
        for (var j = 0; j<m;j++)
            res[i][j] = 0;
    }
    return res;
}
function getGrid(a,b,n) {
    var linspace,h;
    linspace = [];
    h = (b-a)/n;
    for (var i = a; i<=b+h/2; i+=h) {
        linspace.push(i);
    }
    return linspace;
};
function YacobyLine(V_old,V,n_line,f,a,b,c,d,n,m,X,Y){
    var h = (b-a)/n,
        k = (d-c)/m,
        A = -2*(1/(h**2)+1/(k**2));

    for (var i = 1; i<n;i++){
        V[n_line][i] = (1/A)*( -f(X[i],Y[n_line]) - (1/(k**2))*V_old[n_line][i-1] - (1/(h**2))*V_old[n_line-1][i] - (1/(h**2))*V_old[n_line+1][i] - (1/(k**2))*V_old[n_line][i+1] );
    };
};
function Yacoby(Mu,f,a,b,c,d,n,m,eps,N) {
    var X = getGrid(a,b,n);
    var Y = getGrid(c,d,m);
    var V = ZerosMatrix(m+1,n+1);
    var h = (b-a)/n,
    k = (d-c)/m;

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

    //МЕТОД ЯКОБИ
    var V_old = getCopyMatrix(V);
    var count = 0;
    var epsMethod;
    var evolution = 0;
    bar1.start(N, 0,{
        AcurateMetod: `${0}`,
    });
    do {
        for (var j = 1; j<m;j++){
            YacobyLine(V_old,V,j,f,a,b,c,d,n,m,X,Y); //1-m
        };
        epsMethod = GetNormMethod(V,V_old,n,m);
        bar1.update(evolution++,{
            AcurateMetod: `${epsMethod}`,
        });
        V_old = getCopyMatrix(V);
        count++;
    } while(count<N&&epsMethod>eps);
        // console.log('НОВАЯ\n',V);
        var Rs = GetRs(V,n,m,f,a,b,c,d,X,Y);
        console.log('ЧИСЛО ИТЕРАЦИЙ\n',count);
        console.log('ТОЧНОСТЬ Метода \n',epsMethod);
        console.log('НОрма НЕвязки\n',Norm(Rs,n+1,m+1));
        console.log('Оценка НОрмы Zs\n',NormZs(Norm(Rs,n+1,m+1),n,m,h,k));
return V;
};
function getCopyMatrix(V) {
var res = V.slice();
for (var i = 0; i<V.length; i++) res[i] = V[i].slice();
return res;
}
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

var readlineSync = require('readline-sync');
var lineData = readlineSync.question('n m -?\n').split(' ');
var n = Number(lineData[0]);
var m = Number(lineData[1]);

var eps = readlineSync.question('eps -? \n');
var N = readlineSync.question('N -? \n');

var a = 1, c = 2, b = 2, d = 3;

var h = (b-a)/n;
var k = (d-c)/m;
var xi = (i)=> {return a + i*h};
var yi = (i)=> {return c + i*k};
console.log('START');

var V = Yacoby([[(x,y)=>{return (y-2)*(y-3)},  // левая
        (x,y)=>{return x*(x-1)*(x-2)}],  // верхняя
        [(x,y)=>{return (x-1)*(x-2) },  // нижняя
        (x,y)=>{return y*(y-2)*(y-3)}]], // правая
        f,
        a,b,c,d,n,m,
        eps,N);

var V2 = Yacoby([[(x,y)=>{return (y-2)*(y-3)},  // левая
    (x,y)=>{return x*(x-1)*(x-2)}],  // верхняя
    [(x,y)=>{return (x-1)*(x-2) },  // нижняя
    (x,y)=>{return y*(y-2)*(y-3)}]], // правая
    f,
    a,b,c,d,2*n,2*m,
    eps,N);

console.log('РАЗНОСТЬ С ПОЛОВИННЫМ ШАГОМ\n',getDifferenceVAndV2(V,V2,n,m))
