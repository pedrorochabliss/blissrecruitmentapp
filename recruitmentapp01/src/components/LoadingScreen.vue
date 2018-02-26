<template>

  <section class="loading-screen">
    <h1>loading-screen Component</h1>
    <vue-simple-spinner></vue-simple-spinner>
  </section>

</template>

<script>
 
  export default  {
    name: 'LoadingScreen',
    data() {
      return {
      }
    }
}
</script>

<style scoped >
  .loading-screen {
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
  }
</style>
