import { defineConfig } from 'umi';
import routers from './config/router.config';

export default defineConfig({
    nodeModulesTransform: {
        type: 'none',
    },
    history: {
        type: 'browser',
    },
    hash: true,
    antd: {
        compact: true,
    },
    targets: {
        ie: 11,
    },
    title: '系统桌面',
    routes: routers,
    fastRefresh: {},
    // mfsu: {},
    dynamicImport: {
        loading: '@/component/Loading',
    },
    devServer: {
        port: 9100,
    },
    proxy: {
        '/api': {
            target: 'localhost:3000/',
            changeOrigin: true,
        },
    },
    //   esbuild: {
    //     target: 'es5',
    //   },
});
