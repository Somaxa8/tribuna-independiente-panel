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
