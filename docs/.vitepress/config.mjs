import { defineConfig } from 'vitepress';
import { sidebarItems } from './sidebar';
import { generateSidebar } from 'vitepress-sidebar';




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

const vitepressSidebarOptions = {
  documentRootPath: '/docs',
  excludePattern: ['api-examples.md', 'markdown-examples.md'],
  collapsed: true,
  capitalizeEachWords: true,
  manualSortFileNameByPriority: ['vue', 'react', 'js', 'ts', 'css', 'SM', 'building', 'git', 'blogs', 'comparisons', 'english']
};

const SidebarItemsWithPlugins = generateSidebar(vitepressSidebarOptions);

const vitepressOptions = {
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
    // search: {
    //   provider: 'local'
    // },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/react/Next/Official-Docs/Start-up.html' }
      // { text: 'Examples', link: '/markdown-examples' } // 保留, 学怎么用
    ],

    // sidebar: sidebarItems,
    sidebar: SidebarItemsWithPlugins,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/FutureProgrammerLi' }
    ],
    footer: {
      message: 'No License Released HIHI',
      copyright: 'Copyright @LiLiLi'
    }
  }
};





export default defineConfig(vitepressOptions);


