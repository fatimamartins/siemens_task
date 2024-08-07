import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

const LineChart = ({ values, isYAxisLinear, dimensions }) => {
    const svgRef = useRef()

    useEffect(() => {
        const svg = d3.select(svgRef.current)
        const width = svgRef.current.clientWidth
        const height = svgRef.current.clientHeight
        const margin = { top: 15, right: 15, bottom: 40, left: 40 }

        //Points at X axis should be aligned according to the time
        const xScale = d3
            .scaleTime()
            //returns an array [min, max] where min is the smallest value and max is the largest value for d.timestamp across all data points
            .domain(d3.extent(values, (d) => d.timestamp.getTime()))
            //maps the date range to the width of the SVG element, effectively converting date values into pixel positions on the x-axis
            .range([margin.left, width - margin.right])

        const yScale = (
            isYAxisLinear
                ? d3
                      .scaleLinear()
                      .domain([
                          d3.min(values, (d) => d.value) - 1,
                          d3.max(values, (d) => d.value) + 1,
                      ])
                : d3
                      .scaleLog()
                      .base(10) // Base for the logarithm
                      .domain([
                          Math.max(
                              1,
                              d3.min(values, (d) => d.value)
                          ),
                          d3.max(values, (d) => d.value),
                      ])
        ).range([height - margin.bottom, margin.top])

        //generate line
        const line = d3
            .line()
            .x((d) => xScale(d.timestamp.getTime()))
            .y((d) => yScale(d.value))

        svg.selectAll('*').remove() // Clear existing content

        //draw line
        svg.append('path')
            .datum(values)
            .attr('fill', 'none')
            .attr('stroke', 'rgb(78,119,255)')
            .attr('stroke-width', 2)
            .attr('d', line)

        // Create time formatter
        const formatTime = d3.timeFormat('%M:%S:%L')

        //draw x-axis
        svg.append('g')
            .call(d3.axisBottom(xScale).tickFormat(formatTime))
            .attr('transform', `translate(0 , ${height - margin.bottom})`)
            .selectAll('text')
            .style('font-size', '9px')

        //add x-axis label
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - margin.bottom / 2 + 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '9px')
            .text('Timestamp')

        //draw y-axis
        svg.append('g')
            .call(d3.axisLeft(yScale))
            .attr('transform', `translate(${margin.left}, 0)`)
            .selectAll('text')
            .style('font-size', '9px')

        //add y-axis label
        svg.append('text')
            .attr('x', -height / 2)
            .attr('y', margin.left / 4)
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .style('font-size', '9px')
            .text('Value')

        //add data point labels
        svg.selectAll('.data-label')
            .data(values)
            .enter()
            .append('text')
            .attr('x', (d) => xScale(d.timestamp) + 5)
            .attr('y', (d) => yScale(d.value) - 2)
            .attr('class', 'data-label')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text((d) => d.value)
    }, [values, isYAxisLinear, dimensions])

    return (
        <div className="chart-area">
            <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
        </div>
    )
}

export default LineChart
