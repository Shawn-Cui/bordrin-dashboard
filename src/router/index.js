import Vue from 'vue'
import Router from 'vue-router'
import Layout from 'views/layout/Layout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login')
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/',
          name: 'news',
          component: () => import('@/views/news/News')
        },
        {
          path: '/news/edit',
          name: 'news.edit',
          component: () => import('@/views/news/Edit')
        },
        {
          path: '/recruit',
          name: 'recruit',
          component: () => import('@/views/recruit/Recruit')
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
