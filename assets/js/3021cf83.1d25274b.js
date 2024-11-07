"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[857],{5251:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>c,frontMatter:()=>a,metadata:()=>i,toc:()=>d});var r=n(4848),s=n(8453);const a={title:"Getting Started"},o="Getting Started",i={id:"getting-started",title:"Getting Started",description:"Follow the instructions below to install TemplateDX in your app.",source:"@site/docs/getting-started.mdx",sourceDirName:".",slug:"/getting-started",permalink:"/promptdx/docs/getting-started",draft:!1,unlisted:!1,editUrl:"https://github.com/puzzlet-ai/promptdx-docs/edit/main/docs/getting-started.mdx",tags:[],version:"current",frontMatter:{title:"Getting Started"},sidebar:"docs",next:{title:"Overview",permalink:"/promptdx/docs/overview"}},l={},d=[{value:"Install TemplateDX",id:"install-templatedx",level:2},{value:"Use TemplateDX",id:"use-templatedx",level:2},{value:"Loader (Recommended):",id:"loader-recommended",level:3},{value:"Node",id:"node",level:3}];function p(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"getting-started",children:"Getting Started"})}),"\n",(0,r.jsx)(t.p,{children:"Follow the instructions below to install TemplateDX in your app."}),"\n",(0,r.jsx)(t.h2,{id:"install-templatedx",children:"Install TemplateDX"}),"\n",(0,r.jsx)(t.p,{children:"Install with npm:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",metastring:"npm",children:"npm install @puzzlet/templatedx\n"})}),"\n",(0,r.jsx)(t.p,{children:"or yarn:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",metastring:"npm",children:"yarn add @puzzlet/templatedx\n"})}),"\n",(0,r.jsx)(t.h2,{id:"use-templatedx",children:"Use TemplateDX"}),"\n",(0,r.jsx)(t.h3,{id:"loader-recommended",children:"Loader (Recommended):"}),"\n",(0,r.jsxs)(t.p,{children:["Use our ",(0,r.jsx)(t.a,{href:"https://github.com/puzzlet-ai/promptdx-loader",children:"webpack loader"}),". Then import pre-parsed Template files directly."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-tsx",children:"import { transform } from '@puzzlet/templatedx';\nimport MyTemplate from './my-template.mdx';\n...\nconst props = { name: 'Jim' };\nconst result = stringify(await transform(MyTemplate, props));\n"})}),"\n",(0,r.jsx)(t.h3,{id:"node",children:"Node"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-tsx",children:"import { parse, transform, stringify } from '@puzzlet/templatedx';\nimport type { ContentLoader } from '@puzzlet/templatedx';\nimport fs from 'fs';\n\n// Define how to load imports.\nconst getFile: ContentLoader = (path: string) => {\n  const input = fs.readFileSync(path, 'utf-8');\n  return input;\n}\n\nconst run = async (path: string) => {\n  const mdx = await getFile(path);\n  const parsed = await parse(mdx, `${basePathToMdxFile}`, getFile);\n  const props = { name: 'Jim' };\n  const result = stringify(await transform(parsed, myProps));\n}\nrun();\n"})})]})}function c(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(p,{...e})}):p(e)}},8453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>i});var r=n(6540);const s={},a=r.createContext(s);function o(e){const t=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),r.createElement(a.Provider,{value:t},e.children)}}}]);