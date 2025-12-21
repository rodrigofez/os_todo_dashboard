import {
    Axis,
    BarSeries,
    Chart,
    Position,
    ScaleType,
    Settings,
} from "@elastic/charts";
import { euiPaletteColorBlind } from "@elastic/eui";
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

    // Generate color palette
    const colors = useMemo(() => euiPaletteColorBlind({
        rotations: 3,
        order: "group",
        direction: "both",
    }), []);

    // Create a color map for each unique x value
    const colorMap = useMemo(() => {
        const map: Record<string, string> = {};
        data.forEach((d, index) => {
            // Use provided color or palette color
            map[d.x] = d.color || colors[index % colors.length];
        });
        return map;
    }, [data, colors]);

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
                // Use color from map
                color={(key) => colorMap[key.key as string]}
            />
        </Chart>
    );
};
