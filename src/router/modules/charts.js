/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: '常驻作业管理',
  meta: {
    title: '常驻作业管理',
    icon: 'rotate-right'
  },
  children: [
    {
      path: 'keyboard',
      component: () => import('@/views/charts/keyboard'),
      name: '常驻作业列表',
      meta: { title: '常驻作业列表', noCache: true }
    },
    {
      path: 'line',
      component: () => import('@/views/charts/line'),
      name: '执行机器管理',
      meta: { title: '执行机器管理', noCache: true }
    }
  ]
}

export default chartsRouter
