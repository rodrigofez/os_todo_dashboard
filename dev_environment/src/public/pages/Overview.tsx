import React from "react";

import {
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPageContent,
  EuiPageContentBody,
  EuiProgress,
  EuiSpacer,
  EuiText,
  EuiTitle
} from "@elastic/eui";
import { Table } from "../components/TodosTable";
import { useOverviewMetrics } from "../hooks/useOverviewMetrics";

export const Overview = () => {

  const { data: overviewData, isLoading } = useOverviewMetrics()

  const completionRate = Math.ceil(((overviewData?.completed ?? 0) / (overviewData?.total ?? 0)) * 100);

  return (
    <>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiCard
            textAlign="left"
            title="Successfully Executed"
            description={
              <>
                <EuiTitle>
                  <h3>{completionRate}%</h3>
                </EuiTitle>
                <EuiSpacer size="s" />
                <EuiProgress value={completionRate} max={100} />
                <EuiSpacer size="xs" />
                <EuiFlexGroup responsive={false}>
                  <EuiFlexItem>{overviewData?.completed} completed</EuiFlexItem>
                  <EuiFlexItem grow={false}>{overviewData?.total} total</EuiFlexItem>
                </EuiFlexGroup>
              </>
            }
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiCard
            textAlign="left"
            title="Needs Attention"
            description={
              <>
                <EuiFlexGroup justifyContent="spaceBetween" responsive={false}>
                  <EuiFlexItem>
                    <EuiFlexGroup
                      alignItems="center"
                      gutterSize="xs"
                      responsive={false}
                    >
                      <EuiFlexItem grow={false}>
                        <EuiIcon type="calendar" color="red" />
                      </EuiFlexItem>
                      <EuiFlexItem grow>
                        <EuiText>
                          <h4>Overdue</h4>
                        </EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>{overviewData?.overdue}</EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer size="s" />
                <EuiFlexGroup justifyContent="spaceBetween" responsive={false}>
                  <EuiFlexItem>
                    <EuiFlexGroup
                      alignItems="center"
                      gutterSize="xs"
                      responsive={false}
                    >
                      <EuiFlexItem grow={false}>
                        <EuiIcon type="clock" color="orange" />
                      </EuiFlexItem>
                      <EuiFlexItem grow>
                        <EuiText>
                          <h4>Due soon</h4>
                        </EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>{overviewData?.due_soon}</EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer size="s" />
                <EuiFlexGroup justifyContent="spaceBetween" responsive={false}>
                  <EuiFlexItem>
                    <EuiFlexGroup
                      alignItems="center"
                      gutterSize="xs"
                      responsive={false}
                    >
                      <EuiFlexItem grow={false}>
                        <EuiIcon type="alert" color="danger" />
                      </EuiFlexItem>
                      <EuiFlexItem grow>
                        <EuiText>
                          <h4>Errors</h4>
                        </EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>{overviewData?.errors}</EuiFlexItem>
                </EuiFlexGroup>
              </>
            }
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="l" />
      <EuiPageContent>
        <EuiPageContentBody>
          <Table />
        </EuiPageContentBody>
      </EuiPageContent>
    </>
  );
};
