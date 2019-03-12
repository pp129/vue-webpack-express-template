import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const constantRouter = [
    {
        path: "/",
        component: () => import("@/views/index")
    },
    {
        path: "/login",
        component: () => import("@/views/login/login")
    }
];
export default new Router({
    routes: constantRouter
});
