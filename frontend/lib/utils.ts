
// frontend/lib/utils.ts

import {
  type ClassValue,
  clsx
} from "clsx";

import {
  twMerge
} from "tailwind-merge";


export function cn(
  ...inputs: ClassValue[]
) {
  return twMerge(clsx(inputs));
}

export function formatNumber(
  value: number | null | undefined,
  decimals = 2
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }
  ).format(value);
}

export function formatCurrency(
  value: number | null | undefined,
  decimals = 2
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }
  ).format(value);
}

export function formatPercent(
  value: number | null | undefined,
  decimals = 2
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `${value.toFixed(decimals)}%`;
}

export function formatCompactNumber(
  value: number | null | undefined
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      notation: "compact",
      maximumFractionDigits: 2
    }
  ).format(value);
}

export function formatTimestamp(
  timestamp: number | string | Date
) {
  const date =
    timestamp instanceof Date
      ? timestamp
      : new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(date);
}

export function formatPrice(
  price: number | null | undefined
) {
  if (
    price === null ||
    price === undefined ||
    !Number.isFinite(price)
  ) {
    return "—";
  }

  if (price >= 1000) {
    return price.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );
  }

  if (price >= 1) {
    return price.toFixed(4);
  }

  return price.toFixed(8);
}

export function isPositive(
  value: number | null | undefined
) {
  return (
    value !== null &&
    value !== undefined &&
    value > 0
  );
}

export function isNegative(
  value: number | null | undefined
) {
  return (
    value !== null &&
    value !== undefined &&
    value < 0
  );
}


// If those packages aren't installed:
// npm install clsx tailwind-merge