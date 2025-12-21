import {
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiPanel,
  EuiSpacer,
  EuiStat,
  EuiTitle
} from "@elastic/eui";
import React from "react";
import { BarChart } from "../components/BarChart/BarChart";
import { LineChart } from "../components/LineChart/LineChart";
import { PieChart } from "../components/PieChart/PieChart";
import { useMetrics } from "../hooks/useMetrics";

export const Metrics: React.FC = () => {
  const { data: metrics, isLoading, isError } = useMetrics();

  if (isLoading) return <EuiFlexGroup justifyContent="center" style={{ minHeight: 300 }}>
    <EuiFlexItem grow={false}>
      <EuiLoadingSpinner size="xl" />
    </EuiFlexItem>
  </EuiFlexGroup>


  if (isError || !metrics) return <EuiEmptyPrompt
    iconType="visBarVertical"
    title={<h3>No metrics available</h3>}
    body={
      <p>
        Try adjusting filters or create new tasks to generate metrics.
      </p>
    }
  />


  return (
    <>
      <EuiPanel>
        <EuiFlexGroup gutterSize="l" responsive={true}>
          <EuiFlexItem>
            <EuiStat title={metrics?.total} description="Total Tasks" />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiStat
              title={metrics?.completed}
              description="Completed"
              titleColor="success"
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiStat title={metrics?.failed} description="Failed" titleColor="danger" />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiStat
              title={`${Math.floor(metrics?.completionRate * 100)}%`}
              description="Completion Rate"
              titleColor="primary"
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
      <EuiSpacer size="xl" />
      <EuiFlexGroup gutterSize="l" wrap responsive={true}>
        <EuiFlexItem grow={1}>
          <EuiPanel>
            <EuiTitle size="xs">
              <h3>Tasks by Status</h3>
            </EuiTitle>
            <EuiSpacer size="s" />
            <PieChart data={metrics?.byStatus.map((val) => ({
              label: val.status, value: val.count
            })) ?? []} />
          </EuiPanel>
        </EuiFlexItem>

        <EuiFlexItem grow={2}>
          <EuiPanel>
            <EuiTitle size="xs">
              <h3>Tasks Over Time</h3>
            </EuiTitle>
            <EuiSpacer size="s" />
            <LineChart
              series={[
                {
                  id: "Created Tasks",
                  data: metrics?.byDate.map((val) => [val.day, val.created]) ?? [],
                },
                {
                  id: "Completed Tasks",
                  data: metrics?.byDate.map((val) => [val.day, val.completed]) ?? [],
                },
              ]}
            />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="l" />
      <EuiFlexGroup gutterSize="l" wrap responsive={true}>
        <EuiFlexItem>
          <EuiPanel>
            <EuiTitle size="xs">
              <h3>Tasks by Priority</h3>
            </EuiTitle>
            <EuiSpacer size="s" />
            <BarChart
              data={
                metrics?.byPriority.map(val => ({ x: val.priority, y: val.count })) ?? []
              }
              xAxisTitle="Priority"
              yAxisTitle="Tasks"
            />
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel>
            <EuiTitle size="xs">
              <h3>Tasks by Framework</h3>
            </EuiTitle>
            <EuiSpacer size="s" />
            <BarChart
              data={
                metrics?.byTag.map(val => ({ x: val.tag, y: val.count })) ?? []
              }
              xAxisTitle="Framework"
              yAxisTitle="Tasks"
            />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

export default Metrics;
