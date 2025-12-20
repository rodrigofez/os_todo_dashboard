import {
  CoreSetup,
  CoreStart,
  Logger,
  Plugin,
  PluginInitializerContext,
} from "../../../src/core/server";

import { registerTodoRoutes } from "./routes/todo.routes";
import { CustomPluginPluginSetup, CustomPluginPluginStart } from "./types";


export class CustomPluginPlugin
  implements Plugin<CustomPluginPluginSetup, CustomPluginPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug("custom_plugin: Setup");
    const router = core.http.createRouter();
    registerTodoRoutes(router, this.logger);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug("custom_plugin: Started");
    return {};
  }

  public stop() { }
}
