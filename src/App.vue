<template>
  <div id="app">
    <!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view/> -->
    <Home/>
  </div>
</template>
<script>
import Home from '@/views/HomeView'
export default {
  name: 'App',
  components: {
    Home
  }
}
</script>
<style>
body {
  margin: 0;
  padding: 0;
}
</style>
