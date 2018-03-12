<template>

  <section>
    <div class="infoText">
      <article class="message is-danger">
        <span class="message-header">
          No Internet Connection
        </span>
        <div class="message-body">
          Please fix your internet connection to continue
        </div>
      </article>
  </div>
  </section>

</template>

<script>
  export default  {
    name: 'NoConnectionScreen',
    props: [],
    mounted() {

    },
    data() {
      return {

      }
    },
    methods: {

    },
    computed: {

    }
}
</script>

<style>
.infoText{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
