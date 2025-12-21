
export interface LineSeriesData {
    id: string;
    data: [string, number][];
}

export interface LineChartProps {
    series: LineSeriesData[];
}
