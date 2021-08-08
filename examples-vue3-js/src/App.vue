<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/basic-data-fetching">Basic Data Fetching</router-link>
    <router-link to="/basic-data-fetching-composable"
      >Basic Data Fetching</router-link
    >
  </div>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
