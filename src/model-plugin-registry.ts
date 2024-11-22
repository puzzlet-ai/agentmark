import { ModelPlugin } from "./model-plugin";

export class ModelPluginRegistry {
  public static plugins: Map<string, ModelPlugin> = new Map<
    string,
    ModelPlugin
  >();

  public static register(
    modelPlugin: ModelPlugin<any, any>,
    ids: string[]
  ) {
    for (const id of ids) {
      this.plugins.set(id, modelPlugin);
    }
  }

  public static registerAll(
    pluginEntries: { provider: ModelPlugin<any, any>; models: string[] }[]
  ) {
    for (const entry of pluginEntries) {
      this.register(entry.provider, entry.models);
    }
  }

  public static getPlugin(id: string) {
    return this.plugins.get(id);
  }

  public static removePlugin(id: string) {
    this.plugins.delete(id);
  }

  public static clearRegistry() {
    this.plugins.clear();
  }
}
