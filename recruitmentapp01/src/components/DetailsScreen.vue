<template lang="html">

  <section class="details-screen">
    <v-container grid-list-xl text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="chart" v-if ="this.loadedChartData==true"> 
            <schart :canvasId="canvasId" :type="type" :width="chartWidth"
            :height="chartHeight" :data="chartData" :options="chartOptions"></schart>
            <button class="button is-info is-outlined is-rounded is-medium backButton" v-on:click="backClicked()">Back </button>
             <button class="button is-info is-outlined is-rounded is-medium shareButton" @click="isShareActive=true">Share </button>
        </div>
      </v-flex>
    </v-layout>
    </v-container>
    <br>
        <b-modal :active.sync="isShareActive" :width="640" scroll="keep">
            <div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-5" align="center">SHARE THIS CONTENT</p>
                        </div>
                    </div>
                    <div class="content">
                       <div class="field shareForm">
                          <input class="input is-rounded is-normal" type="email" placeholder="Insert the destination email" v-model="destinationEmail">
                          <button class="button is-rounded is-success is-medium" v-on:click="shareInfo">Share</button>
                      </div>
                    </div>
                </div>
            </div>
        </b-modal>
  </section>

</template>

<script >

  import Schart from 'vue-schart';
  export default  {
    name: 'DetailsScreen',
    props: {
      QUESTION_ID: { 
        required: true,
      },
    },
    mounted() {
      this.getQuestionData();
    },
    data() {
      var question;
      var chartOptions;
      var chartData;
      var chartHeight;
      var chartWidth;
      var destinationEmail;
      return {
        question,
        destinationEmail :"",
        loadedChartData :  false,
        canvasId: 'myCanvas',
        type: 'ring',
        chartData,
        chartOptions,
        chartWidth,
        chartHeight,
        isShareActive: false,
      }
    },
    components:{
        Schart
    },
    methods: {
      getQuestionData : function() {
        if(window.navigator.onLine){
          this.$http.get(`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/questions/`+ this.QUESTION_ID).
           then(response => {
             this.question = response.body;
             this.initChartData(this.question);
          }, response => {
              this.question = null;
          });
        }
      },

      initChartData : function(quest) {
      
        this.chartData = [
          {name: quest.choices[0].choice, value: quest.choices[0].votes},
          {name: quest.choices[1].choice, value: quest.choices[1].votes},
          {name: quest.choices[2].choice, value: quest.choices[2].votes},
          {name: quest.choices[3].choice, value: quest.choices[3].votes},
        ];
        this.chartOptions = {
          padding : 50,                   
          bgColor : '#FFFFFF',           
          title : quest.question,
          titleColor : '#000000',         
          titlePosition : 'top' ,    
          legendColor : '#000000',       
          legendTop :  40,                  
          radius : 150,                   
          innerRadius : 95,
        };
        this.chartHeight = 500;
        this.chartWidth = 650;
        this.loadedChartData = true;
      },


      shareInfo : function() {
         var offset = parseInt(window.sessionStorage.getItem("offset"));
          if(!this.destinationEmail.includes("@")|| this.destinationEmail.length <3){
            this.$toast.open({ message: 'Please insert a valid email!', type: 'is-danger'});
          }else{
            this.$http.post('https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/share?'+this.destinationEmail+'&'
            +`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/questions/question_id=`+ this.QUESTION_ID).then(response => { 
              if(response.status==200){
                  this.$toast.open({ message: 'Shared with success!', type: 'is-success'});
                  this.isShareActive = false;
              }else{
                  this.$toast.open({ message: 'Please insert a valid email!', type: 'is-danger'});
              }
            }, response => {
                  this.$toast.open({ message: 'An error ocurred while sharing this information. Please try again!', type: 'is-danger'});
            });
          }
      },

      backClicked() {
        window.history.back();
      }

    },
    computed: {

    }
}
</script>

<style scoped>
  .chart {
    margin-top: 13%;
    font-family: "Trebuchet MS", Helvetica, sans-serif;
  }

  .input{
    margin-top: 5%;
    margin-bottom: 5%;
  }

  .shareForm{
    margin:auto;
    display:block;
    width: 80%;
  }

  .is-success{
    background-color:  rgb(1, 158, 1);
    margin:auto;
    display:block;
    margin-top: 5%;
  }
  
  .shareButton {
    width: 20%;
  }

  .backButton {
    width: 20%;
    margin-right: 3%;
  }
</style>
