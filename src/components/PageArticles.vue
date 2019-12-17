<template>
    <div class="search_articles">
        <SearchForm :placeholder="searchPlaceholder" :readonly="this.isLoading" />

        <div class="get_random_wrapper" v-if="!isLoading && !isSearchMode && !isAPIError">
            <div class="get_random" @click="postRequest">{{getMoreText}}</div>
        </div>
        <div class="status_notif" v-if="isLoading">{{loadingText}}</div>
        <div :class="{status_notif: true, error: isAPIError}"
             v-if="!isLoading && posts.length === 0">{{!isAPIError ? emptyNotif : apiErrorNotif}}</div>
        <div class="post_wrapper" v-if="!isLoading">
            <template v-for="(post, index) in posts">
                <div class="post" :key="index">
                    <h2 class="title">{{post.title}}</h2>
                    <div class="extract" v-html="post.extract">{{post.extract}}</div>
                    <a class="fullLink" :href="post.url" target="_blank">{{readFull}}</a>
                </div>
            </template>
        </div>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .search_articles {
        .get_random_wrapper {
            text-align: center;
            margin-top: 2em;

            .get_random {
                display: inline-block;
                vertical-align: top;
                background-color: #51afff;
                border-radius: 2px;
                padding: 6px 10px;
                border: none;
                color: #ffffff;
                cursor: pointer;
            }
        }

        .post_wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(1,minmax(auto,auto));
            grid-gap: 1em;
            margin-top: 2em;

            @media (max-width: 859px) {
                grid-template-columns: 1fr;
            }

            .post {
                position: relative;
                background-color: #f4f4f4;
                padding: 1em;
                word-break: break-word;

                > .title {
                    margin: 0 0 1em;
                    font-weight: 600;
                }

                .extract {
                    white-space: pre-wrap;

                    p {
                        margin: 0;
                        line-height: 1.4em;
                    }
                }

                .fullLink {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    background: rgba(47, 107, 150, 0.9);
                    left: 0;
                    color: #FFF;
                    line-height: 5em;
                    text-align: center;
                    visibility: hidden;
                    text-decoration: none;
                }

                .fullLink::selection {
                    background: transparent;
                }

                &:hover .fullLink {
                    visibility: visible;
                    cursor: pointer;
                }
            }
        }
    }
</style>

<script>
    import APIMethods from '../requests/methods';
    import store from '../store/store'
    import { startSearch } from "../store/actions";
    import toObserveStore from '../store/store-observer'
    import SearchForm from './SearchForm'

    let unsubscribe;

    export default {
        name: 'PageArticles',
        props: {
            msg: String
        },
        beforeDestroy: function() {
            if(unsubscribe) unsubscribe();
        },
        beforeCreate() {
            let observer = toObserveStore(store);

            unsubscribe = observer.subscribe({next: (state) => {
                    let newState = state;
                    let searchText = newState.startSearch.text;
                    var params = {
                        srsearch: searchText,
                        explaintext: true,
                        extract: true,
                        srlimit: 10
                    };

                    if(newState.startSearch.status) {
                        if(searchText) {
                            this.isSearchMode = true;
                            this.searchRequest(params)
                        }
                        else {
                            this.isSearchMode = false;
                            this.postRequest();
                        }

                        store.dispatch(startSearch({
                            status: false,
                            text: ''
                        }));
                    }
                }});
        },
        data: function() {
            return {
                loadingText: 'Загрузка данных...',
                readFull: 'Читать полностью',
                getMoreText: 'Ещё случайных',
                emptyNotif: 'Ничего не найдено',
                apiErrorNotif: 'Ошибка запроса к API',
                searchPlaceholder: 'Поиск статьям...',
                isLoading: true,
                isAPIError: false,
                isSearchMode: false,
                posts: [],
                getPosts: function (data) {
                    let posts = [];

                    posts = data.data.articles;
                    return posts;
                }
            }
        },
        methods: {
            postRequest: function (params, isInternal) {
                var localParams = isInternal ? {...params} : {
                    explaintext: true,
                    extract: true,
                    rnlimit: 10
                };

                let methodName = isInternal ? 'articleSearch' : 'getArticleListRandom';

                this.posts = [];
                this.isLoading = true;
                this.isAPIError = false;

                APIMethods[methodName](localParams).then(
                    (success)=>{
                        console.log('success', success)
                        this.isLoading = false;
                        this.posts = this.getPosts(success)
                    },
                    (error)=>{
                        console.log('error', error)
                        this.isLoading = false;
                        this.isAPIError = true;
                    }
                )
            },
            searchRequest: function(params) {
                return this.postRequest(params, true);
            }
        },
        components: {
            SearchForm
        }
    }
</script>
