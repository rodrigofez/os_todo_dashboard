import { I18nProvider } from "@osd/i18n/react";
import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { CoreStart } from "../../../../src/core/public";
import { NavigationPublicPluginStart } from "../../../../src/plugins/navigation/public";
import { Overview } from "../pages/Overview";
import { MainLayout } from "../layouts/MainLayout";
import { ApiProvider } from "../context/ApiContext";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "../lib/queryClient";

interface CustomPluginAppDeps {
  basename: string;
  notifications: CoreStart["notifications"];
  http: CoreStart["http"];
  navigation: NavigationPublicPluginStart;
}

export const CustomPluginApp = ({
  basename,
  notifications,
  http,
  navigation,
}: CustomPluginAppDeps) => {
  return (
    <Router basename={basename}>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <ApiProvider http={http}>
            <MainLayout>
              <Route exact path='/' component={Overview} />
              <Route path='/metrics' component={<></>} />
            </MainLayout>
          </ApiProvider>
        </QueryClientProvider>
      </I18nProvider>
    </Router>
  );
};
