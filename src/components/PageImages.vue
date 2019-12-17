<template>
    <div class="search_images">
        <SearchForm :placeholder="searchPlaceholder" :readonly="this.isLoading" />

        <div class="status_notif" v-if="isLoading">{{loadingText}}</div>
        <div :class="{status_notif: true, error: isAPIError}"
             v-if="!isLoading && imageList.length === 0">{{!isAPIError ? emptyNotif : apiErrorNotif}}</div>
        <div class="image_list_wrapper" v-if="!isLoading">
            <template v-for="(img, index) in imageList">
                <div class="image_wrapper" :key="index">
                    <div class="image_wrapper_internal">
                        <img :src="img.url" />
                        <div class="image_title">{{img.name}}</div>
                        <div class="more_links_wrap">
                            <a class="more_link" :href="img.descriptionurl" target="_blank">{{description}}</a>
                            <a class="more_link" :href="img.url" target="_blank">{{origin}}</a>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .search_images {
        .image_list_wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(1,minmax(auto,auto));
            grid-gap: 1em;
            margin-top: 2em;

            @media (max-width: 859px) {
                grid-template-columns: 1fr;
            }

            .image_wrapper {
                display: grid;
                position: relative;
                grid-template-areas:
                        ". a a ."
                        ". a a .";
                background-color: #f4f4f4;
                padding: 1em;

                .image_wrapper_internal {
                    grid-area: a;
                    align-self: center;
                    justify-self: center;

                    img,
                    .image_title {
                        display: block;
                        max-width: 100%;
                        margin: auto;
                    }

                    img {
                        margin-bottom: 1em;
                    }

                    .image_title {
                        text-align: center;
                        word-break: break-word;
                    }
                }

                &:hover .more_links_wrap {
                    visibility: visible;
                    cursor: pointer;
                }

                .more_links_wrap {
                    display: flex;
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    background-color: rgba(47, 107, 150, 0.9);
                    left: 0;
                    line-height: 5em;
                    text-align: center;
                    visibility: hidden;

                    a {
                        width: 50%;
                        color: #FFF;
                        text-decoration: none;
                        text-align: center;

                        &:hover {
                            background-color: rgba(42, 69, 88, 0.6);
                        }
                    }

                    &::selection {
                        background: transparent;
                    }
                }
            }
        }
    }
</style>


<script>
    import store from '../store/store'
    import { startSearch } from "../store/actions";
    import toObserveStore from '../store/store-observer'
    import SearchForm from './SearchForm'
    import APIMethods from '../requests/methods';

    let unsubscribe;

    var vm = {
        name: 'PageImages',
        beforeDestroy: function() {
            console.log('Destroy')

            if(unsubscribe) unsubscribe();
        },
        beforeCreate: function() {
            let observer = toObserveStore(store);

            unsubscribe = observer.subscribe({next: (state) => {
                    let newState = state;
                    let searchText = newState.startSearch.text;

                    if(newState.startSearch.status) {
                        this.getImages(searchText);

                        store.dispatch(startSearch({
                            status: false,
                            text: ''
                        }));
                    }
                }});
        },
        data: function () {
            return {
                loadingText: 'Загрузка данных...',
                description: 'Описание',
                origin: 'Исходник',
                emptyNotif: 'Ничего не найдено',
                apiErrorNotif: 'Ошибка запроса к API',
                searchPlaceholder: 'Поиск по имени файла...',
                isLoading: true,
                isAPIError: false,
                imageList: []
            }
        },
        methods: {
            getImages(text) {
                var params = {
                    aifrom: text ? text : getRandomLetter()
                };

                this.imageList = [];
                this.isLoading = true;
                this.isAPIError = false;

                APIMethods.getImageList(params).then(
                    (success)=>{
                        this.isLoading = false
                        this.imageList = success.data.images;
                        console.log('success', success)
                    },
                    (error)=>{
                        this.isLoading = false;
                        this.isAPIError = true;
                        console.log('error', error)
                    }
                )
            }
        },
        components: {
            SearchForm
        }
    };

    // Private

    function getRandomLetter() {
        const alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
        const random = Math.round(getRandomArbitrary(0, 26));

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        return alphabet[random];
    }

    // Private : END

    export default vm;
</script>
