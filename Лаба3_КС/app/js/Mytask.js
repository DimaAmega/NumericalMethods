(function(){

    function GetDataTask(a,b,fx,fxder,fx2der,n,N,m1,m2) {
        var MAIN_GRID = 200;

        var gridFun = MT.createGridFun(fx,a,b,n); //Сеточная функция задачи 
        var S = MT.createCubicSpline(gridFun,m1,m2); //Сплайн - массив
        var SDer = MT.createDerCubicSpline(gridFun,m1,m2); //сплайн производных - Массив
        var S2Der = MT.create2DerCubicSpline(gridFun,m1,m2);

        var continiousS =  MT.createContiniousFromSpline(S,gridFun); //непрерывный сплайн
        var continiousDerS =  MT.createContiniousFromSpline(SDer,gridFun); //непрерывный сплайн произв
        var continious2DerS = MT.createContiniousFromSpline(S2Der,gridFun); //непрерывный сплайн вторых произв

        return {
            gridForSolution: MT.getGrid(a,b,MAIN_GRID), //сетка для Точного
            controlGrid: MT.getGrid(a,b,n*N), //контрольная сетка
            mainGrid:MT.getGrid(a,b,n),
            diffirenceS: function(x){ //функция разности Сплайна
                return fx(x) - continiousS(x);
            },
            diffirenceDerS : function(x){ //функция разности Производной Сплайна
                return fxder(x) - continiousDerS(x);
            },
            diffirence2DerS : function(x){ //функция разности Производной Сплайна
                return fx2der(x) - continious2DerS(x);
            },
            S: S, //Сплайн - массив
            SDer:SDer, //сплайн производных - Массив
            continiousS:continiousS, //Функция сплайна
            continiousDerS:continiousDerS, //Функция прооизводной сплайна
            continious2DerS:continious2DerS,
            fx:fx,
            fxder:fxder,
            fx2der:fx2der,
        }
    }
window.GetDataTask = GetDataTask;
})();