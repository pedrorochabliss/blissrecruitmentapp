

<template>

  <section class="loading-screen">

     <div v-if ="checking == true">
         <hollow-dots-spinner
          :animation-duration="1000"
          :dot-size="20"
          :dots-num="3"
          color="#668cff"/>
    </div>
    
    <div v-if ="status == 'OK' ">
    <at-button type="text">Text Button</at-button>

    </div>
  

  </section>

</template>

<script>
  import { HollowDotsSpinner } from 'epic-spinners';
  import axios from 'axios';

  export default  {
    components: {
      //spinner shown while checking server health
      HollowDotsSpinner
    },
    name: 'LoadingScreen',
    data() {
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
      getServerHealth: function(){
        // request to check server health
        axios.get(`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/health`).then(response => {
          this.status = response.data.status;
        })
        .catch(e => {this.status="ERROR";});
        setTimeout(() => { this.checking = false; }, 3000)
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
