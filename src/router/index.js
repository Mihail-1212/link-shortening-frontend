import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'Main',
    /* view actually - not component */
    component: () => import('../views/Main.vue')
  },
  
  

  /* Redirect to full link url  */
  { 
    path: "/:hash", 
    name: 'RedirectToUrl',
    component: () => import('../views/RedirectShortLink.vue') 
  },

  /* 404 error */
  { 
    path: '/:catchAll(.*)*', 
    name: 'PathNotFound',
    component: () => import('../views/PathNotFound.vue')  
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  /* Method for scrolling the page up after navigating the router-link */
  scrollBehavior() {
    return {
      top: 0
    }
  }
})

export default router
