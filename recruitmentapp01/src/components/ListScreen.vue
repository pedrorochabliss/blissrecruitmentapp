<template>

  <section class="list-screen">
    <div class="columns">
      <div class="column">
        <div class="filterBar">
        <b-field label="Filter">
            <b-input size="is-medium" v-model="filterInput"></b-input>
        </b-field>
        </div>
      </div>
      <div class="column">
        <button class="button is-rounded searchButton" v-on:click="searchClicked" >Search </button>
        <button class="button is-info is-rounded shareButton"  @click="isShareActive = true" >Share </button>
      </div>
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
  

    <div class="columns">
      <div class="column is-four-fifths"></div>
      <div class="column"></div>
      <div class="column"><button align="right" class="button is-rounded nextPageButton">Next page</button></div>
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
      this.getQuestions();
    },
    data() {
      var offset = 0;
      var limit = 10;
      var questions;
      var destinationEmail;
      var filterInput;
      var tempFilt;
      var  answeredQuestions = [0];
      return {    
        offset,
        limit,
        questions,
        destinationEmail :"",
        filterInput,
        tempFilt,
        isShareActive: false,
        answeredQuestions 
      }
    },
    methods: {

      getQuestions : function() {
        
        if(this.filter != undefined && this.filter != ''){
          this.$http.get(`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/questions?`+ this.limit+'&'+this.offset+'&'+this.filter).then(response => {
             this.questions = response.body;
          }, response => {
              this.questions = [];
          });
        }else{
          this.$http.get(`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/questions?`+ this.limit+'&'+this.offset+'&').then(response => {
            this.questions = response.body;
          }, response => {
            this.questions = [];
          });
        }
        
      },

      shareInfo : function() {
          if(!this.destinationEmail.includes("@")|| this.destinationEmail.length <3){
            this.$toast.open({ message: 'Please insert a valid email!', type: 'is-danger'});
          }else{
            if(this.filter == undefined){
              this.tempFilt= '';
            }else{
              this.tempFilt = this.filter;
            }
            this.$http.post('https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/share?'+this.destinationEmail+'&'
            +`https://private-anon-08ab44f3c8-blissrecruitmentapi.apiary-mock.com/questions?`+ this.limit+'&'+this.offset+'&'+this.tempFilt).then(response => { 
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
          var count = 0;
          for (var i=1;i<questionId;i++){
            count += 4;
          }
          for (var k = count; k <= count+4; k++) {
            if(radList[k].checked) radList[k].checked = false
          }            
      },

      searchClicked :function(){
          console.log("entrei");
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
.b-input{
  margin-top: 5%;
  margin-bottom: 15%;
}
.input{
  margin-top: 5%;
}
.shareButton{
  margin-top: 12%;
  width: 30%;
}
.searchButton{
  margin-top: 12%;
  margin-right: 5%;
  width: 30%;
}

.filterBar{
  margin-top: 5%;
}

.nextPageButton{
  margin-top: 2.5%;
  margin-bottom: 5%;

}
</style>
