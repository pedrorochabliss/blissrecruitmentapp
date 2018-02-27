<template>

  <section class="list-screen">
  
    
    <table class="table is-narrow">
      <thead>
        <tr>
          <th>Question</th>
          <th>Choice 1</th>
          <th>Choice 2</th>
          <th>Choice 3</th>
          <th>Choice 4</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>pergunta 1</th>
          <td>38</td>
          <td>23</td>
          <td>12</td>
          <td>3</td>
        </tr>
            <tr>
          <th>pergunta 1</th>
          <td>38</td>
          <td>23</td>
          <td>12</td>
          <td>3</td>
        </tr>
        
      </tbody>
    </table>

  </section>

</template>

<script>
  import axios from 'axios';
  import Router from 'vue-router';

  export default  {
    name: 'ListScreen',
    props: [],
    mounted() {
      this.getFilterParam();
    },
    data() {
      return {

      }
    },
    methods: {
      getFilterParam : function() {
        console.log(this.$router.params.filter);
      }

    },
    computed: {

    }
}
</script>

<style scoped>
  .list-screen {
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
  }
</style>
