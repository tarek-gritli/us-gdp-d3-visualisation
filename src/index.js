const url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
const w=900;
const h=500;
const padding=50;
d3.select("body")
  .style("font-family","roboto")
d3.select("main")
  .append("h1")
  .attr("id","title")
  .text("US GDP")
  .style("color","blue")
  .style("text-align","center")
const svg=d3.select("main")
            .append("svg")
            .attr("width",w)
            .attr("height",h)
            .attr("class","chart")
let tooltip = d3.select("main")
                .append("div")
                .attr("id","tooltip")
                .style("opacity",0)
fetch(url)
.then((response)=>response.json())
.then((dataset)=> {
   const dates=[]
   const gdps=[]
   dataset.data.forEach(element => {
      gdps.push(element[1])
      dates.push(element[0])
   });
   const minDate=d3.min(dates,d=>new Date(d))
   const maxDate=d3.max(dates,d=>new Date(d))
   const maxGdp=d3.max(gdps);
   const xScale = d3.scaleTime()
                  .domain([minDate,maxDate])
                  .range([padding, w - padding])
   const yScale=d3.scaleLinear()
                  .domain([0,maxGdp])
                  .range([h-padding,padding])
   const xAxis=d3.axisBottom(xScale);
   const yAxis=d3.axisLeft(yScale);
   svg.append("g")
      .attr("id","x-axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);
   svg.append("g")
      .attr("id","y-axis")
      .attr("transform", "translate(" + padding + ",0)")
      .attr("class","tick")
      .call(yAxis)
   function handleMouseOver(d,i)
   {
      d3.select("#tooltip")
        .style("opacity",0.9)
        .html("Date: "+dates[i]+"<br>GDP: $"+d.toFixed(2)+" Billion")
        .attr("data-date",dates[i])
        .style("left",(d3.event.pageX+5)+"px")
        .style("top",(d3.event.pageY)+"px");
   }
   function handleMouseOut(){
      d3.select("#tooltip")
        .style("opacity",0)
   }
   svg.selectAll("rect")
      .data(gdps)
      .enter()
      .append("rect")
      .attr("x",(d,i)=>xScale(new Date(dates[i])))
      .attr("y",(d)=>yScale(d))
      .attr("width",(w-padding)/gdps.length)
      .attr("height",d=>h-yScale(d)-padding)
      .attr("fill","navy")
      .attr("class","bar")
      .attr("data-date",(d,i)=>dates[i])
      .attr("data-gdp",(d)=>d)
      .on("mouseover",handleMouseOver)
      .on("mouseout",handleMouseOut);
   d3.select("main")
      .append("text")
      .attr("x",700)
      .attr("class","info")
      .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")

})