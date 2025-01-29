'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface PriceData {
  date: string;
  price: number;
}

interface DataPoint extends PriceData {
  type: 'historical' | 'prediction';
}

interface PriceChartProps {
  historicalData: PriceData[];
  predictions: PriceData[];
}

interface LegendItem {
  color: string;
  text: string;
}

function createSVGElement(type: string): SVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', type);
}

export function PriceChart({ historicalData, predictions }: PriceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Set SVG attributes
    svg.setAttribute('width', (width + margin.left + margin.right).toString());
    svg.setAttribute('height', (height + margin.top + margin.bottom).toString());

    // Create a group for the chart content
    const g = createSVGElement('g') as SVGGElement;
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);

    // Combine data
    const allData: DataPoint[] = [
      ...historicalData.map((d: PriceData): DataPoint => ({ ...d, type: 'historical' })),
      ...predictions.map((d: PriceData): DataPoint => ({ ...d, type: 'prediction' })),
    ];

    // Calculate scales manually
    const dates = allData.map(d => new Date(d.date).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const prices = allData.map(d => d.price);
    const maxPrice = Math.max(...prices, 0);
    const minPrice = Math.min(...prices, 0);

    // Scale functions
    const xScale = (date: number) => {
      return ((date - minDate) / (maxDate - minDate)) * width;
    };

    const yScale = (price: number) => {
      return height - ((price - minPrice) / (maxPrice - minPrice)) * height;
    };

    // Create line paths
    function createLinePath(data: DataPoint[]): string {
      return data
        .map((d, i) => {
          const x = xScale(new Date(d.date).getTime());
          const y = yScale(d.price);
          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');
    }

    // Add historical line
    const historicalPath = createSVGElement('path') as SVGPathElement;
    historicalPath.setAttribute('d', createLinePath(historicalData.map(d => ({ ...d, type: 'historical' }))));
    historicalPath.setAttribute('fill', 'none');
    historicalPath.setAttribute('stroke', '#2563eb');
    historicalPath.setAttribute('stroke-width', '2');
    g.appendChild(historicalPath);

    // Add prediction line
    const predictionPath = createSVGElement('path') as SVGPathElement;
    predictionPath.setAttribute('d', createLinePath(predictions.map(d => ({ ...d, type: 'prediction' }))));
    predictionPath.setAttribute('fill', 'none');
    predictionPath.setAttribute('stroke', '#dc2626');
    predictionPath.setAttribute('stroke-width', '2');
    predictionPath.setAttribute('stroke-dasharray', '5,5');
    g.appendChild(predictionPath);

    // Add X-axis
    const xAxis = createSVGElement('g') as SVGGElement;
    xAxis.setAttribute('transform', `translate(0,${height})`);
    
    // Add X-axis line
    const xAxisLine = createSVGElement('line') as SVGLineElement;
    xAxisLine.setAttribute('x1', '0');
    xAxisLine.setAttribute('x2', width.toString());
    xAxisLine.setAttribute('stroke', '#888');
    xAxis.appendChild(xAxisLine);

    // Add X-axis ticks
    const xTickCount = 6;
    for (let i = 0; i <= xTickCount; i++) {
      const tickValue = new Date(minDate + (i / xTickCount) * (maxDate - minDate));
      const x = xScale(tickValue.getTime());
      
      const tick = createSVGElement('line') as SVGLineElement;
      tick.setAttribute('x1', x.toString());
      tick.setAttribute('x2', x.toString());
      tick.setAttribute('y1', '0');
      tick.setAttribute('y2', '6');
      tick.setAttribute('stroke', '#888');
      xAxis.appendChild(tick);

      const label = createSVGElement('text') as SVGTextElement;
      label.setAttribute('x', x.toString());
      label.setAttribute('y', '20');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '10');
      label.textContent = tickValue.toLocaleDateString();
      xAxis.appendChild(label);
    }
    g.appendChild(xAxis);

    // Add Y-axis
    const yAxis = createSVGElement('g') as SVGGElement;
    
    // Add Y-axis line
    const yAxisLine = createSVGElement('line') as SVGLineElement;
    yAxisLine.setAttribute('y1', '0');
    yAxisLine.setAttribute('y2', height.toString());
    yAxisLine.setAttribute('stroke', '#888');
    yAxis.appendChild(yAxisLine);

    // Add Y-axis ticks
    const yTickCount = 5;
    for (let i = 0; i <= yTickCount; i++) {
      const tickValue = minPrice + (i / yTickCount) * (maxPrice - minPrice);
      const y = yScale(tickValue);
      
      const tick = createSVGElement('line') as SVGLineElement;
      tick.setAttribute('x1', '-6');
      tick.setAttribute('x2', '0');
      tick.setAttribute('y1', y.toString());
      tick.setAttribute('y2', y.toString());
      tick.setAttribute('stroke', '#888');
      yAxis.appendChild(tick);

      const label = createSVGElement('text') as SVGTextElement;
      label.setAttribute('x', '-10');
      label.setAttribute('y', y.toString());
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('font-size', '10');
      label.textContent = tickValue.toLocaleString(undefined, { maximumFractionDigits: 0 });
      yAxis.appendChild(label);
    }
    g.appendChild(yAxis);

    // Add legend
    const legend = createSVGElement('g') as SVGGElement;
    legend.setAttribute('font-family', 'sans-serif');
    legend.setAttribute('font-size', '10');
    legend.setAttribute('text-anchor', 'start');
    legend.setAttribute('transform', `translate(${width - 100},0)`);
    g.appendChild(legend);

    const legendItems: LegendItem[] = [
      { color: '#2563eb', text: 'Historical' },
      { color: '#dc2626', text: 'Predicted' },
    ];

    legendItems.forEach((item, i) => {
      const itemG = createSVGElement('g') as SVGGElement;
      itemG.setAttribute('transform', `translate(0,${i * 20})`);

      const rect = createSVGElement('rect') as SVGRectElement;
      rect.setAttribute('x', '0');
      rect.setAttribute('width', '19');
      rect.setAttribute('height', '19');
      rect.setAttribute('fill', item.color);
      itemG.appendChild(rect);

      const text = createSVGElement('text') as SVGTextElement;
      text.setAttribute('x', '24');
      text.setAttribute('y', '9.5');
      text.setAttribute('dy', '0.32em');
      text.textContent = item.text;
      itemG.appendChild(text);

      legend.appendChild(itemG);
    });

  }, [historicalData, predictions]);

  return (
    <Card className="p-4">
      <svg ref={svgRef}></svg>
    </Card>
  );
}
