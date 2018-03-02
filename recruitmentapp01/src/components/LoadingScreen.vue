

<template>

  <section class="loading-screen">

     <div v-if ="checking == true">
         <hollow-dots-spinner
          :animation-duration="1000"
          :dot-size="20"
          :dots-num="3"
          color="#668cff"/>
    </div>
    
    <div v-if ="this.status != 'OK' "> 
        <button v-on:click="onRetryClick" class="button is-danger is-outlined">RETRY</button>
    </div>

  </section>

</template>

<script>
  import { HollowDotsSpinner } from 'epic-spinners';
  import axios from 'axios';

  export default  {
    components: {
      //spinner shown while checking server health
      HollowDotsSpinner,
    },
    name: 'LoadingScreen',
    data() {
      var tempStatus = "OK";
      var status = "OK";
      var checking = true;
      return {
        status,
        checking
      }
    },
    mounted:function(){
        this.getServerHealth();
    },
    methods : {
      // get the server health : can be 200 OK or 503 Service Unavailable. Please try again later.
      getServerHealth: function(){
        // request to check server health
        axios.get(`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/health`).then(response => {
          this.tempStatus = response.data.status;
        })
        .catch(e => {this.tempStatus="ERROR";});
        setTimeout(() => { 
          this.checking = false;
          this.status = this.tempStatus;
          if(this.status="OK"){
           this.$router.push({ path: '/questions', params: {}})
          }
        }, 3000)
      },

      // retry button callback
      onRetryClick : function(){
        this.status = "OK";
        this.checking = true;
        this.getServerHealth();
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
