"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[872],{2e3:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>p,contentTitle:()=>d,default:()=>l,frontMatter:()=>r,metadata:()=>i,toc:()=>a});var n=s(4848),o=s(8453);const r={title:"Type Safety"},d="Type Safety",i={id:"type-safety",title:"Type Safety",description:"PromptDX supports full type-safety, with just a few short steps.",source:"@site/docs/type-safety.mdx",sourceDirName:".",slug:"/type-safety",permalink:"/promptdx/docs/type-safety",draft:!1,unlisted:!1,editUrl:"https://github.com/puzzlet-ai/promptdx-docs/edit/main/docs/type-safety.mdx",tags:[],version:"current",frontMatter:{title:"Type Safety"},sidebar:"docs",previous:{title:"Syntax",permalink:"/promptdx/docs/syntax"},next:{title:"Supported Providers",permalink:"/promptdx/docs/supported-providers"}},p={},a=[{value:"Ading Type Safety",id:"ading-type-safety",level:2},{value:"Adjust your tsconfig",id:"adjust-your-tsconfig",level:3},{value:"Add JSDOC types to define props for your promptdx files",id:"add-jsdoc-types-to-define-props-for-your-promptdx-files",level:3},{value:"Add types for your filters/tags",id:"add-types-for-your-filterstags",level:3}];function c(e){const t={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",img:"img",p:"p",pre:"pre",strong:"strong",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"type-safety",children:"Type Safety"})}),"\n",(0,n.jsx)(t.p,{children:"PromptDX supports full type-safety, with just a few short steps."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"Type Safety",src:s(1969).A+"",width:"918",height:"408"})}),"\n",(0,n.jsx)(t.h2,{id:"ading-type-safety",children:"Ading Type Safety"}),"\n",(0,n.jsx)(t.h3,{id:"adjust-your-tsconfig",children:"Adjust your tsconfig"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Note"}),": It is recommended to use a separate ",(0,n.jsx)(t.code,{children:"tsconfig.json"})," file for your PromptDX files."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-json",children:'{\n  "compilerOptions": {\n    ...,\n    "allowJs": true\n  },\n  "mdx": {\n    "checkMdx": true\n  }\n}\n'})}),"\n",(0,n.jsx)(t.h3,{id:"add-jsdoc-types-to-define-props-for-your-promptdx-files",children:"Add JSDOC types to define props for your promptdx files"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-jsx",children:"{/**\n  * @typedef Props\n  * @property {string} name - Who to greet.\n  */\n}\n\n# Hello {props.name}\n"})}),"\n",(0,n.jsx)(t.h3,{id:"add-types-for-your-filterstags",children:"Add types for your filters/tags"}),"\n",(0,n.jsxs)(t.p,{children:["Create a ",(0,n.jsx)(t.code,{children:"types/global.d.ts"})," file and define your own custom filters/tags."]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-tsx",children:"import type { BaseMDXProvidedComponents, FilterFunction } from '@puzzlet/promptdx';\n\ndeclare global {\n  const myCustomFilter: FilterFunction<string, string>;\n\n  interface MDXProvidedComponents extends BaseMDXProvidedComponents {\n    MyCustomTag: React.FC<MyCustomTagProps>;\n  }\n}\nexport {};\n"})})]})}function l(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},1969:(e,t,s)=>{s.d(t,{A:()=>n});const n=s.p+"assets/images/type-safety-2716d0d57bd6b7acc344707ae58afee3.gif"},8453:(e,t,s)=>{s.d(t,{R:()=>d,x:()=>i});var n=s(6540);const o={},r=n.createContext(o);function d(e){const t=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:d(e.components),n.createElement(r.Provider,{value:t},e.children)}}}]);