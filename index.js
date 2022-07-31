
var margin = {top: 40, right: 20, bottom: 40, left: 70},
width =  960- margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

const svg = d3.select("#plot2")
.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

const render2 = (data, scene) => {

    console.log(scene);
    // set the dimensions and margins of the graph

    // filter the data according to value
    if(scene != "0"){
        data = data.filter(function(d){ return d.Scene == scene });
    }else{
        data = data;
    }
    console.log(data)
    // x axis Create scale
    var xscale = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.Timestamp; }))
        .range([0, width]);

    // initialize xaxis
    var xAxis = d3.axisBottom().scale(xscale);
    
    // create a group element move axis to right place and give it a class name
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class","myXaxis")

    // y axis Create scale    
    var yscale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.market_price; })])
        .range([height, 0]);

    // initialize xaxis   
    var yAxis = d3.axisLeft().scale(yscale).ticks(height / 30)
    // create a group element move axis to right place and give it a class name 
    svg.append("g")
        .attr("class","myYaxis")

    // Add the x Axis
    svg.selectAll(".myXaxis") 
        .transition()
        .duration(3000)   
        .call(xAxis); 

    // Add the y Axis
    svg.selectAll(".myYaxis")
        .transition()
        .duration(3000)   
        .call(yAxis); 


    // Add X axis label:
    svg.append("text")
        .attr("class","axislabel")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.bottom-7 )
        .text("Timeline ->");

    // Y axis label:
    svg.append("text")
        .attr("class","axislabel")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.bottom)
        .text("Price $ ->")

     ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Add Title element to svg and info elements
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    svg.append('g')
        .attr("transform", `translate(0,0)`)
        .append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", +30 )
        .attr("text-anchor", "middle")
        .style("font-size","large")
        .text("Price action");


    // define the line
        var valueline = d3.line()
        .x(function(d) { return xscale(d.Timestamp); })
        .y(function(d) { return yscale(d.market_price); });
     
    // Add the valueline path.

    var scenes = svg.selectAll(".path")
        .data([data])
        .join("path")
        .attr("class","path")
        .transition()
        .duration(3000)
        .attr("d", valueline) 
            .attr("fill", "none")
    
    switch (scene) {
        case "1":
            console.log("scene1")
            document.getElementById('cycle1').style.display = "block";
            document.getElementById('cycle2').style.display = "none";
            document.getElementById('cycle3').style.display = "none";
            document.getElementById('cycle4').style.display = "none";
            document.getElementById('cycle5').style.display = "none";
            break;
        case "2":
            document.getElementById('cycle2').style.display = "block";
            document.getElementById('cycle1').style.display = "none";
            document.getElementById('cycle3').style.display = "none";
            document.getElementById('cycle4').style.display = "none";
            document.getElementById('cycle5').style.display = "none";            
            break;
        case "3":
            document.getElementById('cycle3').style.display = "block";
            document.getElementById('cycle1').style.display = "none";
            document.getElementById('cycle2').style.display = "none";
            document.getElementById('cycle4').style.display = "none";
            document.getElementById('cycle5').style.display = "none";   
            break;
        case "4":
            document.getElementById('cycle4').style.display = "block";
            document.getElementById('cycle1').style.display = "none";
            document.getElementById('cycle2').style.display = "none";
            document.getElementById('cycle3').style.display = "none";
            document.getElementById('cycle5').style.display = "none";  
            break;
        case "5":
            document.getElementById('cycle5').style.display = "block";
            document.getElementById('cycle1').style.display = "none";
            document.getElementById('cycle2').style.display = "none";
            document.getElementById('cycle3').style.display = "none";
            document.getElementById('cycle4').style.display = "none";
            break;
        default:
            document.getElementById('cycle1').style.display = "";
            document.getElementById('cycle2').style.display = "";
            document.getElementById('cycle3').style.display = "";
            document.getElementById('cycle4').style.display = "";
            document.getElementById('cycle5').style.display = "";
        }
};


