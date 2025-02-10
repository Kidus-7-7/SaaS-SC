'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import dynamic from 'next/dynamic';

interface PriceData {
  date: string;
  price: number;
}

interface PriceChartProps {
  historicalData: PriceData[];
  predictions: PriceData[];
}

// Client-side only chart component
const ChartContent = ({ historicalData, predictions }: PriceChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const drawChart = () => {
      if (!svgRef.current || !containerRef.current) return;

      const svg = svgRef.current;
      const container = containerRef.current;
      const margin = { top: 20, right: 30, bottom: 30, left: 60 };
      
      const containerWidth = container.clientWidth;
      const containerHeight = Math.min(400, containerWidth * 0.5);
      
      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      // Clear previous content
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
      svg.appendChild(g);

      // Combine data
      const allData = [
        ...historicalData.map((d) => ({ ...d, type: 'historical' })),
        ...predictions.map((d) => ({ ...d, type: 'prediction' })),
      ];

      // Calculate scales manually
      const dates = allData.map((d) => new Date(d.date).getTime());
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);
      const prices = allData.map((d) => d.price);
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
      function createLinePath(data: Array<{ date: string; price: number; type: string }>): string {
        return data
          .map((d: { date: string; price: number }, i: number) => {
            const x = xScale(new Date(d.date).getTime());
            const y = yScale(d.price);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          })
          .join(' ');
      }

      // Add historical line
      const historicalPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      historicalPath.setAttribute('d', createLinePath(historicalData.map((d) => ({ ...d, type: 'historical' }))));
      historicalPath.setAttribute('fill', 'none');
      historicalPath.setAttribute('stroke', '#2563eb');
      historicalPath.setAttribute('stroke-width', '2');
      g.appendChild(historicalPath);

      // Add prediction line
      const predictionPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      predictionPath.setAttribute('d', createLinePath(predictions.map((d) => ({ ...d, type: 'prediction' }))));
      predictionPath.setAttribute('fill', 'none');
      predictionPath.setAttribute('stroke', '#dc2626');
      predictionPath.setAttribute('stroke-width', '2');
      predictionPath.setAttribute('stroke-dasharray', '5,5');
      g.appendChild(predictionPath);

      // Add X-axis
      const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      xAxis.setAttribute('transform', `translate(0,${height})`);
      
      // Add X-axis line
      const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      xAxisLine.setAttribute('x1', '0');
      xAxisLine.setAttribute('x2', width.toString());
      xAxisLine.setAttribute('stroke', '#888');
      xAxis.appendChild(xAxisLine);

      // Add X-axis ticks
      const xTickCount = 6;
      for (let i = 0; i <= xTickCount; i++) {
        const tickValue = new Date(minDate + (i / xTickCount) * (maxDate - minDate));
        const x = xScale(tickValue.getTime());
        
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', x.toString());
        tick.setAttribute('x2', x.toString());
        tick.setAttribute('y1', '0');
        tick.setAttribute('y2', '6');
        tick.setAttribute('stroke', '#888');
        xAxis.appendChild(tick);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x.toString());
        label.setAttribute('y', '20');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '10');
        label.textContent = tickValue.toLocaleDateString();
        xAxis.appendChild(label);
      }
      g.appendChild(xAxis);

      // Add Y-axis
      const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Add Y-axis line
      const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      yAxisLine.setAttribute('y1', '0');
      yAxisLine.setAttribute('y2', height.toString());
      yAxisLine.setAttribute('stroke', '#888');
      yAxis.appendChild(yAxisLine);

      // Add Y-axis ticks
      const yTickCount = 5;
      for (let i = 0; i <= yTickCount; i++) {
        const tickValue = minPrice + (i / yTickCount) * (maxPrice - minPrice);
        const y = yScale(tickValue);
        
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', '-6');
        tick.setAttribute('x2', '0');
        tick.setAttribute('y1', y.toString());
        tick.setAttribute('y2', y.toString());
        tick.setAttribute('stroke', '#888');
        yAxis.appendChild(tick);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
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
      const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      legend.setAttribute('font-family', 'sans-serif');
      legend.setAttribute('font-size', '10');
      legend.setAttribute('text-anchor', 'start');
      legend.setAttribute('transform', `translate(${width - 100},0)`);
      g.appendChild(legend);

      const legendItems = [
        { color: '#2563eb', text: 'Historical' },
        { color: '#dc2626', text: 'Predicted' },
      ];

      legendItems.forEach((item, i) => {
        const itemG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        itemG.setAttribute('transform', `translate(0,${i * 20})`);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '0');
        rect.setAttribute('width', '19');
        rect.setAttribute('height', '19');
        rect.setAttribute('fill', item.color);
        itemG.appendChild(rect);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '24');
        text.setAttribute('y', '9.5');
        text.setAttribute('dy', '0.32em');
        text.textContent = item.text;
        itemG.appendChild(text);

        legend.appendChild(itemG);
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(drawChart);
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [mounted, historicalData, predictions]);

  if (!mounted) {
    return (
      <div className="w-full h-[300px] bg-muted animate-pulse" />
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[300px]">
      <svg 
        ref={svgRef} 
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

// Dynamic import with SSR disabled
const DynamicChart = dynamic(() => Promise.resolve(ChartContent), {
  ssr: false,
});

// Main component wrapper
export function PriceChart(props: PriceChartProps) {
  return (
    <Card className="p-4 w-full">
      <DynamicChart {...props} />
    </Card>
  );
}
