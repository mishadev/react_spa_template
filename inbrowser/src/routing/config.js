import master from '@pages/master'
import landing from '@pages/landing'
import notfound from '@pages/notfound'

export default [
  {
    path: '/',
    name: 'Master',
    component: master,
    children: [
      {
        path: '/index.html',
        name: 'Dashboard',
        component: landing
      },
      {
        path: '/',
        name: 'Dashboard',
        component: landing
      },
      {
        path: '*',
        name: 'Not Found',
        component: notfound
      }
    ]
  }
]
