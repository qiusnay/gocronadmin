/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: '用户管理',
    icon: 'user'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamic-table/index'),
      name: '用户管理',
      meta: { title: '用户管理' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/table/drag-table'),
      name: '用户列表',
      meta: { title: '用户列表' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inline-edit-table'),
      name: '用户组管理',
      meta: { title: '用户组管理' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table'),
      name: '组权限管理',
      meta: { title: '组权限管理' }
    }
  ]
}
export default tableRouter
