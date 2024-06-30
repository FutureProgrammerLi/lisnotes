import { defineConfig } from 'vitepress';

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

const tailwindCDN = ['script', { src: 'https://cdn.tailwindcss.com' }];
const favicon = ['link', { rel: 'icon', href: '/favicon.ico' }];
// const favicon = ['link', { rel: 'icon', href: '/public/favicon.ico' }];

export default defineConfig({
  head: [
    tailwindCDN,
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
      { text: 'Notes', link: '/vue/Nuxt/Experience.html' }
      // { text: 'Examples', link: '/markdown-examples' } // 保留, 学怎么用
    ],

    sidebar: [
      {
        text: 'Vue',
        collapsed: true,
        items: [
          {
            text: 'Nuxt',
            items: NuxtItems,
          }
        ]
      },
      {
        text: 'React',
        collapsed: true,
        items: [
          { text: 'JSX是如何工作的', link: '/react/How-JSX-Works' },
          {
            text: "Dan\'s blogs",
            collapsed: true,
            items: [
              { text: 'A Chain Reaction', link: '/react/DansBlogs/A-Chain-Reaction' },
              { text: 'A Complete Guide to useEffect', link: '/react/DansBlogs/A-Complete-Guide-to-useEffect' },
              { text: 'The Two Reacts', link: '/react/DansBlogs/The-Two-Reacts' },
            ]
          }, {
            text: 'Fluent React',
            link: '/react/FluentReact/index',
            collapsed: true,
            items: FluentReactItems,
          },
          {
            text: 'Next',
            collapsed: true,
            items: [
              { text: 'Next的亿点点好处', link: '/react/Next/Why-Next' },
              { text: '官方教程学习过程', link: '/react/Next/Official-Tutorial' }
            ]
          }
        ]
      },
      {
        text: "Javascript",
        collapsed: true,
        items: [
          {
            text: 'Array.reduce() 是最最最最伟大的', link: '/js/reduce',
          }
        ]
      },
      {
        text: "CSS",
        collapsed: true,
        items: [
          {
            text: 'TailwindCSS',
            items: [
              { text: '基础', link: '/css/TailwindCSS/Basis' }
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
        text: "随记/心情",
        collapsed: true,
        items: [
          { text: '1', link: '/blogs/hotchpotch' },
          { text: '2', link: '/blogs/libraries' },
          { text: '3', link: '/blogs/it' },
          { text: '4', link: '/blogs/UseYourHead' },
          { text: '5', link: '/blogs/flow' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/FutureProgrammerLi' }
    ]
  }
});


