import { Adapter, TemplateEngine, JSONObject, PromptMetadata, TextConfig } from "../types";

export class TextPrompt<
  T extends { [K in keyof T]: { input: any; output: any } },
  A extends Adapter<T>,
  K extends keyof T & string
> {
  protected templateEngine: TemplateEngine;
  protected adapter: A;
  public path: K;
  public template: unknown;
  
  constructor(template: unknown, templateEngine: TemplateEngine, adapter: A, path: K) {
    this.template = template;
    this.templateEngine = templateEngine;
    this.adapter = adapter;
    this.path = path;
  }

  async format(
    props: T[K]["input"],
    options: JSONObject = {}
  ): Promise<ReturnType<A['adaptText']>> {
    const compiledTemplate = await this.templateEngine.compile(this.template, props) as TextConfig;
    const metadata: PromptMetadata = { props, path: this.path, template: this.template };
    return this.adapter.adaptText(compiledTemplate, options, metadata);
  }
} 