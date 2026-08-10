

// frontend/lib/constants.ts

export const APP_NAME ="BTCUSDT Autonomous Quant System";

export const DEFAULT_SYMBOL = "BTCUSDT";

export const DEFAULT_INTERVAL ="1";

export const DEFAULT_KLINE_LIMIT = 500;

export const SUPPORTED_SYMBOLS = ["BTCUSDT"] as const;

export const TIMEFRAMES = [
  {
    label: "1m",
    value: "1"
  },
  {
    label: "5m",
    value: "5"
  },
  {
    label: "15m",
    value: "15"
  },
  {
    label: "30m",
    value: "30"
  },
  {
    label: "1h",
    value: "60"
  },
  {
    label: "4h",
    value: "240"
  },
  {
    label: "1D",
    value: "D"
  }
] as const;

export const FEATURE_GROUPS = [
  {
    key: "price",
    label: "Price"
  },
  {
    key: "volatility",
    label: "Volatility"
  },
  {
    key: "funding",
    label: "Funding"
  },
  {
    key: "oi",
    label: "Open Interest"
  },
  {
    key: "liquidation",
    label: "Liquidation"
  }
] as const;

export const NAVIGATION = [
  {
    label: "Dashboard",
    href: "/dashboard"
  },
  {
    label: "Market",
    href: "/market"
  },
  {
    label: "Research",
    href: "/research"
  },
  {
    label: "Backtest",
    href: "/backtest"
  },
  {
    label: "Strategy",
    href: "/strategy"
  },
  {
    label: "Trading",
    href: "/trading"
  }
] as const;



// // frontend/lib/constants.ts

// export const APP_NAME = "Quant System";

// export const DEFAULT_SYMBOL = "BTCUSDT";

// export const DEFAULT_INTERVAL = "1";

// export const DEFAULT_KLINE_LIMIT = 500;

// export const SUPPORTED_SYMBOLS = [
//   "BTCUSDT",
//   "ETHUSDT",
//   "SOLUSDT"
// ] as const;

// export const TIMEFRAMES = [
//   {
//     label: "1m",
//     value: "1"
//   },
//   {
//     label: "5m",
//     value: "5"
//   },
//   {
//     label: "15m",
//     value: "15"
//   },
//   {
//     label: "30m",
//     value: "30"
//   },
//   {
//     label: "1h",
//     value: "60"
//   },
//   {
//     label: "4h",
//     value: "240"
//   },
//   {
//     label: "1D",
//     value: "D"
//   }
// ] as const;

// export const FEATURE_GROUPS = [
//   {
//     key: "price",
//     label: "Price"
//   },
//   {
//     key: "volatility",
//     label: "Volatility"
//   },
//   {
//     key: "funding",
//     label: "Funding"
//   },
//   {
//     key: "oi",
//     label: "Open Interest"
//   },
//   {
//     key: "liquidation",
//     label: "Liquidation"
//   }
// ] as const;

// export const NAVIGATION = [
//   {
//     label: "Dashboard",
//     href: "/dashboard"
//   },
//   {
//     label: "Market",
//     href: "/market"
//   },
//   {
//     label: "Research",
//     href: "/research"
//   },
//   {
//     label: "Backtest",
//     href: "/backtest"
//   },
//   {
//     label: "Strategy",
//     href: "/strategy"
//   },
//   {
//     label: "Trading",
//     href: "/trading"
//   }
// ] as const;

