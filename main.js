var dataset;
var selection;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

const type = d3.annotationBadge

const annotations = [{
  subject: {
    text: "E",
    x: "right"
  },
  data: { x: 122, y:-0.78},
},
{
    subject: {
      text: "A",
      x: "right"
    },
    data: { x: 243, y:-0.16},
},
{
    subject: {
      text: "B",
      x: "left"
    },
    data: { x: 420, y:-0.13},
},
{
    subject: {
      text: "C",
      x: "left"
    },
    data: { x: 388, y:-0.15},
},
{
    subject: {
      text: "D",
      x: "right"
    },
    data: { x: 100, y:-0.15},
},

]

const render = () => {

    tokeep = ["1", "2", "3", "4", "5"];

    // filter the data according to value
    data = dataset.filter(function(d,i){ return tokeep.indexOf(d.Scene) >= 0 });
    console.log(data);
    console.log(d3.max(data, function(d) { return d.days_scene_idx; }))

    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 20, bottom: 100, left: 70},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Add SVG element
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // Add svg
    var svg = d3.select("#plot1")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g") //appends a 'group' element to 'svg'
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .on("pointerenter", pointerentered)
    .on("pointermove", pointermoved)
    .on("pointerleave", pointerleft) // moves the 'group' element to the top left margin
    .on("click",(d) => (render2(data,selection) ))
    .on("touchstart", event => event.preventDefault());

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Add Title element to svg and info elements
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    svg.append('g')
        .attr("transform", `translate(0,0)`)
        .append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", -30 )
        .attr("text-anchor", "middle")
        .text("Bitcoin cycles")
    
    svg.append('g')
        .attr("transform", `translate(0,0)`)
        .append("text")
        .attr("class", "info")
        .attr("x", width / 2 + 200)
        .attr("y", 30 )
        .attr("text-anchor", "middle")
        .text("Click to drill down")

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Create Axis definitions
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // x axis Create scale
    var xscale = d3.scaleLinear()
        .domain([0,d3.max(data, function(d) { return d.days_scene_idx; })])
        .range([0, width]);

    // initialize xaxis
    var xAxis = d3.axisBottom().scale(xscale);
    
    // create a group element move axis to right place and give it a class name
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class","myXaxis")

    // y axis Create scale    
    var yscale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d.MaxDrawdown; }), 0])
        .range([height, 0]);

    // initialize xaxis   
    var yAxis = d3.axisLeft().scale(yscale).ticks(height / 30).tickFormat(d3.format('~%')) 
    // create a group element move axis to right place and give it a class name 
    svg.append("g")
        .attr("class","myYaxis")

    // Add the x Axis
    svg.selectAll(".myXaxis") 
        .call(xAxis); 

    // Add the y Axis
    svg.selectAll(".myYaxis")
        .call(yAxis);

    // add the Y gridlines
    const yAxisGrid = d3.axisLeft(yscale).tickSize(-width).tickFormat('').ticks(20);
    svg.append('g')
        .attr('class', 'y axis-grid')
        .call(yAxisGrid);

    // Add X axis label:
    svg.append("text")
        .attr("class","axislabel")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.bottom -70 )
        .text("Number of days ->");

    // Y axis label:
    svg.append("text")
        .attr("class","axislabel")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+30)
        .attr("x", -margin.top)
        .text("Drawdown % ->")

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Draw the chart
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // define the line
    var valueline = d3.line()
        .x(function(d) { return xscale(d.days_scene_idx); })
        .y(function(d) { return yscale(d.drawdown); });

    const path = svg.append("g")
        .attr("fill", "none")
        .attr("class","path")
      .selectAll("path")
      .data(d3.group(data, d => d.Scene))
      .join("path")
        .attr("d", ([, value]) => valueline(value));
 
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Make annotations
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const type = d3.annotationCustomType(
        d3.annotationBadge, 
            {"subject":{"radius": 10 }}
        )
    
    const makeAnnotations = d3.annotation()
        .type(type)
        .accessors({ 
            x: function(d){ return xscale(d.x)},
            y: function(d){ return yscale(d.y) }
        })
        .annotations(annotations)
    
     d3.select("svg")
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)

    //annotations for legend
    const annotationsLegend = [{
        note: { label: "2012 Halving ATH" },
        subject: { text: "A" }
        },
        {
        note: { label: "2016 Halving ATH" },
        subject: { text: "B" }
        },
        {
        note: { label: "2018 Halving ATH" },
        subject: { text: "C" }
        },
        {
        note: { label: "2020 Halving ATH" },
        subject: { text: "D" }
        },
        {
        note: { label: "Today" },
        subject: { text: "E" }
        }
        ].map(function(d, i){
        d.x = margin.left + i*200
        d.y = 540
        d.subject.x = "right" 
        d.subject.y = "bottom" 
        d.subject.radius = 10
        return d
    })

    const makeLegendAnnotations = d3.annotation()
        .type(d3.annotationBadge)
        .annotations(annotationsLegend)

    d3.select("svg")
        .append("g")
        .attr("class", "annotation-legend")
        .call(makeLegendAnnotations)
        
    d3.select("svg g.annotation-legend")
        .selectAll('text.legend')
        .data(annotationsLegend)
        .enter()
        .append('text')
        .attr('class', 'legend')
        .text(function(d){ return d.note.label })
        .attr('x', function(d, i){ return margin.left + 30 + i*200 })
        .attr('y', 560)

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Tool Tip
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // Append Circle and annotations to 
    const dot = svg.append("g")
        .attr("display", "none")
  
    dot.append("circle")
        .attr("r", 5.5)
        .attr('fill','red');
  
    dot.append("text")
        .attr("font-family", "cursive")
        .attr("font-size", 15)
        .attr("text-anchor", "end")
        .attr('fill','darkred')
        .attr("y", -30);

    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Events
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function pointermoved(event) {
        
        const [x1, y1] = d3.pointer(event);
        const i = d3.least(data, d => Math.hypot(xscale(d.days_scene_idx) - x1, yscale(d.drawdown) - y1));
        console.log(i)

        selection=i.Scene;

        const stroke = ([z]) => i.Scene == z ? "black" : "#ddd";
        const strokeWidth = ([z]) => i.Scene == z ? 3.5 : 1.5;
        path.style("stroke", stroke).filter(([z]) => i.Scene == z).raise();
        path.style("stroke-width", strokeWidth);

        Tag = data.filter(function(d){ return d.Scene == i.Scene })[0].Tag;
        dot.attr("transform", `translate(${xscale(i.days_scene_idx)},${yscale(i.drawdown)})`);
        dot.select("text").text("$" + i.market_price)
        console.log(xscale(i.days_scene_idx))

        //Change the text anchor depending on co-ordinates
        if(xscale(i.days_scene_idx)<=150){
            dot.select("text").attr("text-anchor", "start ");
        }else{
            dot.select("text").attr("text-anchor", "end ");
        }

        //Transition Title Opacity to improve readability of annotations
        console.log(yscale(i.drawdown))
        if(yscale(i.drawdown)<=45 && (xscale(i.days_scene_idx)>=400 && xscale(i.days_scene_idx)<=500)){
            d3.select(".title")
                .transition()
                .duration(300)
                .style("opacity", 0);
        }else{
            d3.select(".title")
                .transition()
                .duration(300)
                .style("opacity", 1);
        }
    }

    function pointerentered() {
        path.style("stroke", "#ddd");
        dot.attr("display", null);
    }

    function pointerleft() {
        path.style("stroke", null).style("stroke-width", null);
        dot.attr("display", "none");
    }

};

d3.csv('price-formatted.csv').then(data => {
    data.forEach(d => {
        d.Days = + d.Days;
        d.market_price = + d.market_price;
        d.max_peaks_idx = + d.max_peaks_idx;
        d.drawdown = +d.drawdown;
        d.MaxDrawdown = +d.MaxDrawdown;
        d.days_scene_idx = +d.days_scene_idx;
        d.Timestamp = parseTime(d.Timestamp);
    });

    console.log(data);
    dataset = data;
    render();
    render2(data, 0)
});

