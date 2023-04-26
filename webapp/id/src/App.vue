<script >
import { RouterLink, RouterView } from "vue-router";
// import FilSys from "./components/FilSys.vue"

export default {
  name: "app",
  data() {
    return {};
  },
  // components: {
  //   FilSys
  // },
  methods : {
    checkRoute() {

    }
  },
  watch: {}
}
</script>

<template>
  <div class="body">
    <!-- <header >
      <div class="wrapper">
        <FilSys msg="Welcome to FilSys!" />
        <nav>
          <RouterLink to="/">Sign Up</RouterLink>
          <RouterLink to="/login">Log In</RouterLink>
        </nav>
      </div>
    </header> -->
    <!-- <FilSys msg="Welcome to FilSys!" /> -->
    <router-view> </router-view>
  </div>
</template>

<style >
#app {
  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.blue {
  text-decoration: none;
  color: rgb(0, 151, 189);
  transition: 0.4s;
}

</style>
