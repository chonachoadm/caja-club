import { createRouter, createWebHistory } from "vue-router";
import AppHero from "@/components/AppHero.vue";
import AppPurchases from "@/components/AppPurchases.vue";
import AppSpread from "@/components/AppSpread.vue";

const routes = [
    {
        path: "/",
        component: AppHero,
    },
    {
        path: "/compras",
        component: AppPurchases,
    },
    {
        path: "/detalle",
        component: AppSpread,
    },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
});

export default router;