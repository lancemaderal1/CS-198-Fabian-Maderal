<script lang = "ts">
import FilSys from "../components/FilSys.vue";
import {createUser, getUser} from "../firebaseinit.js";
import {useNotificationStore} from "@dafcoe/vue-notification/dist/vue-notification.common"
import { v4 as uuidv4 } from "uuid";

export default {
  components: {
    FilSys,
  },
  name: "SignupView",
  data() {
    return {
      student: {
        uuid: "",
        name: "Lance Maderal",
        studentNumber: "201800680",
        course: "BS CS",
        emailAddress: "lancemaderal@mail.com",
        password: "cs199"
      },
      encrypted:{
        uuid: "",
        name: "",
        studentNumber: "",
        course: "",
        emailAddress: "",
        index: ""
      },
      key: "",
      showPassword: false,
      showToast: false,
    }
  },
  methods: {
    toggleShowPassword(){
      return {
        "fa-eye-slash": this.showPassword == true,
        "fa-eye": this.showPassword == false
      }
    },
    toggleShow(){
      this.showPassword = !this.showPassword;
    },
    encrypt() {
      this.key = this.student.uuid + this.student.password;
      console.log("this.key:", this.key)
      this.encrypted.index = this.student.uuid + this.student.studentNumber + this.student.emailAddress;
      this.encrypted.name = this.$CryptoJS.AES.encrypt(this.student.name, this.key).toString();
      this.encrypted.studentNumber = this.$CryptoJS.AES.encrypt(this.student.studentNumber, this.key).toString();
      this.encrypted.course = this.$CryptoJS.AES.encrypt(this.student.course, this.key).toString();
      this.encrypted.emailAddress = this.$CryptoJS.AES.encrypt(this.student.emailAddress, this.key).toString();
      this.encrypted.uuid = this.$CryptoJS.AES.encrypt(this.student.uuid, this.key).toString();
      
      console.log("Name:", this.encrypted.name)
      console.log("Student Number", this.encrypted.studentNumber)
      console.log("Course: ", this.encrypted.course)
      console.log("Email Address", this.encrypted.emailAddress)

      this.encrypted.index = this.$CryptoJS.SHA256(this.encrypted.index).toString();
      console.log("AES Key:", this.encrypted.index)
    },
    async onSubmit() {
      console.log("pressed");
      // generate student uuid
      this.student.uuid = uuidv4()
      console.log("uuid:", this.student.uuid)

      this.encrypt();

      console.log(this.encrypted)

      const user = await createUser(this.encrypted)
      
      const userData = await getUser(this.encrypted.index)

      if(typeof userData === undefined){
        const fail = {
            message: "An error has occurred" ,
            position: "top-right",
            showIcon: false,
            type: "alert",
            showDurationProgress: false,
            duration: 5000,
        }
        const { setNotification } = useNotificationStore()
        setNotification(fail)
      }
      else{
        userData.user.name = this.$CryptoJS.AES.decrypt(userData.user.name, this.key).toString(this.$CryptoJS.enc.Utf8)
        userData.user.studentNumber = this.$CryptoJS.AES.decrypt(userData.user.studentNumber, this.key).toString(this.$CryptoJS.enc.Utf8)
        userData.user.course = this.$CryptoJS.AES.decrypt(userData.user.course, this.key).toString(this.$CryptoJS.enc.Utf8)
        userData.user.emailAddress = this.$CryptoJS.AES.decrypt(userData.user.emailAddress, this.key).toString(this.$CryptoJS.enc.Utf8)
        userData.user.uuid = this.$CryptoJS.AES.decrypt(userData.user.uuid, this.key).toString(this.$CryptoJS.enc.Utf8)

        var toSend = [userData.user.uuid,userData.user.name,userData.user.studentNumber,userData.user.course,userData.user.emailAddress]
        var msg = "Welcome to Filsys! Please save your ID"
        console.log(toSend, msg)
        this.$router.push({
          name: "Dashboard",
          params: {details: toSend, m: msg},
        });
      }
      
    },
  },

}
</script>

<template>
  <div class="container">
    <!-- <vue-notification-list></vue-notification-list>
    <button class="button btn" @click="click">click</button> -->
    <FilSys msg="Welcome to FilSys!" />
    <div>
      <h1 class="blue">Sign Up</h1>
    </div>
    <div class="Wrapper">
    <label for="name" class="Title">Name</label>
    <div class="Input">
      <input 
        type="text"
        class="form-control"  
        id="name" 
        placeholder="Juan Dela Cruz"
        v-model="student.name"
      >
    </div>
  </div>
  <div class="Wrapper">
    <label class="Title">Student Number</label>
    <div class="Input">
      <input 
        type="text"
        class="form-control"  
        placeholder="202212345"
        v-model="student.studentNumber"
      >
    </div>
  </div>
  <div class="Wrapper">
    <label class="Title">Course</label>
    <div class="Input">
      <input 
        type="text"
        class="form-control"  
        placeholder="BS Computer Science"
        v-model="student.course"
      >
    </div>
  </div>
  <div class="Wrapper">
    <label class="Title">Email address</label>
    <div class="Input">
      <input 
        type="email"
        class="form-control"  
        placeholder="jdelecruz@example.com"
        v-model="student.emailAddress"
      >
    </div>
  </div>
  <div class="Wrapper">
    <label class="Title">Password</label>
    <div class="input-group">
      <input 
        v-if="showPassword"
        type="text"
        class="form-control"  
        placeholder="Enter Password"
        v-model="student.password"
      >
      <input
        v-else
        type="password"
        class="form-control"
        placeholder="Enter Password"
        v-model="student.password"
      />
      <button class="btn btn-outline-secondary" @click="toggleShow">
        <div v-if="showPassword == true">
          <i class="fas fa-eye"></i>
        </div>
        <div v-else-if="showPassword == false">
          <i class="fas fa-eye-slash"></i>
        </div>
      </button>
    </div>
  </div>
  <div id="HASH">
    <router-link to="/login">Have an Account? Login instead</router-link>
    <b-button class="button btn" @click="onSubmit">Sign Up</b-button>
  </div>
  
    
  </div>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Dosis');

.HASH {
  padding-top: 1%;
  display: flex;
  justify-content: space-between;
}

.Wrapper {
  padding-bottom: 1%;
}

.Title {
  color: #0f0f0f;
  margin: 0 0 var(--gutterXx) 0;
  padding: 3px;
  font-size: var(--fontSizeXx);
  font-weight: 400;
  line-height: var(--lineHeightSm);
  text-align: center;
  text-shadow: -0.1rem 0.1rem 0.2rem var(--colorPrimary800);
}

.Input {
  position: relative;
}

.button {
  float: right;
  background-color: rgb(0, 151, 189);
}
</style>