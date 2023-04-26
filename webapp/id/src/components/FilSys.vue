<script lang="ts">
export default {
  name: "FilSys",
  props: {
    msg: String
  },
  data() {
    return {

    }
  }
};
</script>

<template>
  <div class="greetings">
    <h1 class="blue">{{ msg }}</h1>
    <h3>
      This is a simple ID System created by students under the Computer Security Group
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
}

h3 {
  font-size: 1.2rem;
  color: #000000;
}

.greetings h1{
  padding-top: 5%;
  text-align: center;
}
.greetings h3 {
  padding-top: 2%;
  padding-bottom: 2%;
  text-align: center;
}  

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
