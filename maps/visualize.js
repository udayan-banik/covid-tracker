
/* This is ES6 destructuring */
const { select, 
        json,
        csv,
        zoom,
        geoMercator,
        geoPath, 
        geoCentroid,
        scaleSqrt,
        scaleOrdinal,
        max,
} = d3;

const { feature } = topojson;

const svg = select("svg");

if (screen.width < 600)
    svg.attr("width", 0.7*screen.width);
    svg.attr("height", 3*0.7*screen.width/4)

const width = svg.attr("width");
const height = svg.attr("height");

const g = svg.append("g");

// the path generator for map
const projection = geoMercator();
const pathGenerator = geoPath().projection(projection);

var states = {};
var covidData = [];

var stateOutlines;
var stateOnFocus = -1;

const sizeScale = scaleSqrt();
if (screen.width > 600)
    sizeScale.range([0, 40]);
else if (screen.width > 300)
    sizeScale.range([0, 10]);
else 
    sizeScale.range([0, 5]);

const colorScale = scaleOrdinal()
    .domain(["confirmed", "active", "recovered", "deceased"])
    .range(['#ff073a', '#007bff', '#28a745', '#6c757d']);

// get the zoom function and set the event handlers on it
const myZoom = zoom().on("zoom", () => {
    g.attr("transform", d3.event.transform)
    // preserve the stroke width while zoom
        .attr("stroke-width", 1/d3.event.transform.k);
}).scaleExtent([1, 10]);

Promise.all([
    json("./maps/india.json"),
    csv("./maps/state_abbr.csv"),
    json("https://data.incovid19.org/v4/min/data.min.json")
]).then(([country, abbrTable, data]) => {
    states = feature(country, country.objects.states);

    states.features = states.features.sort(
        (a, b) => a.id.localeCompare(b.id)
    );

    covidData = abbrTable.reduce((accumulator, d, i) => {
        accumulator.push(data[d.Abbreviation].total);
        accumulator[i].active = accumulator[i].confirmed?accumulator[i].confirmed:0;
        accumulator[i].active -= accumulator[i].recovered?accumulator[i].recovered:0;
        accumulator[i].active -= accumulator[i].deceased?accumulator[i].deceased:0;
        accumulator[i].active -= accumulator[i].other?accumulator[i].other:0;

        return accumulator;
    }, []);

    
    // setting the zoom behaviour on svg
    svg.call(myZoom)
    // double cilck event is mapped to reset functionality
        .on("dblclick.zoom", () => {
            // simulate clicking India in dropdown
            d3.event.stopPropagation();
            document.querySelector(".select-selected").click();
            document.querySelectorAll(".select-items div").item(0).click();
        });
    
    // reset the map on clicking the svg
    svg.on("click", () => {
        // simulate clicking India in dropdown
        d3.event.stopPropagation();
        document.querySelector(".select-selected").click();
        document.querySelectorAll(".select-items div").item(0).click();
    });

    // binding data with the dropdown for ease of zooming


    /* the key function will be called for both dropdown divs and
     * each datum in data, 
     * for dropdowns the data is not defined so it will take i-1
     * for data key function will return i
     * it will compare both the values and bind the matching pair
     */
    const dropdown = d3.select("#states-select")
        .select(".select-items")
        .selectAll("div")
        .data(states.features.filter(d => d.id !== "India")
            .sort((a, b) => a.id.localeCompare(b.id)),
            (d, i) => d?i:i-1
        );

    // update selection should match with 
    // corresponding state and should zoom 
    // in map accordingly
    dropdown.on("click", zoomToState);

    // the exit selection should match to
    // dropdown corresponding to india
    dropdown.exit().on("click", reset);

    // the rest of the calculation will be in unit scale and 
    // origin (normalizing)
    // until projection is altered
    projection.scale(1).translate([0, 0]);

    // gives the top left and bottom right corner of the bounding box of country
    const bounds = pathGenerator.bounds(states);

    const dx = bounds[1][0] - bounds[0][0], // width of box
          dy = bounds[1][1] - bounds[0][1], // height of box
          x = (bounds[1][0] + bounds[0][0])/2, // mid point
          y = (bounds[1][1] + bounds[0][1])/2; // of the bounding box

    // taking 95% of canvas to bbox ration is maintained
    // to account for margin
    const s = 0.95 / Math.max( dx/width, dy/height );
    // translate from (width/2, height/2) to (x, y)
    const t = [width/2 - s*x, height/2 - s*y];

    projection.scale(s).translate(t);

    /* This part will be useful in zooming to a particular state, 
    but more on that later. */
    // const bb = pathGenerator.bounds(states.features[32]);

    // g.append("rect")
    //     .attr("x", bb[0][0])
    //     .attr("y", bb[0][1])
    //     .attr("width", bb[1][0] - bb[0][0])
    //     .attr("height", bb[1][1] - bb[0][1]);

    states.features.forEach((d, i) => {
        d.properties.centroid = projection(geoCentroid(d));
    });

    g.selectAll("path").data(states.features)
        .enter().append("path")
        .attr("d", pathGenerator)
        .attr("class", "state")
        .append("title");

    fillCircles(states, covidData, "confirmed");

    d3.select("#resetMap").on("click", reset);
});

const visualize = () => {
    let val = document.querySelector("#category").value;
    fillCircles(states, covidData, val);
};

const fillCircles = (states, covidData, category) => {
    // console.log(pathGenerator.bounds(states.features[32]));

    sizeScale.domain([0, max(covidData, d => d[category])])
        .nice(); // round off the domain to a close zero figure

    g.selectAll(".state")
        .attr("fill", "white")
        .transition().duration(750)
        .attr("stroke", colorScale(category))
        .select("title")
        .text((d, i) => d.id + ": " + covidData[i][category]);
        // .text((d, i) => d.id + ": " + covidData[i][category]);
    // add tooltip here

    // zoom to specific state
    g.selectAll(".state")
        .on("click", (d, i) => {
            d3.event.stopPropagation();
            // simulating user clicking the dropdown
            document.querySelector(".select-selected").click();
            document.querySelectorAll(".select-items div")
                .item(i+1).click();
        });
        
    const stateCircles = g.selectAll(".state-circle").data(states.features);

    
    const enteringCircles = stateCircles
    .enter().append("circle");
    
    // title element is appended to the entering element once
    // after that each time enter selection taken will be empty
    // so it won't be appened again
    // console.log(stateCircles);
    enteringCircles.append("title");

    enteringCircles
        .merge(stateCircles) // create a union of enter and update selection
        // from this point onward these attributes will apply to both the selection
        .attr("class", "state-circle")
        .attr("cx", d => d.properties.centroid[0])
        .attr("cy", d => d.properties.centroid[1])
        .transition().duration(750)
        .attr("r", (d, i) => sizeScale(covidData[i][category]))
        .attr("fill", colorScale(category))
        .attr("stroke", colorScale(category))
        .select("title")
        .text((d, i) => d.id + ": " + covidData[i][category])

    enteringCircles
        .merge(stateCircles)
        // same effect of zooming to state
        .on("click", (d, i) => {
            d3.event.stopPropagation();
            // simulating user clicking dropdown
            document.querySelector(".select-selected").click();
            document.querySelectorAll(".select-items div")
                .item(i+1).click();
        });

    sizeLegend(g,
        {
            sizeScale,
            width: width,
            height: height,
            textOffset: 10,
            numTicks: 4,
            circleFill: colorScale(category)
        });

    // if any focus state exists change its fill
    if (stateOnFocus !== -1)
        d3.select(d3.selectAll(".state")._groups[0][stateOnFocus])
            .transition().duration(750).attr("fill", colorScale(category));
}

/*
 * as a side note in newer version of d3
 * the event object should be taken from function argument
 * e.g., (event, data) => { ...code }
 */

// reset function
const reset = () => {
    d3.event.stopPropagation();
    svg.transition().duration(750).call(myZoom.transform, d3.zoomIdentity);
    
    let category = document.querySelector("#category").value;

    d3.selectAll(".state")
        .transition().duration(750)
        .attr("stroke", colorScale(category))
        .attr("fill", "white")
        .attr("opacity", 1);

    stateOnFocus = -1;
}

const zoomToState = (d, i) => {
    // d is state feature object
    d3.event.stopPropagation();
    // get the coordinates (top left, bottom right) for bounding box
    const [[x0, y0], [x1, y1]] = pathGenerator.bounds(d);
    svg.transition().duration(750).call(myZoom.transform, 
        d3.zoomIdentity
        .translate(width/2, height/2)
        .scale(Math.min(8, 0.95/Math.max((x1-x0)/width, (y1-y0)/height))) // restricting zoom scale to 8, if other goes beyond 8, e.g., chandigardh
        .translate(-(x0+x1)/2, -(y0+y1)/2)
        );
    
    let category = document.querySelector("#category").value;

    d3.selectAll(".state")
        .transition().duration(750)
        .attr("fill", "white")
        .attr("stroke", colorScale(category))
        .attr("opacity", 1);

    d3.select(d3.selectAll(".state")._groups[0][i])
        .transition().duration(750)
        .attr("fill", colorScale(category))
        .attr("opacity", "0.2");
    stateOnFocus = i;
}