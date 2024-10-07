import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../styles/chart.css';

const BarLineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Sample Data and Chart Creation Logic (unchanged)
    const data = [
      { month: 'Jan', barValue: 12, lineValue: 2 },
      { month: 'Feb', barValue: 19, lineValue: 3 },
      { month: 'Mar', barValue: 3, lineValue: 20 },
      { month: 'Apr', barValue: 5, lineValue: 5 },
      { month: 'May', barValue: 2, lineValue: 1 },
    ];

    const svg = d3.select(chartRef.current);
    const width = 700;
    const height = 400;
    const margin = { top: 20, right: 40, bottom: 50, left: 40 };

    svg.selectAll('*').remove();

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScaleBar = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.barValue) + 5])
      .range([height - margin.bottom, margin.top]);

    const yScaleLine = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.lineValue) + 5])
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxisBar = d3.axisLeft(yScaleBar);
    const yAxisLine = d3.axisRight(yScaleLine);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxisBar);

    svg
      .append('g')
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(yAxisLine);

    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.month))
      .attr('y', (d) => yScaleBar(d.barValue))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - margin.bottom - yScaleBar(d.barValue))
      .attr('fill', 'rgba(75, 192, 192, 0.7)')
      .attr('stroke', 'rgba(75, 192, 192, 1)')
      .attr('stroke-width', 2);

    const line = d3
      .line()
      .x((d) => xScale(d.month) + xScale.bandwidth() / 2)
      .y((d) => yScaleLine(d.lineValue))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(data)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 99, 132, 1)')
      .attr('stroke-width', 2);

    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.month) + xScale.bandwidth() / 2)
      .attr('cy', (d) => yScaleLine(d.lineValue))
      .attr('r', 5)
      .attr('fill', 'rgba(255, 99, 132, 1)')
      .attr('stroke', 'rgba(255, 99, 132, 1)')
      .attr('stroke-width', 2);

    svg
      .selectAll('rect')
      .transition()
      .duration(800)
      .attr('height', (d) => height - margin.bottom - yScaleBar(d.barValue))
      .attr('y', (d) => yScaleBar(d.barValue))
      .delay((d, i) => i * 100);

    const totalLength = svg.select('path').node().getTotalLength();

    svg
      .select('path')
      .attr('stroke-dasharray', `${totalLength},${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1000)
      .attr('stroke-dashoffset', 0);
  }, []);

  return (
    <div className="chart-container">
      <svg ref={chartRef} width={700} height={400}></svg>
    </div>
  );
};

export default BarLineChart;
