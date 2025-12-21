import {
    Axis,
    Chart,
    CurveType,
    LineSeries,
    Position,
    ScaleType,
    Settings,
} from "@elastic/charts";
import React from "react";
import { LineChartProps } from "./types";

const dateFormatter = (time: number) =>
    new Date(time).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

export const LineChart: React.FC<LineChartProps> = ({ series }) => {
    return (
        <Chart size={{ height: 300 }}>
            <Settings showLegend legendPosition={Position.Right} />
            <Axis
                id="bottom-axis"
                position={Position.Bottom}
                showOverlappingTicks
                tickFormat={dateFormatter}
                title="Date"
            />
            <Axis id="left-axis" position={Position.Left} title="Tasks" />
            {series.map((s) => (
                <LineSeries
                    key={s.id}
                    id={s.id}
                    xScaleType={ScaleType.Time}
                    yScaleType={ScaleType.Linear}
                    xAccessor={0}
                    yAccessors={[1]}
                    data={s.data}
                    curve={CurveType.LINEAR}
                />
            ))}
        </Chart>
    );
};
