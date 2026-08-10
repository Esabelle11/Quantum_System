
// frontend/components/charts/VolumeChart.tsx

"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  ColorType,
  createChart,
  HistogramSeries,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";

import type {
  Kline,
} from "@/types/market";

import {
  cn,
} from "@/lib/utils";

interface VolumeChartProps {
  data: Kline[];

  height?: number;

  className?: string;
}

export default function VolumeChart({
  data,
  height = 180,
  className,
}: VolumeChartProps) {
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

        rightPriceScale: {
          borderColor: "#1e293b",
        },

        timeScale: {
          borderColor: "#1e293b",

          timeVisible: true,

          secondsVisible: false,
        },

        handleScroll: true,

        handleScale: true,
      }
    );

    chartRef.current = chart;

    const series =
      chart.addSeries(
        HistogramSeries,
        {
          priceFormat: {
            type: "volume",
          },

          priceScaleId: "",

          color: "#64748b",
        }
      );

    chart.priceScale("")
      .applyOptions({
        scaleMargins: {
          top: 0.1,

          bottom: 0,
        },
      });

    const volumeData = data
      .map((candle) => {
        const bullish =
          candle.close >=
          candle.open;

        return {
          time: Math.floor(
            candle.timestamp / 1000
          ) as UTCTimestamp,

          value: candle.volume,

          color: bullish
            ? "rgba(34, 197, 94, 0.55)"
            : "rgba(239, 68, 68, 0.55)",
        };
      })
      .sort(
        (a, b) =>
          Number(a.time) -
          Number(b.time)
      );

    series.setData(
      volumeData
    );

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

