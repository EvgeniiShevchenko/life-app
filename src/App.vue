<template>
  <div id="app">
       <vue-snotify class="snotify"></vue-snotify>
    <router-view/>
  </div>
</template>

<style>
html {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, San Francisco, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Segoe UI, Fira Sans, Roboto, Oxygen, Ubuntu, Droid Sans, Arial, sans-serif;
  color: #eee;
  text-align: center;
}

body {
  margin: 0;
}
</style>

<style lang="scss" scoped>
.app {
  .snotify {
    /deep/ .snotifyToast__inner {
      padding: 0;
    }

    /deep/ .split {
      padding: 14px 10px;
      min-width: calc((100% - 20px) / 3);
    }
  }
}
</style>
