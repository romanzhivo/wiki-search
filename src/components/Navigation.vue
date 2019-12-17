<template>
    <div id="navigation">
        <ul>
            <template v-for="link in links">
                    <router-link
                        :key="link.id"
                        :to="link.path"
                        v-slot="{ href, route, navigate, isActive, isExactActive }">
                        <li :class="{active: isActive}">
                            <a :href="href" @click="navigate">{{route.name}}</a>
                        </li>
                    </router-link>
            </template>
        </ul>
    </div>
</template>

<style lang="scss">
    #navigation {
        display: inline-block;
        width: 100%;
        vertical-align: top;
        padding: 2em 0;

        > ul {
            padding: 0;
            margin: 0;
            list-style: none;
            text-align: center;

            > li {
                display: inline-block;
                flex: 1;
                vertical-align: top;
                background-color: #7f9eb9;
                border-radius: 2px;
                margin-left: 1em;

                &.active {
                    background-color: #51afff;
                }

                &:first-of-type {
                    margin-left: 0;
                }

                > a {
                    flex: 1;
                    padding: 6px 10px;
                    text-align: center;
                }
            }
        }

        a {
            display: inline-block;
            color: #ffffff;
            text-decoration: none;
        }
    }
</style>

<script>
    export default {
        name: 'Navigation',
        data: function () {
            return {
                routes: this.$router.options.routes
            }
        },
        computed: {
            links: function () {
                return this.routes.filter(function (el) {
                    return el.id < 4
                })
            }
        }
    }
</script>