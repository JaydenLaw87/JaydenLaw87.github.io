function _chart(d3,width,height,chord,data,color,names,arc,formatValue,ticks,outerRadius,ribbon)
{
  const svg = d3.create("svg")
  .attr("viewBox", ["-1050 -1000 2000 2000"])
  .attr("min-width", 320)
  .attr("min-height", 400);

  const chords = chord(data);

  const group = svg.append("g")
      .attr("font-size", 40)
      .attr("font-family", "sans-serif")
    .selectAll("g")
    .data(chords.groups)
    .join("g");

  group.append("path")
      .attr("fill", d => color(names[d.index]))
      .attr("d", arc);

  group.append("title")
      .text(d => `${names[d.index]}
${formatValue(d.value)}`);

  const groupTick = group.append("g")
    .selectAll("g")
    .data(ticks)
    .join("g")
      .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);

  groupTick.append("line")
      .attr("stroke", "currentColor")
      .attr("x2", 6);

  groupTick.append("text")
      .attr("x", 8)
      .attr("dy", "0.35em")
      .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .text(d => formatValue(d.value));

  group.select("text")
      .attr("font-weight", "bold")
      .text(function(d) {
        return this.getAttribute("text-anchor") === "end"
            ? `↑ ${names[d.index]}`
            : `${names[d.index]} ↓`;
      });

  svg.append("g")
      .attr("fill-opacity", 0.8)
    .selectAll("path")
    .data(chords)
    .join("path")
      .style("mix-blend-mode", "multiply")
      .style("stroke", "black")
      .style("stroke-width", "3px")
      .attr("fill", d => color(names[d.source.index]))
      .attr("d", ribbon)
    .append("title")
      .text(d => `${formatValue(d.source.value)} ${names[d.target.index]} → ${names[d.source.index]}${d.source.index === d.target.index ? "" : `\n${formatValue(d.target.value)} ${names[d.source.index]} → ${names[d.target.index]}`}`);

  return svg.node();
}

function _data(){return(
Object.assign([[null, 7.0, 19.0, 1.0, 1.0, 6.0],
   [3.0, null, 67.0, 20.0, 3.0, 91.0],
    [3.0, 71.0, null, 13.0, 12.0, 285.0],
    [1.0, 17.0, 29.0, null, 2.0, 36.0],
    [2.0, 5.0, 24.0, 1.0, null, 27.0],
    [2.0, 43.0, 123.0, 7.0, 15.0, null]]
  , {
  names: ['.     Africa     .',	'.     Asia-Pacific     .',	'.     Europe     .',	'.     Latin America and Caribbean     .',	'.     Middle East     .',	'.     USA and Canada     .'],
  colors: ["#c4c4c4", "#69b40f", "#c8125c", "#ec1d25", "#008fc8", "#10218b"]
})
)}

function _names(data,d3){return(
data.names === undefined ? d3.range(data.length) : data.names
)}

function _colors(data,d3,names){return(
data.colors === undefined ? d3.quantize(d3.interpolateRainbow, names.length) : data.colors
)}

function _ticks(d3,tickStep){return(
function ticks({startAngle, endAngle, value}) {
  const k = (endAngle - startAngle) / value;
  return d3.range(0, value, tickStep).map(value => {
    return {value, angle: value * k + startAngle};
  });
}
)}

function _tickStep(d3,data){return(
d3.tickStep(0, d3.sum(data.flat()), 20)
)}

function _formatValue(d3){return(
d3.format("1~")
)}

function _chord(d3,innerRadius){return(
d3.chord()
    .padAngle(10 / innerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending)
)}

function _arc(d3,innerRadius,outerRadius){return(
d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
)}

function _ribbon(d3,innerRadius){return(
d3.ribbon()
    .radius(innerRadius - 1)
    .padAngle(1 / innerRadius)
)}

function _color(d3,names,colors){return(
d3.scaleOrdinal(names, colors)
)}

function _outerRadius(width,height){return(
Math.min(width, height) * 0.5 - 60
)}

function _innerRadius(outerRadius){return(
outerRadius - 10
)}

function _height(width){return(
width
)}

function _d3(require){return(
require("d3@6")
)}

export default function define2(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("chart")).define("chart", ["d3","width","height","chord","data","color","names","arc","formatValue","ticks","outerRadius","ribbon"], _chart);  main.variable(observer("data")).define("data", _data);
  main.variable(observer("names")).define("names", ["data","d3"], _names);
  main.variable(observer("colors")).define("colors", ["data","d3","names"], _colors);
  main.variable(observer("ticks")).define("ticks", ["d3","tickStep"], _ticks);
  main.variable(observer("tickStep")).define("tickStep", ["d3","data"], _tickStep);
  main.variable(observer("formatValue")).define("formatValue", ["d3"], _formatValue);
  main.variable(observer("chord")).define("chord", ["d3","innerRadius"], _chord);
  main.variable(observer("arc")).define("arc", ["d3","innerRadius","outerRadius"], _arc);
  main.variable(observer("ribbon")).define("ribbon", ["d3","innerRadius"], _ribbon);
  main.variable(observer("color")).define("color", ["d3","names","colors"], _color);
  main.variable(observer("outerRadius")).define("outerRadius", ["width","height"], _outerRadius);
  main.variable(observer("innerRadius")).define("innerRadius", ["outerRadius"], _innerRadius);
  main.variable(observer("height")).define("height", ["width"], _height);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
