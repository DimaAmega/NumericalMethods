///////////////////////////////////
//ADDEVENTSKISTENER
//////////////////////////////////
document.getElementById("set_task").addEventListener("change",function(e){
  Main_settings["tasknumber"] = e.target.value;
});
document.getElementById("set_options").addEventListener("change",function(e){

          if(e.target.name == "isRefresh") {
            Main_settings[e.target.name] = e.target.checked;
          }
          else
          Main_settings[e.target.name] = Number(e.target.value);
});
document.getElementById("start").addEventListener("click",function(e){
  Start();
});

document.getElementById("back").addEventListener("click",function(){
          if(Graph_options.onZoomOptions.length>1) {
               graphick.update(graphick.data,Graph_options.onZoomOptions[Graph_options.onZoomOptions.length - 2]);
               Graph_options.onZoomOptions.pop();
          } 
   });

document.getElementById("back2").addEventListener("click",function(){
          if(Graph_options2.onZoomOptions.length>1) {
               graphick2.update(graphick2.data,Graph_options2.onZoomOptions[Graph_options2.onZoomOptions.length - 2]);
               Graph_options2.onZoomOptions.pop();
          } 
   });
