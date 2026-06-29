import { ChartConfig as LegacyChartConfig } from '@/types';
import type { ChartConfig as ShadcnChartConfig } from '@/components/ui/chart';

function sanitizeKey(label: string, index: number): string {
  const normalized = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return normalized || `series_${index}`;
}

export interface RechartsSeriesData {
  label: string;
  [key: string]: string | number;
}

export function chartConfigToRechartsData(config?: LegacyChartConfig | null): {
  data: RechartsSeriesData[];
  keys: string[];
  shadcnConfig: ShadcnChartConfig;
} {
  const labels = Array.isArray(config?.labels) ? config.labels : [];
  const datasets = config?.datasets ?? [];

  if (!config || labels.length === 0 || datasets.length === 0) {
    return { data: [], keys: [], shadcnConfig: {} };
  }

  const keys = datasets.map((dataset, index) => sanitizeKey(dataset.label, index));
  const shadcnConfig = datasets.reduce<ShadcnChartConfig>((acc, dataset, index) => {
    const key = keys[index];
    acc[key] = {
      label: dataset.label,
      color: `var(--chart-${(index % 5) + 1})`,
    };
    return acc;
  }, {});

  const data = labels.map((label, labelIndex) => {
    const point: RechartsSeriesData = { label };
    datasets.forEach((dataset, datasetIndex) => {
      point[keys[datasetIndex]] = dataset.data[labelIndex] ?? 0;
    });
    return point;
  });

  return { data, keys, shadcnConfig };
}
