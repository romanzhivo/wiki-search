<template>
  <div class="header">
    <div class="description_block">
      <a class="header_logo" :href="wikiUrl" target="_blank">
        <img src="../assets/Wikipedia-logo.svg" />
      </a>
      <h1>{{ msg }}</h1>
    </div>
    <Navigation />
  </div>
</template>

<script>
  import Navigation from './Navigation'
  import appConfig from "../app-config";

  export default {
    name: 'Header',
    props: {
      msg: String
    },
    data: function() {
      return {
        wikiUrl: appConfig.WIKI_URL
      }
    },
    components: {
      Navigation
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .header {
    .description_block {
      padding: 0;

      .header_logo {
        display: block;

        > img {
          display: block;
          width: 140px;
          margin: auto;
        }
      }

      > h1 {
        text-align: center;
        font-size: 1.6em;
        font-weight: 300;
        margin: 1em 0 0;
        color: #505050;
      }
    }
  }
</style>
