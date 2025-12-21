import {
    Axis,
    BarSeries,
    Chart,
    Position,
    ScaleType,
    Settings,
} from "@elastic/charts";
import React, { useMemo } from "react";

export interface BarChartData {
    x: string;
    y: number;
    color?: string;
}

export interface BarChartProps {
    data: BarChartData[];
    xAxisTitle?: string;
    yAxisTitle?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
    data,
    xAxisTitle = "Category",
    yAxisTitle = "Value",
}) => {

    // Create a generic color map from the data if colors are provided
    const colorMap = useMemo(() => {
        const map: Record<string, string> = {};
        data.forEach((d) => {
            if (d.color) map[d.x] = d.color;
        });
        return map;
    }, [data]);

    return (
        <Chart size={{ height: 300 }}>
            <Settings showLegend={false} />

            {/* X axis */}
            <Axis
                id="bottom"
                position={Position.Bottom}
                title={xAxisTitle}
                showOverlappingTicks
            />

            {/* Y axis */}
            <Axis
                id="left"
                position={Position.Left}
                title={yAxisTitle}
                tickFormat={(d: any) => Number(d).toFixed(0)}
            />

            <BarSeries
                id="bar-series"
                name={yAxisTitle}
                xScaleType={ScaleType.Ordinal}
                yScaleType={ScaleType.Linear}
                xAccessor="x"
                yAccessors={["y"]}
                data={data}
                // Use color from data map or fallback default
                color={(key) => colorMap[key.key as string] || "#3498db"}
            />
        </Chart>
    );
};
