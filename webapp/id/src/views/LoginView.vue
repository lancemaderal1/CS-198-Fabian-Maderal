<script lang = "ts">
import FilSys from "../components/FilSys.vue";
import {loginUser} from "../firebaseinit";
import {useNotificationStore} from "@dafcoe/vue-notification/dist/vue-notification.common"

export default {
  name: "LoginView",
  components: {
    FilSys,
  },
  data() {
    return {
      // details: {
      //   id: "1ujrbtlKg8Tjvf8N09i8",
      //   studentNumber: "201800680",
      //   emailAddress: "ldmaderal1@up.edu.ph",
      // },
      student: {
        uuid: "3fb3f6cd-3e7c-43ce-b429-8740a8afd4b3",
        studentNumber: "201800680",
        emailAddress: "lanceandremaderal@gmail.com",
        password: "cs199",
      },
      details: {
        uuid: "",
        index: "",
        key: ""
      },
      showPassword: false,
    }
  },
  methods: {
    toggleShow(){
      this.showPassword = !this.showPassword;
    },
    async onSubmit() {
      this.details.uuid = this.student.uuid
      this.details.key = this.student.uuid + this.student.password
      var indexString = this.student.uuid + this.student.studentNumber + this.student.emailAddress
      this.details.index = this.$CryptoJS.SHA256(indexString).toString();
      console.log("pressed");
      const userData = await loginUser(this.details)
      console.log(userData)
      if(userData == null){
        const notification = {
          message: "No Matching Information" ,
          showIcon: false,
          type: "warning",
          showDurationProgress: false,
          duration: 5000,
        }
        const { setNotification } = useNotificationStore()
        setNotification(notification);
      }
      else{
        if(userData != 1 && userData != 0){
          userData.user.name = this.$CryptoJS.AES.decrypt(userData.user.name, this.details.key).toString(this.$CryptoJS.enc.Utf8)
          userData.user.studentNumber = this.$CryptoJS.AES.decrypt(userData.user.studentNumber, this.details.key).toString(this.$CryptoJS.enc.Utf8)
          userData.user.course = this.$CryptoJS.AES.decrypt(userData.user.course, this.details.key).toString(this.$CryptoJS.enc.Utf8)
          userData.user.emailAddress = this.$CryptoJS.AES.decrypt(userData.user.emailAddress, this.details.key).toString(this.$CryptoJS.enc.Utf8)
          userData.user.uuid = this.$CryptoJS.AES.decrypt(userData.user.uuid, this.details.key).toString(this.$CryptoJS.enc.Utf8)
          
          var toSend = [userData.user.uuid,userData.user.name,userData.user.studentNumber,userData.user.course,userData.user.emailAddress]
          console.log(toSend)
          var msg = "Welcome back to FilSys!"
          this.$router.push({
            name: "Dashboard",
            params: {details: toSend, m: msg},
          });
        }
        else if(userData == 0){
          const notification = {
            message: "No matching user ID!" ,
            showIcon: false,
            type: "warning",
            showDurationProgress: false,
            duration: 5000,
          }
          const { setNotification } = useNotificationStore()
          setNotification(notification);
        }
        else if(userData == 1){
          const notification = {
            message: "Invalid Password" ,
            showIcon: false,
            type: "warning",
            showDurationProgress: false,
            duration: 5000,
          }
          const { setNotification } = useNotificationStore()
          setNotification(notification);
        }
      }
      
    },
  },
}
</script>

<template>
  <div class="container">
    <vue-notification-list position="top-right"></vue-notification-list>
    <FilSys msg="Welcome to FilSys!" />
    <div>
      <h1 class="blue">Log In</h1>
    </div>
    <div class="Wrapper">
      <label for="name" class="Title">FilSys ID</label>
      <div class="Input">
        <input 
          type="text"
          class="form-control"  
          id="name" 
          placeholder="xxxxxxxxxxxxxxxx"
          v-model="student.uuid"
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
          placeholder="*********"
          v-model="student.password"
        >
        <input
          v-else
          type="password"
          class="form-control"
          placeholder="*********"
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
    <router-link to="/">Don't have an Account? Sign Up</router-link>
    <b-button class="button btn" @click="onSubmit">Log In</b-button>
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
  /* margin-left: 77%;  */
  float: right;
  background-color: rgb(0, 151, 189);
}
</style>