
// frontend/components/charts/CandlestickChart.tsx

"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  CandlestickSeries,
  ColorType,
  createChart,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";

import type {
  Kline,
} from "@/types/market";

import {
  cn,
} from "@/lib/utils";

interface CandlestickChartProps {
  data: Kline[];

  height?: number;

  className?: string;

  upColor?: string;

  downColor?: string;
}

export default function CandlestickChart({
  data,
  height = 420,
  className,
  upColor = "#22c55e",
  downColor = "#ef4444",
}: CandlestickChartProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const chartRef =
    useRef<IChartApi | null>(
      null
    );

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) {
      return;
    }

    const chart = createChart(
      container,
      {
        width:
          container.clientWidth,

        height,

        layout: {
          background: {
            type: ColorType.Solid,
            color: "#020617",
          },

          textColor: "#94a3b8",
        },

        grid: {
          vertLines: {
            color: "#0f172a",
          },

          horzLines: {
            color: "#0f172a",
          },
        },

        crosshair: {
          vertLine: {
            color: "#475569",
          },

          horzLine: {
            color: "#475569",
          },
        },

        rightPriceScale: {
          borderColor: "#1e293b",
        },

        timeScale: {
          borderColor: "#1e293b",

          timeVisible: true,

          secondsVisible: false,
        },

        handleScroll: {
          mouseWheel: true,

          pressedMouseMove: true,
        },

        handleScale: {
          mouseWheel: true,

          pinch: true,

          axisPressedMouseMove: true,
        },
      }
    );

    chartRef.current = chart;

    const series =
      chart.addSeries(
        CandlestickSeries,
        {
          upColor,

          downColor,

          borderUpColor:
            upColor,

          borderDownColor:
            downColor,

          wickUpColor:
            upColor,

          wickDownColor:
            downColor,
        }
      );

    const chartData = data
      .map((candle) => ({
        time: Math.floor(
          candle.timestamp / 1000
        ) as UTCTimestamp,

        open: candle.open,

        high: candle.high,

        low: candle.low,

        close: candle.close,
      }))
      .sort(
        (a, b) =>
          Number(a.time) -
          Number(b.time)
      );

    series.setData(chartData);

    chart.timeScale().fitContent();

    const resizeObserver =
      new ResizeObserver(
        (entries) => {
          const entry =
            entries[0];

          if (!entry) {
            return;
          }

          chart.resize(
            entry.contentRect.width,
            height
          );
        }
      );

    resizeObserver.observe(
      container
    );

    return () => {
      resizeObserver.disconnect();

      chart.remove();

      chartRef.current = null;
    };
  }, [
    data,
    height,
    upColor,
    downColor,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full overflow-hidden rounded-lg",
        "border border-slate-800",
        "bg-slate-950",
        className
      )}
      style={{
        height,
      }}
    />
  );
}

