import type { IRoute } from 'umi';

const routes: IRoute = [
    {
        path: '/',
        component: '@/layouts/index',
        routes: [{ path: '/', title: '编辑器', component: '@/pages/Editor' }],
    },
];
export default routes;
