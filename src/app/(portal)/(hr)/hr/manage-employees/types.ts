export interface ChartData {
  month: string;
  desktop: number;
  mobile: number;
}

export interface ChartConfig {
  label: string;
  color: string;
}

export interface ChartProps {
  config: Record<string, ChartConfig>;
  data: ChartData[];
}

export interface PieChartData {
  browser: string;
  visitors: number;
  fill: string;
}

export interface PieChartConfigItem {
  label: string;
  color?: string;
}

export interface PieChartConfig {
  [key: string]: PieChartConfigItem;
}

export interface PieChartProps {
  data: PieChartData[];
  config: PieChartConfig;
  className?: string;
}
