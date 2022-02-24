
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

// svg.attr("width", 0.5*screen.width);
// svg.attr("height", 3*0.5*screen.width/4)

const width = svg.attr("width");
const height = svg.attr("height");

console.log(width, height);

const g = svg.append("g");

// the path generator for map
const projection = geoMercator();
const pathGenerator = geoPath().projection(projection);

var states = {};
var covidData = [];

const sizeScale = scaleSqrt().range([0, 40]);

const colorScale = scaleOrdinal()
    .domain(["confirmed", "active", "recovered", "deceased"])
    .range(['#ff073a', '#007bff', '#28a745', '#6c757d']);

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
        accumulator[i].active = accumulator[i].confirmed - accumulator[i].recovered
                - accumulator[i].deceased;
        return accumulator;
    }, []);

    svg.call(zoom().on("zoom", () => {
        if (screen.width > 600)
            g.attr("transform", d3.event.transform);
    }).scaleExtent([1, 10])
    );
    
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
});

const visualize = () => {
    let val = document.querySelector("#category").value;
    fillCircles(states, covidData, val);
};

const fillCircles = (states, covidData, category) => {

    sizeScale.domain([0, max(covidData, d => d[category])])
        .nice(); // round off the domain to a close zero figure

    g.selectAll(".state")
        .attr("stroke", colorScale(category))
        .select("title")
        .text((d, i) => d.id + ": " + covidData[i][category]);
        // .text((d, i) => d.id + ": " + covidData[i][category]);
    // add tooltip here
        
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
        .attr("r", (d, i) => sizeScale(covidData[i][category]))
        .attr("fill", colorScale(category))
        .attr("stroke", colorScale(category))
        .select("title")
        .text((d, i) => d.id + ": " + covidData[i][category]);

    sizeLegend(g,
        {
            sizeScale,
            height: height,
            spacing: 50,
            textOffset: 10,
            numTicks: 4,
            circleFill: colorScale(category)
        });

}