import { describe, it, expect, vi } from 'vitest';
import path from 'path';
import { AgentMark } from '../src/agentmark';
import { FileLoader } from '../src/loaders/file-loader';
import { DefaultAdapter } from '../src/adapters/default';
import { TemplatedxTemplateEngine } from '../src/template_engines/templatedx';
import { VercelAdapter, VercelModelRegistry } from '../src/adapters/vercel';

type TestPromptTypes = {
  'math.prompt.mdx': {
    input: { userMessage: string };
    output: { answer: string };
  };
}
describe('AgentMark Integration', () => {

  it('should load and compile prompts with type safety', async () => {
    const fixturesDir = path.resolve(__dirname, './fixtures');
    const fileLoader = new FileLoader<TestPromptTypes>(fixturesDir);

    const agentMark = new AgentMark<TestPromptTypes>({
      loader: fileLoader,
      adapter: new DefaultAdapter(),
      templateEngine: new TemplatedxTemplateEngine()
    });
    const mathPrompt = await agentMark.loadObjectPrompt('math.prompt.mdx');
    const result = await mathPrompt.compile({
      userMessage: 'What is the sum of 5 and 3?'
    });

    expect(result).toBeDefined();
    expect(result.name).toBe('test-prompt');
    expect(result.messages).toHaveLength(3);
    expect(result.messages[0].role).toBe('system');
    expect(result.messages[0].content).toBe('You are a helpful math tutor.');
    expect(result.messages[1].role).toBe('user');
    expect(result.messages[1].content).toBe('What is the sum of 5 and 3?');
    expect(result.messages[2].role).toBe('assistant');
    expect(result.messages[2].content).toBe('Here\'s your answer!');

    expect(result.metadata.model.name).toBe('test-model');
    expect(result.metadata.model.settings.schema).toBeDefined();
    expect(result.metadata.model.settings.schema.properties.answer).toBeDefined();
  });

  it('should enforce type safety on prompt paths', () => {
    const fileLoader = new FileLoader<TestPromptTypes>(path.resolve(__dirname, './fixtures'));
    const agentMark = new AgentMark<TestPromptTypes>({
      loader: fileLoader,
      adapter: new DefaultAdapter(),
      templateEngine: new TemplatedxTemplateEngine()
    });
    expect(async () => {
      await agentMark.loadObjectPrompt('math.prompt.mdx');
    }).not.toThrow();
  });

  it('should enforce type safety on input props', async () => {
    const fileLoader = new FileLoader<TestPromptTypes>(path.resolve(__dirname, './fixtures'));
    const agentMark = new AgentMark<TestPromptTypes>({
      loader: fileLoader,
      adapter: new DefaultAdapter(),
      templateEngine: new TemplatedxTemplateEngine()
    });

    const mathPrompt = await agentMark.loadObjectPrompt('math.prompt.mdx');
    const result = await mathPrompt.compile({ userMessage: 'What is 2+2?' });
    expect(result.messages[1].content).toBe('What is 2+2?');
  });

  describe('VercelAdapter Integration', () => {
    it('should adapt object prompts for Vercel AI SDK', async () => {
      const fixturesDir = path.resolve(__dirname, './fixtures');
      const fileLoader = new FileLoader<TestPromptTypes>(fixturesDir);

      // Mock model function creator
      const mockModelFn = vi.fn().mockImplementation((modelName) => ({
        name: modelName,
        generate: vi.fn()
      }));

      // Setup registry with mock model creator
      const modelRegistry = new VercelModelRegistry();
      modelRegistry.registerModel('test-model', mockModelFn);

      const agentMark = new AgentMark<TestPromptTypes>({
        loader: fileLoader,
        adapter: new VercelAdapter(modelRegistry),
        templateEngine: new TemplatedxTemplateEngine()
      });

      const mathPrompt = await agentMark.loadObjectPrompt('math.prompt.mdx');
      const result = await mathPrompt.compile({
        userMessage: 'What is the sum of 5 and 3?'
      });

      // Verify model was created with correct name
      expect(mockModelFn).toHaveBeenCalledWith('test-model', expect.any(Object));

      // Verify core properties were preserved
      expect(result).toBeDefined();
      expect(result.messages).toHaveLength(3);
      expect(result.messages[0].role).toBe('system');
      expect(result.messages[0].content).toBe('You are a helpful math tutor.');
      expect(result.messages[1].role).toBe('user');
      expect(result.messages[1].content).toBe('What is the sum of 5 and 3?');

      // Verify Vercel-specific formatting
      expect(result.model).toBeDefined();
      expect(result.schema).toBeDefined();
    });

    it('should adapt text prompts for Vercel AI SDK', async () => {
      const fixturesDir = path.resolve(__dirname, './fixtures');
      const fileLoader = new FileLoader<TestPromptTypes>(fixturesDir);

      // Mock model function creator
      const mockModelFn = vi.fn().mockImplementation((modelName) => ({
        name: modelName,
        generate: vi.fn()
      }));

      // Setup registry with mock model creator
      const modelRegistry = new VercelModelRegistry();
      modelRegistry.registerModel('test-model', mockModelFn);

      const agentMark = new AgentMark<TestPromptTypes>({
        loader: fileLoader,
        adapter: new VercelAdapter(modelRegistry),
        templateEngine: new TemplatedxTemplateEngine()
      });

      const mathPrompt = await agentMark.loadTextPrompt('math.prompt.mdx');
      const result = await mathPrompt.compile({
        userMessage: 'What is the sum of 5 and 3?'
      });

      expect(mockModelFn).toHaveBeenCalledWith('test-model', expect.any(Object));

      expect(result).toBeDefined();
      expect(result.messages).toHaveLength(3);

      expect(result.model).toEqual({
        name: 'test-model',
        generate: expect.any(Function)
      });
    });

    it('should handle custom runtime config in Vercel adapter', async () => {
      const fixturesDir = path.resolve(__dirname, './fixtures');
      const fileLoader = new FileLoader<TestPromptTypes>(fixturesDir);

      const mockModelFn = vi.fn().mockImplementation((modelName, config) => {
        return {
          name: modelName,
          config: config,
          generate: vi.fn()
        };
      });

      // Setup registry with mock model creator
      const modelRegistry = new VercelModelRegistry();
      modelRegistry.registerModel('test-model', mockModelFn);

      const agentMark = new AgentMark<TestPromptTypes>({
        loader: fileLoader,
        adapter: new VercelAdapter(modelRegistry),
        templateEngine: new TemplatedxTemplateEngine()
      });

      const mathPrompt = await agentMark.loadObjectPrompt('math.prompt.mdx');
      const result = await mathPrompt.compile({
        userMessage: 'What is 2+2?',
      });

      // expect(mockModelFn).toHaveBeenCalledWith('test-model', expect.objectContaining(runtimeConfig));

      expect(result.messages[1].content).toBe('What is 2+2?');
    });
  });
});