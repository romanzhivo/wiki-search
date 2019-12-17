<template>
  <div id="app">
    <div class="root_wrapper">
        <Header :msg="appHeader" />
        <div class="root_content">
        <router-view></router-view>
        </div>
        <div class="footer">
            <a class="mediawiki" :href="wikiApiUrl" target="_blank">{{wikiApiText}}</a>
        </div>
    </div>
  </div>
</template>

<script>
  import Header from './components/Header.vue';
  import initRouter from './init-router.js';

  initRouter();

export default {
  name: 'app',
  data: function() {
    return {
        appHeader: 'Поиск по Википедии',
        wikiApiText: 'MediaWiki Action API',
        wikiApiUrl: 'https://www.mediawiki.org/wiki/API:Main_page/ru'
    }
  },
  beforeCreate() {
    if(this.$route.path === '/') this.$router.replace(this.$router.options.routes[0].path)
  },
  components: {
    Header
  }
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i,900,900i&display=swap&subset=cyrillic');

  * {
    box-sizing: border-box;
  }

  body {
    padding: 0;
    margin: 0;
  }

  input, textarea {
    border-radius: 2px;
    border: 1px solid #d3d3d3;
  }

  #app {
    max-width: 960px;
    margin: auto;
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #323232;
    padding: 2em;

    > .root_wrapper {
        border-left: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;

        .root_content {
        padding: 0 1em;

        > [class*='search_'] {
          .status_notif {
            margin: 2em 0;

            &.error {
              color: #c11911;
            }
          }
        }
        }

        .footer {
            margin-top: 2em;
            padding: 0;
            text-align: center;

            > .mediawiki {
                color: #ababab;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
  }

  h1 {
    font-size: 2.2em;
  }

  .status_notif {
    text-align: center;
  }
</style>
