import Vue from 'vue'
import VueRouter, {RawLocation, Route, RouteConfig} from 'vue-router'
import {AuthorityName} from "@/models/Authority";
import {getModule} from "vuex-module-decorators";
import SessionModule from "@/store/SessionModule";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: () => import("@/views/HomeView.vue"),
    meta: {authorize: [AuthorityName.ADMIN, AuthorityName.SUPERADMIN]}
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("@/views/LoginView.vue")
  },
  {
    path: '/users',
    name: 'users',
    component: () => import("@/views/UsersView.vue")
  },
  {
    path: '/users/:userId(\\d+)(/authorities)?',
    name: 'user',
    component: () => import("@/views/UserView.vue")
  },
  {
    path: '/news',
    name: 'news',
    component: () => import("@/views/NewsView.vue")
  },
  {
    path: '/news/update/:id',
    name: 'newsUpdate',
    component: () => import("@/views/NewView.vue")
  },
  {
    path: '/news/create',
    name: 'newsCreate',
    component: () => import("@/views/NewView.vue")
  },
  {
    path: '/headlines',
    name: 'headlines',
    component: () => import("@/views/HeadlinesView.vue")
  },
  {
    path: '/headline/create/',
    name: 'headlineCreate',
    component: () => import("@/views/HeadlineView.vue")
  },
  {
    path: '/headline/update/:id',
    name: 'headlineUpdate',
    component: () => import("@/views/HeadlineView.vue")
  },
  {
    path: '/blogs',
    name: 'blogs',
    component: () => import("@/views/BlogsView.vue")
  },
  {
    path: '/blog/create',
    name: 'blogCreate',
    component: () => import("@/views/BlogView.vue")
  },
  {
    path: '/blog/update/:id',
    name: 'blogUpdate',
    component: () => import("@/views/BlogView.vue")
  },
  {
    path: '/interviews',
    name: 'interviews',
    component: () => import("@/views/InterviewsView.vue")
  },
  {
    path: '/interview/create',
    name: 'interviewCreate',
    component: () => import("@/views/InterviewView.vue")
  },
  {
    path: '/interview/update/:id',
    name: 'interviewUpdate',
    component: () => import("@/views/InterviewView.vue")
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach(async (to: Route, from: Route, next: (to?: (RawLocation | false | ((vm: Vue) => any) | void)) => void) => {
  const {authorize} = to.meta
  let sessionModule: SessionModule = getModule(SessionModule)
  if (sessionModule.session && sessionModule.session.token) {
    sessionModule.saveSession()
  }
  sessionModule.loadSession()
  let authorities = sessionModule.session.authorities

  if (!sessionModule.session.token) {
    if (to.path != "/login") {
      return next({path: "/login", query: {redirect: to.path}})
    }
  } else if (to.path == "/login") {
    return next({path: "/"})
  } else if (to.path != "/" && authorize) {
    for (let authority of authorities) {
      if (authorize.includes(authority.name)) {
        return next()
      }
    }
    return next({path: "/"})
  }
  next()
})
