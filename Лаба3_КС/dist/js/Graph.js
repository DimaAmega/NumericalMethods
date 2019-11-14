function createGraph(options) {

////////////////////////////
//private variable
///////////////////////////
var parElem = d3.select(`#`+options.parId),
height = parElem.node().offsetHeight,
width = parElem.node().offsetWidth,
data = options.data,
svg = parElem.append("svg")
.attr("width", width)
.attr("height", height),
xmax,xmin,ymax,ymin,xScale,yScale,line;
/////////////////////////////
//Constructor
/////////////////////////////
updateScale();

svg.selectAll(".line")
.data(data)
.enter()
.append('path')
.attr('d',line)
.attr("class",(d,i)=> 'line ' + options.style[i]);

///////////////////////////
//private method
///////////////////////////
function updateScale(){

  xmax = d3.extent(data[0], d => d.x)[1];
  xmin = d3.extent(data[0], d => d.x)[0];
      
  ymax = d3.extent(data[0], d => d.y)[1];
  ymin = d3.extent(data[0], d => d.y)[0];
  
  for (var i = 1;i<data.length;i++){
      if(d3.extent(data[i], d => d.x)[1]>xmax) xmax = d3.extent(data[i], d => d.x)[1];
      if(d3.extent(data[i], d => d.x)[0]<xmin) xmin = d3.extent(data[i], d => d.x)[0];
  
      if(d3.extent(data[i], d => d.y)[1]>ymax) ymax = d3.extent(data[i], d => d.y)[1];
      if(d3.extent(data[i], d => d.y)[0]<ymin) ymin = d3.extent(data[i], d => d.y)[0];
  
  }
  // 5. X scale will use the index of our data
   xScale = d3.scaleLinear()
    .domain([xmin,xmax]) // input
    .range([0,width]); // output
  
  
  // 6. Y scale will use the randomly generate number 
   yScale = d3.scaleLinear()
    .domain([ymin,ymax]) // input 
    .range([height,0]); // output
  
   line = d3.line()
    .x(function(d) { return xScale(d.x) ;}) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
  
  // remove axis
  svg.selectAll('g').remove();
  
  //append new axis
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

  svg.append("g")
  .attr("class", "y-axis")
  .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
  }

  
  for(var i = 0; i<data.length;i++){
    svg.selectAll(`.dot${i}`)
    .data(data[i])
    .enter()
    .append('circle')
    .attr('cx',(d)=>xScale(d.x))
    .attr('cy',(d)=>yScale(d.y))
    .attr('class',`dot${i} dotstyle`);
  }

///////////////////////////
//public method
///////////////////////////

this.updatePlot = function(data_new,style) {
var lenpr = data.length;
var i;
data = data_new;
updateScale();

//new data

  //remove
    svg.selectAll('.line')
    .data(data).exit().transition().duration(1000).remove();

  //update old
    svg.selectAll('.line')
    .data(data)
    .transition().duration(1000)
    .attr('d',line);

    //add new
    svg.selectAll('.line')
    .data(data).enter().append('path')
    .transition().duration(1000)
    .attr('d',line)
    .attr("class",(d,i)=> 'line ' + style[i]);

    /////////////////////
    //Update dots
    ////////////////////

    for(i = 0; i<data.length;i++){


      svg.selectAll(`.dot${i}`)
      .data(data[i])
      // .transition()
      .attr('cx',(d)=>xScale(d.x))
      .attr('cy',(d)=>yScale(d.y))
      .attr('class',`dot${i} dotstyle`);

      svg.selectAll(`.dot${i}`)
      .data(data[i])
      .exit().remove();


      svg.selectAll(`.dot${i}`)
      .data(data[i])
      .enter()
      .append('circle')
      // .transition()
      .attr('cx',(d)=>xScale(d.x))
      .attr('cy',(d)=>yScale(d.y))
      .attr('class',`dot${i} dotstyle`);
    }

    //delete exit dots
    for(var j = i; j<=lenpr; j++) svg.selectAll(`.dot${j}`).remove();


    }
}