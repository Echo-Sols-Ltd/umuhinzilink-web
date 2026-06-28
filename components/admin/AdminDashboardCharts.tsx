'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ChartConfig as LegacyChartConfig } from '@/types';
import { chartConfigToRechartsData } from '@/lib/chartConfigToRecharts';
import { formatRwf } from '@/services/adminAnalytics';

function truncateLabel(value: string, max = 10): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

function EmptyChartCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
          <p className="text-sm text-muted-foreground">Trend data will appear here once available</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendChartCard({
  config,
  description,
  variant = 'area',
  valueFormatter,
}: {
  config?: LegacyChartConfig | null;
  description: string;
  variant?: 'area' | 'bar' | 'line';
  valueFormatter?: (value: number) => string;
}) {
  const title = config?.title ?? 'Trend';
  const { data, keys, shadcnConfig } = chartConfigToRechartsData(config);

  if (data.length === 0 || keys.length === 0) {
    return <EmptyChartCard title={title} description={description} />;
  }

  const formatTooltip = (value: number | string) =>
    valueFormatter ? valueFormatter(Number(value)) : Number(value).toLocaleString();

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={shadcnConfig} className="aspect-auto h-[280px] w-full">
          {variant === 'bar' ? (
            <BarChart accessibilityLayer data={data} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => truncateLabel(String(value))}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Intl.NumberFormat('rw-RW', { notation: 'compact' }).format(Number(value))
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={(value) => formatTooltip(value as number)} />}
              />
              {keys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
              {keys.map((key) => (
                <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          ) : variant === 'line' ? (
            <LineChart accessibilityLayer data={data} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => truncateLabel(String(value))}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={(value) => formatTooltip(value as number)} />}
              />
              {keys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
              {keys.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          ) : (
            <AreaChart accessibilityLayer data={data} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => truncateLabel(String(value))}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Intl.NumberFormat('rw-RW', { notation: 'compact' }).format(Number(value))
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={(value) => formatTooltip(value as number)} />}
              />
              {keys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
              {keys.map((key) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  fill={`var(--color-${key})`}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function UserGrowthChart({ config }: { config?: LegacyChartConfig | null }) {
  return (
    <TrendChartCard
      config={config}
      description="Registered users over time"
      variant="line"
    />
  );
}

export function RevenueTrendChart({ config }: { config?: LegacyChartConfig | null }) {
  return (
    <TrendChartCard
      config={config}
      description="Platform revenue over time"
      variant="area"
      valueFormatter={(value) => formatRwf(value)}
    />
  );
}
