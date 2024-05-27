import { defineConfig } from 'vitepress';

const FluentReactItems = [
  { text: 'The Entry-level Stuff', link: '/react/FluentReact/Entry-Level-Stuff' },
  { text: 'JSX', link: '/react/FluentReact/JSX' },
  { text: 'VDOM', link: '/react/FluentReact/VDOM' },
  { text: 'Into Reconciliation', link: '/react/FluentReact/Reconciliation' },
  { text: 'Common Questions and Powerful Patterns', link: '/react/FluentReact/Common-Questions-and-Powerful-Patterns' },
  { text: 'Server-side React', link: '/react/FluentReact/Server-side-React' },
];

const tailwindCDN = ['script', { src: 'https://cdn.tailwindcss.com' }]
export default defineConfig({
  head: [
    tailwindCDN
  ],
  title: "What I've learned",
  description: "Learning record",
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/api-examples' }
      // { text: 'Examples', link: '/markdown-examples' } // 保留, 学怎么用
    ],

    sidebar: [
      {
        text: 'Vue',
        collapsed: true,
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
            ]
          }, {
            text: 'Fluent React',
            link: '/react/FluentReact/index',
            items: FluentReactItems,
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
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/FutureProgrammerLi' }
    ]
  }
});


