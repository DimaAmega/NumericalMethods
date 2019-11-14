OptionsForm = {};
var settingsTask = {
    test:{
        fx: (x)=>{
            if(x<=0) return Math.pow(x,3) +3*Math.pow(x,2);
            if(x>0) return  -Math.pow(x,3) +3*Math.pow(x,2);
        },
        fxder : (x)=>{
            if(x<=0) return 3*Math.pow(x,2) +6*x;
            if(x>0) return -3*Math.pow(x,2) +6*x;
        },
        fx2der: (x)=>{
            if(x<=0) return 6*x +6;
            if(x>0) return -6*x +6;
        },
    },
    main1:{
        fx: (x)=>{return Math.sin(Math.cos(x))},
        fxder: (x)=>{return -Math.sin(x)*Math.cos(Math.cos(x)) },
        fx2der: (x)=>{ return-Math.pow(Math.sin(x),2)*Math.sin(Math.cos(x)) -Math.cos(x)*Math.cos(Math.cos(x)) },
    },
    main2:{
        fx: (x)=>{return Math.sin(Math.cos(x)) + Math.cos(10*x) },
        fxder: (x)=>{return -Math.sin(x)*Math.cos(Math.cos(x)) - 10*Math.sin(10*x)},
        fx2der: (x)=>{ return -Math.pow(Math.sin(x),2)*Math.sin(Math.cos(x)) - Math.cos(x)*Math.cos(Math.cos(x)) -100*Math.cos(10*x) },
    },
}
var settingsBorder = {
    test:{
        naturals:[0,0],
        accurate:[0,0],
    },
    main1:{
        naturals:[0,0],
        accurate:[-Math.cos(1),-(Math.cos(1)*Math.cos(Math.cos(1)) + Math.sin(1)*Math.sin(1)*Math.sin(Math.cos(1)))],
    },
    main2:{
        naturals:[0,0],
        accurate:[-Math.cos(1) -100,-(Math.cos(1)*Math.cos(Math.cos(1)) + Math.sin(1)*Math.sin(1)*Math.sin(Math.cos(1)))-100*Math.cos(10)],
    },
};
var settingsRange = {
    test:[-1,1],
    main1:[0,1],
    main2:[0,1],
}
var CONTROL_N = 4;
var style_graph = ['lSol','l ','nl','l'];

var graph1 = new createGraph({
    parId:'gr1',
    data:[[]],
    style:style_graph,
});
var graph2 = new createGraph({
    parId:'gr2',
    data:[[]],
    style:['l ','nl','l'],
});
var graph3 = new createGraph({
    parId:'gr3',
    data:[[]],
    style:style_graph,
});
var graph4 = new createGraph({
    parId:'gr4',
    data:[[]],
    style:style_graph,
});
var HANDLE = ["i","\\(x_{i}\\)","\\(F(x_i)\\)","\\(S(x_i)\\)","\\(F(x_i)-S(x_i)\\)","\\(F'(x_i)\\)","\\(S'(x_i)\\)","\\(F'(x_i)-S'(x_i)\\)"];

function Go(){

    if(OptionsForm.N&&OptionsForm.task&&OptionsForm.typeBorder) {
        
        var data1 = [];
        var data2 = [];
        var data3 = [];
        var data4 = [];

        var boards = settingsBorder[OptionsForm.task][OptionsForm.typeBorder];
        var task = settingsTask[OptionsForm.task];
        var m_arr = settingsRange[OptionsForm.task];

        var DT = GetDataTask(m_arr[0],m_arr[1],task.fx,task.fxder,task.fx2der,OptionsForm.N,CONTROL_N,boards[0],boards[1]);
        var DTable = DTools.getGataTable(DT);

        if(OptionsForm.N<=1000){

            data1.push(MT.getDatefromSomeFun(task.fx,DT.gridForSolution)); //точное по собственной сеткеc
            data1.push(MT.getDatefromSomeFun(DT.continiousS,DT.controlGrid)); //Сам сплайн по контрольной сетке
            data1.push(MT.getDatefromSomeFun(DT.continiousS,DT.mainGrid)); //Показывает основную сетку   
            graph1.updatePlot(data1,style_graph);

            data3.push(MT.getDatefromSomeFun(DT.diffirenceS,DT.controlGrid)); //sub сплайна
            graph3.updatePlot(data3,style_graph);

            data2.push(MT.getDatefromSomeFun(DT.continiousDerS,DT.controlGrid)); //Производная сплайна
            graph2.updatePlot(data2,style_graph);

            data4.push(MT.getDatefromSomeFun(DT.diffirenceDerS,DT.controlGrid));//sub Производная сплайна
            graph4.updatePlot(data4,style_graph);

            DTools.createTable(DTable,HANDLE);
        }
        else alert('Слишком много точек, график и таблица не будет построены');

    }
    else alert('Вы ввели не все параметры!');
};





