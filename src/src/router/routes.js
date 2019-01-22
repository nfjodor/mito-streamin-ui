import Index from '@/views/Index.vue';
import Admin from '@/views/Admin.vue';

export default [
    {
        path: '/',
        name: 'index',
        component: Index,
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin,
    },
    {
        path: '*',
        redirect: '/',
    },
    // {
    //     path: '/about',
    //     name: 'about',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
];
