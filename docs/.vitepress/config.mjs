import { defineConfig } from 'vitepress';
import { generateSidebar } from 'vitepress-sidebar';

const FluentReactItems = [
  { text: 'The Entry-level Stuff', link: '/react/FluentReact/Entry-Level-Stuff' },
  { text: 'JSX', link: '/react/FluentReact/JSX' },
  { text: 'VDOM', link: '/react/FluentReact/VDOM' },
  { text: 'Into Reconciliation', link: '/react/FluentReact/Reconciliation' },
  { text: 'Common Questions and Powerful Patterns', link: '/react/FluentReact/Common-Questions-and-Powerful-Patterns' },
  { text: 'Server-side React', link: '/react/FluentReact/Server-side-React' },
];

const NuxtItems = [
  {
    text: "Guide", items: [
      { text: "简介", link: '/vue/Nuxt/Introduction' },
      { text: "自动导入", link: '/vue/Nuxt/Auto-imports' },
      { text: "路由", link: '/vue/Nuxt/Routing' },
    ]
  },
  {
    text: 'Directory Structure', items: [
      { text: "服务器", link: '/vue/Nuxt/Server' },
      { text: "页面", link: '/vue/Nuxt/Pages' },
    ]
  },
  { text: "杂七杂八", link: '/vue/Nuxt/Experience' },
];

const NextDocsItems = {
  routing: [
    { text: '路由定义', link: "/react/Next/Official-Docs/Routing/defining-routes" },
    { text: '页面和布局', link: "/react/Next/Official-Docs/Routing/pages-and-layouts" },
    { text: '链接与导航', link: "/react/Next/Official-Docs/Routing/linking-and-navigating" },
    { text: '加载中界面和流', link: "/react/Next/Official-Docs/Routing/loading-and-streaming" },
    { text: '错误处理', link: "/react/Next/Official-Docs/Routing/error-handling" },
    { text: '重定向', link: "/react/Next/Official-Docs/Routing/redirect" },
    { text: '路由分组', link: "/react/Next/Official-Docs/Routing/route-groups" },
    { text: '项目文件组织', link: "/react/Next/Official-Docs/Routing/project-organization" },
    { text: '动态路由', link: "/react/Next/Official-Docs/Routing/dynamic-routes" },
    { text: '平行路由', link: "/react/Next/Official-Docs/Routing/parallel-routes" },
    { text: '穿插路由', link: "/react/Next/Official-Docs/Routing/intercepting-routes" },
    { text: '路由处理器', link: "/react/Next/Official-Docs/Routing/route-handlers" },
    { text: '中间件', link: "/react/Next/Official-Docs/Routing/middleware" },
    { text: '国际化', link: "/react/Next/Official-Docs/Routing/internationalization" }
  ],
  fetching: [
    { text: '数据获取', link: '/react/Next/Official-Docs/Data-Fetching/fetching' },
    { text: '数据缓存及重校验', link: '/react/Next/Official-Docs/Data-Fetching/caching-and-revalidating' },
    { text: '服务器行为及数据改变', link: '/react/Next/Official-Docs/Data-Fetching/server-actions-and-mutations' },
    { text: '获取,缓存及重校验', link: '/react/Next/Official-Docs/Data-Fetching/fetching-caching-revalidating' },
  ],
  styling: [
    { text: 'CSS', link: '/react/Next/Official-Docs/Styling/CSS' },
    { text: 'TailwindCSS', link: '/react/Next/Official-Docs/Styling/TailwindCSS' },
    { text: 'Sass', link: '/react/Next/Official-Docs/Styling/Sass' },
    { text: 'CSS-in-JS', link: '/react/Next/Official-Docs/Styling/CSS-in-JS' },
  ],
  rendering: [
    { text: '服务器组件', link: '/react/Next/Official-Docs/Rendering/ServerComponents' },
    { text: '客户端组件', link: '/react/Next/Official-Docs/Rendering/ClientComponents' },
    { text: '组合模式', link: '/react/Next/Official-Docs/Rendering/CompositionPatterns' },
    { text: '部分预渲染', link: '/react/Next/Official-Docs/Rendering/PartialPrerendering' },
    { text: '运行时', link: '/react/Next/Official-Docs/Rendering/Runtimes' },
  ],
  cache: [],
}

// const tailwindCDN = ['script', { src: 'https://cdn.tailwindcss.com' }];
const favicon = ['link', { rel: 'icon', href: '/favicon.ico' }];
// const favicon = ['link', { rel: 'icon', href: '/public/favicon.ico' }];

const statisticsWithGoogle = [
  [
    'script',
    {
      async: true,
      src: 'https://www.googletagmanager.com/gtag/js?id=G-V9YQ1190L3'
    }
  ],
  [
    'script',
    {},
    `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-V9YQ1190L3');
    `
  ]
];

export default defineConfig({
  vite: {
    server: {
      open: true,
      port: 5173
    }
  },
  head: [
    ...statisticsWithGoogle,
    // tailwindCDN,
    favicon
  ],
  title: "What I've learned",
  description: "Learning record",
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/react/Next/Official-Docs/Start-up.html' }
      // { text: 'Examples', link: '/markdown-examples' } // 保留, 学怎么用
    ],

    // sidebar:generateSidebar({
    //   collapsed:true
    // }),
    sidebar: [
      {
        text: 'Comparisons',
        collapsed: true,
        items: [
          {
            text:'Vue  vs. React',
            link: '/comparisons/VueVSReact'
          },
        ]
      },
      {
        text: 'Vue',
        collapsed: true,
        items: [
          {
            text: 'Nuxt',
            collapsed: true,
            items: NuxtItems,
          },
          {
            text: 'script setup',
            items: [
              {
                text: 'setup的自己探讨',
                link: '/vue/playaround/iceberg'
              },
              {
                text: '官网script setup介绍翻译',
                link: '/vue/playaround/SetupScript'
              },
            ]
          },
          {
            text: '响应性',
            link: '/vue/playaround/reactivity'
          },
          {
            text: '渲染机制',
            link: '/vue/playaround/rendering'
          },
          {
            text: '渲染函数和JSX',
            link: '/vue/playaround/RenderFunctions'
          },
        ]
      },
      {
        text: 'React',
        collapsed: true,
        items: [
          { text: 'JSX是如何工作的', link: '/react/How-JSX-Works' },
          { text: 'ReactCompiler', link: '/react/React-Compiler' },
          {
            text: "Dan\'s blogs",
            collapsed: true,
            items: [
              { text: 'A Chain Reaction', link: '/react/DansBlogs/A-Chain-Reaction' },
              { text: 'A Complete Guide to useEffect', link: '/react/DansBlogs/A-Complete-Guide-to-useEffect' },
              { text: 'The Two Reacts', link: '/react/DansBlogs/The-Two-Reacts' },
            ]
          }, {
            text: "Robin\'s blogs",
            collapsed: true,
            items: [
              {
                text: 'Types of React Component',
                link: '/react/RobinsBlogs/ComponentTypes'
              },
              {
                text: 'Data Fetching in React',
                link: '/react/RobinsBlogs/FetchData'
              }
            ]
          }, {
            text: 'Fluent React',
            link: '/react/FluentReact/index',
            collapsed: true,
            items: FluentReactItems,
          },
        ]
      },
      {
        text: 'Next',
        collapsed: true,
        items: [
          { text: 'Next的亿点点好处', link: '/react/Next/Why-Next' },
          { text: '官方教程学习过程', link: '/react/Next/Official-Tutorial' },
          { text: 'Zod的一点学习记录', link: '/react/Next/Zod/Glance.md' }
        ]
      },
      {
        text: 'Next官方文档',
        collapsed: true,
        link: '/react/Next/Official-Docs/Start-up',
        items: [
          {
            text: '路由',
            collapsed: true,
            link: '/react/Next/Official-Docs/Routing/basis',
            items: NextDocsItems.routing
          },
          {
            text: '数据获取',
            collapsed: true,
            link: '/react/Next/Official-Docs/Data-Fetching/fetching',
            items: NextDocsItems.fetching
          },
          {
            text: '渲染',
            collapsed: true,
            link: '/react/Next/Official-Docs/Rendering/overview',
            items: NextDocsItems.rendering
          },
          {
            text: '缓存',
            link: '/react/Next/Official-Docs/Cache/Full-Content',
          },
          {
            text: '样式',
            collapsed: true,
            link: '/react/Next/Official-Docs/Styling/overview',
            items: NextDocsItems.styling
          },
        ]
      },
      {
        text: "Javascript",
        collapsed: true,
        items: [
          { text: 'Array.reduce() 是最最最最伟大的', link: '/js/reduce', },
          { text: '重启', link: '/js/Restart' },
          { text: '框架选择的一些考虑', link: '/js/Frameworks-pick' },
          {
            text: 'Javascript.info',
            collapsed: true,
            items: [
              { text: '基础', link: '/js/javascript-info/first' }
            ]
          },
          {
            text: 'ES6 Premier',
            collapsed: true,
            items: [
              { text: '块级作用域', link: '/js/es6/understanding-es6/block-scope' },
              { text: '数组', link: '/js/es6/understanding-es6/Array' },
              { text: '对象', link: '/js/es6/understanding-es6/Object' },
            ]
          },
          { text: 'Set新增操作', link: '/js/Set.md' },
          { text: 'Proxy对象的自行探讨', link: '/js/Proxy.md' },
        ]

      },
      {
        text: "Typescript",
        collapsed: true,
        items: [
          {
            text: 'Typescript in Vue',
            link: '/ts/Vue'
          },
          {
            text: 'Typescript in React',
            link: '/ts/React'
          },
          {
            text: '三个比较常见的TS类型问题',
            link: '/ts/QuestionsOnTs'
          },
          {
            text: '7个常见的使用案例',
            link: '/ts/Usecases'
          },
        ]
      },
      {
        text: "CSS",
        collapsed: true,
        items: [
          {
            text: 'TailwindCSS',
            items: [
              { text: '基础', link: '/css/TailwindCSS/Basis' },
              { text: '样式重用', link: '/css/TailwindCSS/ReusingStyles/Reusing' }
            ]
          }
        ]
      },
      {
        text: "Git",
        collapsed: true,
        items: [
          {
            text: 'Basic Usage',
            link: '/git/BasicUsage'
          },
          {
            text: '提交规范',
            link: '/git/CommitSpec'
          }
        ]
      },
      {
        text: "State Management",
        collapsed: true,
        items: [
          {
            text: 'Pinia',
            link: '/SM/pinia'
          }
        ]
      },
      {
        text: "Building",
        collapsed: true,
        items: [
          { text: 'vite', link: '/building/vite/Screwedup' },
        ]
      },
      {
        text: "随记/心情",
        collapsed: true,
        items: [
          {
            text: 'phase1',
            collapsed: true,
            items: [
              { text: '1', link: '/blogs/phase1/hotchpotch' },
              { text: '2', link: '/blogs/phase1/libraries' },
              { text: '3', link: '/blogs/phase1/it' },
              { text: '4', link: '/blogs/phase1/UseYourHead' },
              { text: '5', link: '/blogs/phase1/flow' },
              { text: '6', link: '/blogs/phase1/motivation' },
              { text: '7', link: '/blogs/phase1/memory' },
            ],
          },
          {
            text: 'phase2',
            collapsed: true,
            items: [
              { text: 'Restart again', link: '/blogs/phase2/sum' },
              { text: '8月随笔', link: '/blogs/phase2/August' },
            ]
          }
        ]
      }, {
        text: 'All about ENGLISH',
        collapsed: true,
        items: [
          { text: 'Why', link: '/English/overview.md' },
          { text: 'Excerpts', link: '/English/excerpts/proses' },
          { text: 'OfStudy', link: '/English/excerpts/OfStudy' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/FutureProgrammerLi' }
    ],
    footer: {
      message: 'No License Released HIHI',
      copyright: 'Copyright @LiLiLi'
    }
  }
});


