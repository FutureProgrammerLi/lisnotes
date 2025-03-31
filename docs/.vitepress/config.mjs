import { defineConfig } from 'vitepress';
// import { sidebarItems } from './sidebar';
import { generateSidebar } from 'vitepress-sidebar';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
// import viteCompress from 'vite-plugin-compression';
// import CompressImgs from '../plugins/test';

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


const SidebarItemsWithPlugins = generateSidebar({
  documentRootPath: '/docs',
  collapsed: true,
  capitalizeEachWords: true,
  manualSortFileNameByPriority: ['vue', 'react', 'JS', 'TS', 'css', 'State-Management', 'building', 'git', 'blogs', 'comparisons', 'english'],
  hyphenToSpace: true,
  underscoreToSpace: true,
  excludePattern: ['api-examples.md', 'markdown-examples.md', 'public/', 'plugins/', '*.vue'],
  useFolderLinkFromSameNameSubFile: true,      // Authentication/Authentication.md, 达到无subtree, 但实际目录结构是文件夹+文件的形式, 从而方便添加对应的Authentication/imgs目录
  // includeFolderIndexFile:true,    // index.md作为目录名称显示出来
});

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../')
      }
    },
    ssr: {
      noExternal: ['medium-zoom'],
    },
    optimizeDeps: {
      include: ['medium-zoom'],
    },
    server: {
      open: true,
      port: 5173
    },
    build: {
      emptyOutDir: true,
      rollupOptions: {
        plugins: [
          // both vite and rollup plugins, run on build.
          visualizer({
            // open: true,
            filename: 'bundle-visualizer.html',
          }),
          // ViteImageOptimizer(),
        ],
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/vitepress/')) {
              return 'vitepress';
            }
            if (id.includes('/node_modules/')) {
              return 'vendor';
            }
          },
        }
      },
    },
    plugins: [
      // viteCompress(),
    ],
  },
  markdown: {
    lineNumbers: true,
    image: {
      lazloading: true
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
      provider: 'local', // local
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/react/Official-Docs/Next/Official-Docs' }
      // { text: '', link: '/markdown-examples' } // 保留, 学怎么用
    ],

    // sidebar: sidebarItems,
    sidebar: SidebarItemsWithPlugins,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/FutureProgrammerLi' }
    ],
    footer: {
      message: 'No License Released HIHI',
      copyright: 'Copyright @LiLiLi'
    },
    lastUpdated: true,
  }
});


