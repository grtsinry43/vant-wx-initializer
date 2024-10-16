/**
 * @author grtsinry43
 * @date 2024/10/16
 * 路由配置
 * 这里的路由配置用于动态生成 NavBar 和 BottomBar
 * 注意：
 * 1. 每一个对象代表一个路由组，其 name 决定菜单名称，而 component 决定 layout 样式
 * 2. 每一个对象的 meta 具有 meta-icon 属性，用于生成菜单图标，如果需要隐藏则设置 hideInMenu: true（比如一些登录页面，二次确认页面）
 * 3. children 为路由组内的路由，其 name 决定上方导航栏名称，而 component 决定页面组件
 */

const routes = [
    {
        path: '/',
        name: '首页',
        component: () => import('../layout/BasicLayout.vue'),
        meta: {
            icon: 'guide-o',
            hideInMenu: false
        },
        children: [
            {
                path: '',
                name: '首页',
                component: () => import(/* webpackChunkName: "Home" */'@/views/HomeView.vue')
            }
        ]
    },
    {
        path: '/leaderboard',
        name: '排行榜',
        component: () => import('../layout/BasicLayout.vue'),
        meta: {
            icon: 'bar-chart-o',
            hideInMenu: false
        },
        children: [
            {
                path: '',
                name: '排行榜',
                component: () => import(/* webpackChunkName: "LeaderBoard" */'@/views/leaderBoard/LeaderBoardView.vue')
            }
        ]
    },
    {
        path: '/user',
        name: '我的',
        component: () => import( '../layout/BasicLayout.vue'),
        meta: {
            icon: 'user-o',
            hideInMenu: false
        },
        children: [
            {
                path: '',
                name: '我的',
                component: () => import(/* webpackChunkName: "User" */'@/views/user/UserView.vue')
            },
            {
                path: 'profile',
                name: '个人信息',
                component: () => import(/* webpackChunkName: "UserInfo" */'@/views/user/UserInfoView.vue')
            }
        ]
    }
]

export default routes
