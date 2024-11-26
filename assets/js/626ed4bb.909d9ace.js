"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[68],{9895:(e,d,n)=>{n.r(d),n.d(d,{assets:()=>o,contentTitle:()=>s,default:()=>u,frontMatter:()=>t,metadata:()=>r,toc:()=>p});var l=n(4848),i=n(8453);const t={id:"model-plugins",title:"Model Plugins"},s="Model Plugins",r={id:"model-plugins",title:"Model Plugins",description:"PromptDX doesn't provide any models by default. Instead, each model must be added as a plugin. We provide the ability to add our own",source:"@site/docs/model-plugins.mdx",sourceDirName:".",slug:"/model-plugins",permalink:"/promptdx/docs/model-plugins",draft:!1,unlisted:!1,editUrl:"https://github.com/puzzlet-ai/promptdx-docs/edit/main/docs/model-plugins.mdx",tags:[],version:"current",frontMatter:{id:"model-plugins",title:"Model Plugins"},sidebar:"docs",previous:{title:"API",permalink:"/promptdx/docs/api"},next:{title:"Examples",permalink:"/promptdx/docs/examples"}},o={},p=[{value:"Adding Model Plugins",id:"adding-model-plugins",level:2},{value:"Adding All latest",id:"adding-all-latest",level:3},{value:"Adding Individual Model Plugins",id:"adding-individual-model-plugins",level:3},{value:"Using your model plugins",id:"using-your-model-plugins",level:2},{value:"Provided by PromptDX",id:"provided-by-promptdx",level:2},{value:"Creating Custom Model Plugins",id:"creating-custom-model-plugins",level:2},{value:"Contributing Model Plugins",id:"contributing-model-plugins",level:2}];function c(e){const d={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,i.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(d.header,{children:(0,l.jsx)(d.h1,{id:"model-plugins",children:"Model Plugins"})}),"\n",(0,l.jsx)(d.p,{children:"PromptDX doesn't provide any models by default. Instead, each model must be added as a plugin. We provide the ability to add our own\nbuilt-in plugins, or custom plugins."}),"\n",(0,l.jsx)(d.h2,{id:"adding-model-plugins",children:"Adding Model Plugins"}),"\n",(0,l.jsx)(d.p,{children:"Adding model plugins is a straight-forward process."}),"\n",(0,l.jsx)(d.h3,{id:"adding-all-latest",children:"Adding All latest"}),"\n",(0,l.jsx)(d.p,{children:"Adding all latest models isn't recommended for production because you'll likely only need a subset of models for your app. Also, it's important to pin models\nso outputs don't change unexpectedly with new versions."}),"\n",(0,l.jsx)(d.pre,{children:(0,l.jsx)(d.code,{className:"language-tsx",children:"import AllModelPlugins from '@puzzlet/promptdx/models/all-latest';\nModelPluginRegistry.registerAll(AllModelPlugins);\n"})}),"\n",(0,l.jsx)(d.h3,{id:"adding-individual-model-plugins",children:"Adding Individual Model Plugins"}),"\n",(0,l.jsx)(d.p,{children:"Selectively adding models allows you to choose which providers you support, and pin model versions."}),"\n",(0,l.jsx)(d.p,{children:"Example: Adding OpenAI models"}),"\n",(0,l.jsx)(d.pre,{children:(0,l.jsx)(d.code,{className:"language-tsx",children:'import OpenAIChatPlugin from "@puzzlet/promptdx/models/openai-chat";\nimport { ModelPluginRegistry } from "@puzzlet/promptdx";\n\nModelPluginRegistry.register(new OpenAIChatPlugin(), [\'gpt-4o\']);\n'})}),"\n",(0,l.jsx)(d.h2,{id:"using-your-model-plugins",children:"Using your model plugins"}),"\n",(0,l.jsx)(d.p,{children:"Once your plugin is registered, you can use it within your promptdx files. Here, we are using gpt-4o."}),"\n",(0,l.jsx)(d.p,{children:(0,l.jsx)(d.code,{children:"example.prompt.mdx"})}),"\n",(0,l.jsx)(d.pre,{children:(0,l.jsx)(d.code,{className:"language-md",children:"---\nname: basic-prompt\nmetadata:\n  model:\n    name: gpt-4o\n---\n\n<User>Hello World</User>\n"})}),"\n",(0,l.jsx)(d.h2,{id:"provided-by-promptdx",children:"Provided by PromptDX"}),"\n",(0,l.jsx)(d.p,{children:"This is the list of model plugins provided/supported by PromptDX."}),"\n",(0,l.jsxs)(d.table,{children:[(0,l.jsx)(d.thead,{children:(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.th,{children:"Provider"}),(0,l.jsx)(d.th,{children:"Model"}),(0,l.jsx)(d.th,{children:"Supported"})]})}),(0,l.jsxs)(d.tbody,{children:[(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"OpenAI"}),(0,l.jsx)(d.td,{children:"gpt-4o"}),(0,l.jsx)(d.td,{children:"\u2705 Supported"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"OpenAI"}),(0,l.jsx)(d.td,{children:"gpt-4o-mini"}),(0,l.jsx)(d.td,{children:"\u2705 Supported"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"OpenAI"}),(0,l.jsx)(d.td,{children:"gpt-4-turbo"}),(0,l.jsx)(d.td,{children:"\u2705 Supported"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"OpenAI"}),(0,l.jsx)(d.td,{children:"gpt-4"}),(0,l.jsx)(d.td,{children:"\u2705 Supported"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"OpenAI"}),(0,l.jsx)(d.td,{children:"o1-mini"}),(0,l.jsx)(d.td,{children:"\u2705 Supported"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"OpenAI"}),(0,l.jsx)(d.td,{children:"o1-preview"}),(0,l.jsx)(d.td,{children:"\u2705 Supported"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"OpenAI"}),(0,l.jsx)(d.td,{children:"gpt-3.5-turbo"}),(0,l.jsx)(d.td,{children:"\u2705 Supported"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"Anthropic"}),(0,l.jsx)(d.td,{children:"claude-3-5-haiku-latest"}),(0,l.jsx)(d.td,{children:"\u2705 Supported"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"Anthropic"}),(0,l.jsx)(d.td,{children:"claude-3-5-sonnet-latest"}),(0,l.jsx)(d.td,{children:"\u2705 Supported"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"Anthropic"}),(0,l.jsx)(d.td,{children:"claude-3-opus-latest"}),(0,l.jsx)(d.td,{children:"\u2705 Supported"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"Custom"}),(0,l.jsx)(d.td,{children:"any"}),(0,l.jsx)(d.td,{children:"\u2705 Supported"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"Google"}),(0,l.jsx)(d.td,{children:"ALL"}),(0,l.jsx)(d.td,{children:"\u26a0\ufe0f Coming Soon"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"Meta"}),(0,l.jsx)(d.td,{children:"ALL"}),(0,l.jsx)(d.td,{children:"\u26a0\ufe0f Coming Soon"})]}),(0,l.jsxs)(d.tr,{children:[(0,l.jsx)(d.td,{children:"Groq"}),(0,l.jsx)(d.td,{children:"ALL"}),(0,l.jsx)(d.td,{children:"\u26a0\ufe0f Coming Soon"})]})]})]}),"\n",(0,l.jsxs)(d.p,{children:["You can find a fully up-to-date list of built-in model plugins/providers here: ",(0,l.jsx)(d.a,{href:"https://github.com/puzzlet-ai/promptdx/blob/main/src/model-plugins/all-latest.ts",children:"Built-in"}),"."]}),"\n",(0,l.jsx)(d.h2,{id:"creating-custom-model-plugins",children:"Creating Custom Model Plugins"}),"\n",(0,l.jsx)(d.p,{children:"We support adding your own custom plugins. Documentation coming soon."}),"\n",(0,l.jsx)(d.h2,{id:"contributing-model-plugins",children:"Contributing Model Plugins"}),"\n",(0,l.jsxs)(d.p,{children:["You can request your own plugin by opening a ",(0,l.jsx)(d.a,{href:"https://github.com/puzzlet-ai/promptdx/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=%5BFEATURE%5D",children:"feature request"}),":"]})]})}function u(e={}){const{wrapper:d}={...(0,i.R)(),...e.components};return d?(0,l.jsx)(d,{...e,children:(0,l.jsx)(c,{...e})}):c(e)}},8453:(e,d,n)=>{n.d(d,{R:()=>s,x:()=>r});var l=n(6540);const i={},t=l.createContext(i);function s(e){const d=l.useContext(t);return l.useMemo((function(){return"function"==typeof e?e(d):{...d,...e}}),[d,e])}function r(e){let d;return d=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),l.createElement(t.Provider,{value:d},e.children)}}}]);