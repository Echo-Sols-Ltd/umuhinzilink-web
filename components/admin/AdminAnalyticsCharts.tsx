'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  AdminAnalyticsMonthlyRow,
  AdminAnalyticsTopFarmer,
  AdminAnalyticsTopProduct,
} from '@/types/adminAnalytics';
import { formatRwf } from '@/services/adminAnalytics';

function truncateLabel(value: string, max = 18): string {
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
          <p className="text-sm text-muted-foreground">No data available yet</p>
        </div>
      </CardContent>
    </Card>
  );
}

const revenueChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const ordersChartConfig = {
  orders: {
    label: 'Orders',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const productRevenueChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const sellerRevenueChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

const monthlyOverviewChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-1)',
  },
  orders: {
    label: 'Orders',
    color: 'var(--chart-2)',
  },
  users: {
    label: 'New users',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

function rwfTooltipFormatter(value: number | string) {
  return formatRwf(Number(value));
}

export function RevenueTrendChart({ data }: { data: AdminAnalyticsMonthlyRow[] }) {
  if (data.length === 0) {
    return (
      <EmptyChartCard
        title="Revenue Trend"
        description="Platform revenue over recent months"
      />
    );
  }

  const chartData = data.map((row) => ({
    month: row.month,
    revenue: row.revenue,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Platform revenue over recent months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueChartConfig} className="aspect-auto h-[280px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => truncateLabel(String(value), 8)}
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
              content={
                <ChartTooltipContent
                  formatter={(value) => rwfTooltipFormatter(value as number)}
                />
              }
            />
            <Area
              dataKey="revenue"
              type="monotone"
              fill="var(--color-revenue)"
              fillOpacity={0.35}
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function OrdersTrendChart({ data }: { data: AdminAnalyticsMonthlyRow[] }) {
  if (data.length === 0) {
    return (
      <EmptyChartCard
        title="Orders Trend"
        description="Order volume over recent months"
      />
    );
  }

  const chartData = data.map((row) => ({
    month: row.month,
    orders: row.orders,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Orders Trend</CardTitle>
        <CardDescription>Order volume over recent months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={ordersChartConfig} className="aspect-auto h-[280px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ left: 8, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => truncateLabel(String(value), 8)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function MonthlyOverviewChart({ data }: { data: AdminAnalyticsMonthlyRow[] }) {
  if (data.length === 0) {
    return (
      <EmptyChartCard
        title="Monthly Overview"
        description="Revenue, orders, and new users by month"
      />
    );
  }

  const chartData = data.map((row) => ({
    month: row.month,
    revenue: row.revenue,
    orders: row.orders,
    users: row.users,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Revenue, orders, and new users by month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={monthlyOverviewChartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          <BarChart accessibilityLayer data={chartData} margin={{ left: 8, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => truncateLabel(String(value), 8)}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Intl.NumberFormat('rw-RW', { notation: 'compact' }).format(Number(value))
              }
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) =>
                    name === 'revenue'
                      ? rwfTooltipFormatter(value as number)
                      : Number(value).toLocaleString()
                  }
                />
              }
            />
            <Bar yAxisId="left" dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function TopProductsChart({ products }: { products: AdminAnalyticsTopProduct[] }) {
  if (products.length === 0) {
    return (
      <EmptyChartCard
        title="Top Products"
        description="Best performing products by revenue"
      />
    );
  }

  const chartData = products.slice(0, 8).map((product) => ({
    name: product.name,
    revenue: product.revenue,
    orders: product.orders,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best performing products by revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={productRevenueChartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 4, right: 12, top: 8, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => truncateLabel(String(value))}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => rwfTooltipFormatter(value as number)}
                />
              }
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function TopSellersChart({ sellers }: { sellers: AdminAnalyticsTopFarmer[] }) {
  if (sellers.length === 0) {
    return (
      <EmptyChartCard
        title="Top Sellers"
        description="Best performing sellers by revenue"
      />
    );
  }

  const chartData = sellers.slice(0, 8).map((seller) => ({
    name: seller.name,
    revenue: seller.revenue,
    orders: seller.orders,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Top Sellers</CardTitle>
        <CardDescription>Best performing sellers by revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={sellerRevenueChartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 4, right: 12, top: 8, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => truncateLabel(String(value))}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => rwfTooltipFormatter(value as number)}
                />
              }
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
