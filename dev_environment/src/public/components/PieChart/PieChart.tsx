import { Chart, Partition, PrimitiveValue, Settings } from "@elastic/charts";
import { euiPaletteColorBlind } from "@elastic/eui";
import React from "react";
import { PieChartData, PieChartProps } from "./types";

const colors = euiPaletteColorBlind({
    rotations: 3,
    order: "group",
    direction: "both",
});

export const PieChart = ({ data }: PieChartProps) => {
    return (
        <Chart size={{ height: 300 }}>
            <Settings showLegend legendPosition="right" />
            <Partition
                id="pie"
                data={data}
                valueAccessor={(d) => d.value}
                layers={[
                    {
                        groupByRollup: (d: PieChartData) => d.label,
                        shape: {
                            fillColor: (key, sortIndex) => colors[sortIndex],
                        },
                        nodeLabel: (d: PrimitiveValue) => d?.toString() ?? '',
                    },
                ]}
                // Add percentage display inside slices
                config={{
                    fillLabel: {
                        valueFormatter: (d: number) => `${d.toFixed(1)}%`, // show percentage
                    },
                }}
            />
        </Chart>
    );
};
