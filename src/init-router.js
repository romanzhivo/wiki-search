import Vue from 'vue'
import VueRouter from 'vue-router'
import PageArticles from './components/PageArticles'
import PageImages from './components/PageImages'

let initialized = false;

export default function() {
    if (initialized) return;

    Vue.use(VueRouter);

    const routes = [
        { id:1, path: '/articles', component: PageArticles, name: 'Статьи' },
        { id: 2, path: '/images', component: PageImages, name: 'Изображения' }
    ];

    const router = new VueRouter({
        routes,
        mode: 'history'
    });

    Vue.mixin({ router });

    initialized = true;
}