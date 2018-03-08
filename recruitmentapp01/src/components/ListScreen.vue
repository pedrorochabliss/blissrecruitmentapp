<template>

  <section class="list-screen">
    <div class="filterBar" v-if ="isSearchBarActive == true">
    <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs6>
        <b-field label="Filter">
          <b-input size="is-medium" ref='search' v-on:blur="onBlurInput()" v-model="filterInput" rounded></b-input>
        </b-field>
      </v-flex>
      <v-flex xs6>
        <button class="button is-info is-rounded shareButton" @click="isShareActive=true">Share </button>
        <button class="button is-rounded closeButtons"> X </button>
      </v-flex>
    </v-layout>
    </v-container>
    </div>
   
    <div v-for="question in questions" :key="question.id">
      <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          {{question.question}}
        </p>
      </header>
      <div class="card-content">
        <div class="content">
          <div class="control">
            <label class="radio">
              <input type="radio" value="0" name="questionsRadioButtons">
                {{question.choices[0].choice}}
            </label>
            <br>
            <label class="radio">
              <input type="radio" value="1" name="questionsRadioButtons">
                {{question.choices[1].choice}}
            </label>
            <br>
            <label class="radio">
              <input type="radio" value="2" name="questionsRadioButtons">
                {{question.choices[2].choice}}
            </label>
            <br>
            <label class="radio">
              <input type="radio" value="3" name="questionsRadioButtons">
                {{question.choices[3].choice}}
            </label>
          </div>
        </div>
      </div>
      <footer class="card-footer">
        <a class="card-footer-item" v-on:click="confirmClicked(question)" >Confirm</a>
        <a class="card-footer-item" >Details</a>
      </footer>
      </div>
      
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
                       <div class="field">
                          <input class="input" type="email" placeholder="Insert the destination email" v-model="destinationEmail">
                                 <button class="button is-success is-medium" v-on:click="shareInfo">Share</button>
                      </div>
                    </div>
                </div>
            </div>
        </b-modal>
    </div>

    <div v-if ="this.loadedQuestions==true">
    <div class="columns">
      <div class="column is-two-thirds"></div>
      <div class="column">
        <div v-if ="this.globalOffset>0">
        <button class="button is-rounded bottomButtons" v-on:click="previousPageClicked">Previous Page</button>
        </div>
      </div>
      <div class="column"><button class="button is-rounded bottomButtons" v-on:click="nextPageClicked">Next Page</button></div>
    </div>
    </div>
  </section>

</template>

<script>
  import axios from 'axios';

  export default  {
    name: 'ListScreen',
    props: {
      filter: { 
        required: false,
      },
    },

    mounted() {
      this.initOffset();
      this.getQuestions();
    },
    data() {
      var globalOffset;
      var limit = 10;
      var questions;
      var destinationEmail;
      var filterInput;
      var tempFilt;
      var  answeredQuestions = [0];
      var isSearchBarActive = true;
      var loadedQuestions = false
      return { 
        globalOffset,   
        limit,
        questions,
        destinationEmail :"",
        filterInput,
        tempFilt,
        isShareActive: false,
        isSearchBarActive,
        loadedQuestions,
        answeredQuestions
      }
    },
    methods: {
      initOffset : function() {

        if(window.sessionStorage.getItem("offset")==undefined){
           window.sessionStorage.setItem("offset","0");
        }

        this.globalOffset = parseInt(window.sessionStorage.getItem("offset"));
      },

      getQuestions : function() {
        var offset = parseInt(window.sessionStorage.getItem("offset"));
        if(this.filter != undefined){
            this.isSearchBarActive = true;
            this.$refs.search.focus();
            this.filterInput = this.filter;
           this.$http.get(`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/questions?`+ this.limit+'&'+offset+'&'+this.filter).
           then(response => {
             this.questions = response.body;
             this.loadedQuestions = true;
          }, response => {
              this.questions = [];
          });
        }else{
          if(this.$route.path.includes('questionfilter')){
             this.isSearchBarActive = true;
             this.$refs.search.focus();       
          }else{
             this.isSearchBarActive = false;
          }
          this.$http.get(`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/questions?`+ this.limit+'&'+offset+'&').then(response => {
            this.questions = response.body;
            this.loadedQuestions = true;
          }, response => {
            this.questions = [];
          });
        }
        
      },

      shareInfo : function() {
         var offset = parseInt(window.sessionStorage.getItem("offset"));
          if(!this.destinationEmail.includes("@")|| this.destinationEmail.length <3){
            this.$toast.open({ message: 'Please insert a valid email!', type: 'is-danger'});
          }else{
            if(this.filter == undefined){
              this.tempFilt= '';
            }else{
              this.tempFilt = this.filter;
            }
            this.$http.post('https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/share?'+this.destinationEmail+'&'
            +`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/questions?`+ this.limit+'&'+offset+'&'+this.tempFilt).then(response => { 
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

      confirmClicked : function(question){
        if(this.answeredQuestions.includes(question.id)){
          this.$toast.open({ message: 'You already answered to this question!', type: 'is-danger'});
          this.clearRadioButtons(question.id);
        }else{
            if(document.querySelector('input[name="questionsRadioButtons"]:checked')==null){
               this.$toast.open({ message: 'You have to make a choice before confirming!', type: 'is-danger'});
            }else{
               var choicePos= document.querySelector('input[name="questionsRadioButtons"]:checked').value;
              question.choices[choicePos].votes += 1;

              this.$http.put('https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/questions/'+question.id,JSON.stringify(question)).then(response => { 
                  if(response.status==201){
                      this.answeredQuestions.push(question.id);
                      this.$toast.open({ message: 'Answer submitted with success!', type: 'is-success'});
                      this.clearRadioButtons(question.id);

                  }else{
                      this.$toast.open({ message: 'Bad Request. Please try again!', type: 'is-danger'});
                  }
                }, response => {
                      this.$toast.open({ message: 'An error ocurred while submitting your answer. Please try again!', type: 'is-danger'});
              });
            }
        }  
      },

      clearRadioButtons: function(questionId){
          var radList = document.getElementsByName('questionsRadioButtons');
          // radList contains the radio buttons from the 10 questions, we need to restrict it to the exact questionId radio buttons
          // f(1) = 0 f(2) = 4 f(3) = 8 f(4) = 12
          var index = (questionId-1)*4;
          for (var k = index; k <= index+4; k++) {
            if(radList[k].checked) radList[k].checked = false
          }            
      },

      onBlurInput : function() {
        if(this.filterInput != undefined){
          this.filter = this.filterInput;
          this.$http.get(`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/questions?`+ this.limit+'&'+this.offset+'&'+this.filter).then(response => {
             this.questions = response.body;
          }, response => {
              this.questions = [];
          });
        }
      },

      nextPageClicked : function() {
        var offset =  parseInt(window.sessionStorage.getItem("offset"));
        offset += 10;
        window.sessionStorage.setItem("offset",offset.toString());
        this.$http.get(`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/questions?`+ this.limit+'&'+offset+'&'+this.filter).then(response => {
             this.questions = response.body;
             window.location.reload();
          }, response => {
              this.questions = [];
          });
      },

      previousPageClicked : function() {
        var offset =  parseInt(window.sessionStorage.getItem("offset"));
        offset -= 10;
        window.sessionStorage.setItem("offset",offset.toString());
        this.$http.get(`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/questions?`+ this.limit+'&'+offset+'&'+this.filter).then(response => {
             this.questions = response.body;
             window.location.reload();
          }, response => {
              this.questions = [];
          });
      }
    },
    computed: {

    }
}
</script>

<style scoped>
.is-success{
  background-color:  rgb(1, 158, 1);
  margin:auto;
  display:block;
  margin-top: 5%;
}
.list-screen{
  margin-top: 3%;
  margin-left: 5%;
  margin-right: 5%; 

}
.card-footer-item{
  color: black;
}

.shareButton{
  margin-left: -40%;
  width: 35%;
}

.filterBar{
  margin-bottom: 4%;
}

.bottomButtons{
  margin-top: 2.5%;
  margin-bottom: 5%;
}

</style>
