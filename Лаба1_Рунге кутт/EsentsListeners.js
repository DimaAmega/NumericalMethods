///////////////////////////////////
//ADDEVENTSKISTENER
//////////////////////////////////type_ex
document.getElementById("set_mode").addEventListener("change",function(e){
   Options.mode = e.target.value;
});

document.getElementById("set_task").addEventListener("change",function(e){

   Options.type_sistem = e.target.value;
});

document.getElementById("set_options").addEventListener("change",function(e){
        console.dir(e.target.checked);
        if(e.target.name == "u0") {
          Options[e.target.name] = new Vec2(Number(e.target.value.split(',')[0]),Number(e.target.value.split(',')[1]));
        }    
        else
          if(e.target.name == "isRefresh") {
            Options[e.target.name] = e.target.checked;
          }
          else
        Options[e.target.name] = Number(e.target.value);
});


document.getElementById("start").addEventListener("click",function(e){
   Start();
});


var res_button = document.getElementById("back");
res_button.addEventListener("click",function(){
          if(Graph_options.onZoomOptions.length>1) {
               graphick.update(graphick.data,Graph_options.onZoomOptions[Graph_options.onZoomOptions.length - 2]);
               Graph_options.onZoomOptions.pop();
          } 
   })
