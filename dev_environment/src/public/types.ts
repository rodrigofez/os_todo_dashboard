import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface CustomPluginPluginSetup { }
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomPluginPluginStart { }

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
