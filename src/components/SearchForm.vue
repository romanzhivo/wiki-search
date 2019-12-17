<template>
    <div class="search_form">
        <div class="input_wrapper">
            <input id="input"
                   ref="input"
                   :placeholder="placeholderDefault"
                   :readonly="readonly"
                   @keyup.enter="onEnter"
                   autofocus="autofocus"
                   v-model="searchValue" />
            <div class="search_icon_wrapper" @click="onEnter">
                <font-awesome-icon class="search_icon" icon="search" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .search_form {
        .input_wrapper {
            position: relative;
            input {
                width: 100%;
                padding: 0.5em 1em;
                outline: none;

                &:focus + .search_icon_wrapper .search_icon {
                    color: #828282;
                }
            }

            .search_icon_wrapper {
                position: absolute;
                height: 100%;
                top: 0;
                right: 0;
                padding: 0 0.5em;
                cursor: pointer;

                .search_icon {
                    height: 100%;
                    width: 1.2em;
                    color: #b1b1b1;
                }
            }
        }
    }
</style>

<script>
    import store from '../store/store'
    import {startSearch} from "../store/actions";
    import { library } from '@fortawesome/fontawesome-svg-core'
    import { faSearch } from '@fortawesome/free-solid-svg-icons'

    library.add(faSearch)

    export default {
        name: 'SearchForm',
        props: {
            placeholder: String,
            readonly: Boolean
        },
        watch: {
            $route(to, from) {
                console.log('Router changed', to === from);
                this.searchValue = to.query.search

                if(to !== from) {
                    store.dispatch(startSearch({
                        status: true,
                        text: this.searchValue
                    }));
                }
            }
        },
        mounted() {
            this.$refs['input'].focus();

            store.dispatch(startSearch({
                status: true,
                text: this.searchValue
            }));
        },
        data: function () {
            return {
                defaultPlaceholder: 'Поиск...',
                autofocus: true,
                searchValue: this.$route.query.search
            }
        },
        methods: {
            onEnter: function () {
                console.log('onEnter', this)

                if(this.$route.query.search !== this.searchValue) {
                    this.$router.push({query: {search: this.searchValue}});
                }

                else {
                    store.dispatch(startSearch({
                        status: true,
                        text: this.searchValue
                    }));
                }
            }
        },
        computed: {
            placeholderDefault: function () {
                return this.placeholder || this.defaultPlaceholder
            }
        }
    }
</script>