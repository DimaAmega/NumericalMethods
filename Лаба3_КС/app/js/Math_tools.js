;(function(){
    //////////////////////////////////////
    //Running method
    //////////////////////////////////////
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
    //////////////////////////////////////
    //Some Tools
    //////////////////////////////////////
    function repeatNtime(n,cb) {for (var i = 0; i<n; i++) cb(i);}
    function getDatefromSomeFun(fx,grid) {
        var data = [];
        MT.repeatNtime(grid.length,(i)=>{
            data.push({
                x:grid[i],
                y:fx(grid[i]),
            });
        });
        return data;
    };
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
    function reverseArr(a){
        var res = [];
        for (var i = a.length-1;i>=0;i--){
            res.push(a[i])
        }
        return res;
    }
    //////////////////////////////////
    /////Cubic spline functions
    /////////////////////////////////
    function createSplineFunction(a,b,c,d,xi) {
        return (x)=>a + b*(x-xi) + c*Math.pow(x-xi,2)/2 + d*Math.pow(x-xi,3)/6;
    }
    function createDerSplineFunction(b,c,d,xi) {
        return (x)=>b + c*(x-xi) + d*Math.pow(x-xi,2)/2;
    }
    function create2DerSplineFunction(c,d,xi) {
        return (x)=> c + d*(x-xi);
    }
    function createMatrix(gf,m1,m2) {
    var n = gf.y.length,
        h = gf.x_h,
        A = [],
        C = [],
        b = [];

        A.push(0);
        C.push(1);
        b.push(m1);
    
        repeatNtime(n-2,function(i){
            A.push(h);
            C.push(4*h);
            b.push(6*(gf.y[i+2]-2*gf.y[i+1] + gf.y[i])/gf.x_h)
        });
    
        C.push(1);
        b.push(m2)
        return {A:A,C:C,B:MT.reverseArr(A),b:b}
    }
    function createB_arr(gf,C) {
        var n = gf.y.length,
         h = gf.x_h,
         B_arr = [],
         y = gf.y;
    
        repeatNtime(n-1,(i)=>{B_arr[i+1] = (y[i+1] - y[i])/h + C[i+1]*h/3 + C[i]*h/6;
        });
    
    return B_arr;
    }
    function createD_arr(C,h) {
        var n = C.length,
         D_arr = [];
        repeatNtime(n-1,(i)=>{ D_arr[i+1] = (C[i+1]-C[i])/h; });
        return D_arr;
    }
    function createA_arr(gf) {
        var A_arr = [],
         n = gf.y.length,
         y = gf.y;
         repeatNtime(n-1,(i)=>{ A_arr[i+1] = y[i+1] });
         return A_arr;
    }
    function createCubicSpline(gridFun,m1,m2) {
        var res = createMatrix(gridFun,m1,m2),
        h = gridFun.x_h,
        C = MT.RM(res.A,res.C,res.B,res.b),
        n = gridFun.y.length,
        B = createB_arr(gridFun,C),
        D = createD_arr(C,h),
        A = createA_arr(gridFun),
        a = gridFun.a,
        xi = (i)=>a + i*h,
        S = [];
        repeatNtime(n-1,(i)=>{S[i+1] = createSplineFunction(A[i+1],B[i+1],C[i+1],D[i+1],xi(i+1)); });
        return S;
    }
    function createDerCubicSpline(gridFun,m1,m2) {
        var res = createMatrix(gridFun,m1,m2),
        h = gridFun.x_h,
        C = MT.RM(res.A,res.C,res.B,res.b),
        n = gridFun.y.length,
        B = createB_arr(gridFun,C),
        D = createD_arr(C,h),
        A = createA_arr(gridFun),
        a = gridFun.a,
        xi = (i)=>a + i*h,
        S = [];
        repeatNtime(n-1,(i)=>{S[i+1] = createDerSplineFunction(B[i+1],C[i+1],D[i+1],xi(i+1)); });
        return S;
    }
    function create2DerCubicSpline(gridFun,m1,m2) {
        var res = createMatrix(gridFun,m1,m2),
        h = gridFun.x_h,
        C = MT.RM(res.A,res.C,res.B,res.b),
        n = gridFun.y.length,
        B = createB_arr(gridFun,C),
        D = createD_arr(C,h),
        A = createA_arr(gridFun),
        a = gridFun.a,
        xi = (i)=>a + i*h,
        S = [];
        repeatNtime(n-1,(i)=>{S[i+1] = create2DerSplineFunction(C[i+1],D[i+1],xi(i+1)); });
        return S;
    }
    function createGridFun(fx,a,b,n){
        var h = (b-a)/n;
        var xi = (i)=> a+i*h;
        var res = [];
        repeatNtime(n+1,(i)=>{
            res.push(fx(xi(i)));
        });
    
        return {
            y:res,
            x_h:h,
            a:a,
        }
    }
    function createContiniousFromSpline(S,gridFun){
        var y = gridFun.y;
        var h = gridFun.x_h;
        var n = y.length;
        var a = gridFun.a;
        var xi = (i)=> a + i*h;
    
        return (x)=>{
    
            if(a<=x&&x<=xi(n-1)+h/2) {
                var i = 1; 
                while(x>xi(i)) {
                    i++;
                };
                if(i==n) i--;
                return S[i](x);
            }
        }
    }
 
    


    window.MT = {
        RM: RunningMethod,
        getGrid:getGrid,
        reverseArr:reverseArr,
        createCubicSpline:createCubicSpline,
        repeatNtime:repeatNtime,
        createDerCubicSpline:createDerCubicSpline,
        createGridFun:createGridFun,
        createContiniousFromSpline:createContiniousFromSpline,
        getDatefromSomeFun:getDatefromSomeFun,
        create2DerCubicSpline:create2DerCubicSpline,

    }

}())
