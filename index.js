import { select, json } from 'd3';

//let educationURL =
//  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

//let countiesURL =
//  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

d3.json('counties.json').then((countiesData) => {
  d3.json(
    'education.json'
  ).then((educationData) =>
    chartme(countiesData, educationData)
  );
});

const chartme = (cd, ed) => {

  //convert topojson to geojson
  let shapes = topojson.feature(
    cd,
    cd.objects.counties
  ).features;

  // set the dimensions and margins of the graph
  let width = 960,
    height = 500;

  // append the svg object to the body of the page
  let svg = d3
    .select('#choropleth')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 900 700');

  //console.log(countyData, ed)

  // create a tooltip
  let tooltip = d3
    .select("#choropleth")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  // Three function that change the tooltip when user hover / move / leave a cell
  let mouseover = function (e, d) {
    tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("opacity", 1);
  };
  let mousemove = function (countyid) {
    let county = ed.find((v, i) => countyid == ed[i].fips)
    tooltip
      .html(county.area_name + ", " + 
           	county.state + ": " +
           	county.bachelorsOrHigher + "%")
      .attr("data-education", county.bachelorsOrHigher)
      .style("top", event.pageY - 10 + "px")
      .style("left", event.pageX + 10 + "px");
  };
  let mouseleave = function (e, d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };
  
  
  svg
    .selectAll('path')
    .data(shapes)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (county) => {
      let num = ed.find(
        (d, i) => county.id == ed[i].fips
      );
      let base = 45 / 4;
      if (num.bachelorsOrHigher < base) return '#2F4858';
      if (num.bachelorsOrHigher < base * 2) return '#86BBD8';
      if (num.bachelorsOrHigher < base * 3) return '#F6AE2D';
      return '#F26419';
    })
  	.attr('data-fips', (county) => county.id)
  	.attr('data-education', (county) => ed.find((d, i) => county.id == ed[i].fips).bachelorsOrHigher)
    .on("mouseover", mouseover)
    .on("mousemove", (county) => mousemove(county.id))
    .on("mouseleave", mouseleave);
};

/* 
This line uses D3 to set the text of the message div.
select('#message').text(message);
const f = 5;

const reged = /fdass/g;
*/
