const sizeLegend = (selection, props) => {
    const {
        sizeScale,
        width,
        height,
        textOffset,
        numTicks, 
        circleFill
    } = props;

    let spacing = 50;
    let xOffset = width/15;
    let yOffset = height/2;
    if (screen.width < 600) {
        spacing /= 2;
        xOffset /= 2;
        yOffset /= 2;
    } else if (screen.width < 300) {
        spacing /= 5;
        xOffset /= 5;
        yOffset /= 5;
    }

    const ticks = sizeScale.ticks(numTicks)
        .filter(d => d!=0).reverse();

    const groups = selection.selectAll("g")
        .data(ticks);

    const groupsEnter = groups
        .enter().append("g")
        .attr("class", "tick");

    groupsEnter.merge(groups)
    .attr("transform", (d, i) => 
        `translate(${xOffset}, ${yOffset + i*spacing})`
        );

    groups.exit().remove();

    /* This is an example of nesting data joins. Nested
    DOM elements inherit the type of selection (enter, update,
    exit) from their parent elements */
    groupsEnter.append("circle") // this circle selection is enter selection, since groupsEnter is an enter selection
        .merge(groups.select("circle")) // this circle selection is update selection, since groups is an update selection
        .attr("class", "legend-circle")
        .transition().duration(750)
        .attr("r", sizeScale)
        .attr("fill", circleFill)
        .attr("stroke", circleFill);

    groupsEnter.append("text"); // add text elements to the entering elements

    groupsEnter.merge(groups)
        .select("text") // modify the text elements of entering as well as update elements
        .text(tickFormatter) // the corresponding array element in groupsEnter
        .attr("class", "legend-text")
        .attr("dy", "0.32em") // magical number to center legend text
        .attr("x", d => sizeScale(d) + textOffset); // offset by radius + const offset
}

const tickFormatter = (str) => {
    formatted = "";
    if (str == undefined) return 0;
    str = str.toString();
      negative = true;
    // data[StateCode].delta.confirmed.toString();
    // str2 = data[StateCode].total.deceased.toString()
    // str3 = data[StateCode].total.recovered.toString()
    // str4 = data[StateCode].total.tested.toString()
    // str5 = data[StateCode].total.vaccinated2.toString()
  
    len = str.length;
    if (len > 7)
      formatted =
        str.substring(0, len - 7) + "." + str.substring(len - 7, len - 6) + "Cr";
    else if (len > 5)
      formatted =
        str.substring(0, len - 5) + "." + str.substring(len - 5, len - 4) + "L";
    else if (len > 3)
      formatted =
        str.substring(0, len - 3) + "." + str.substring(len - 3, len - 2) + "K";
    else formatted = str;
  
    return formatted;
}