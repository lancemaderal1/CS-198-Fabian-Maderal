<script>
import {useNotificationStore} from "@dafcoe/vue-notification/dist/vue-notification.common"
import {updateUserDetails, checkPassword} from "../firebaseinit.js"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

export default {
    name: "DashBoard",
    props: ['details','m'],
    data() {
        return {
            id: this.details[0],
            user: {
                name: this.details[1],
                studentNumber: this.details[2],
                course: this.details[3],
                emailAddress: this.details[4],
            },
            index: "",
            password: "cs199",
            showPassword: false,
            repeatPassword: "cs199",
            showRepeatPassword: false,
            showPasswordModal: false,
            key: "",
            readOnly: true,

            newPassword: "",
            showNewPassword: false,
            repeatNewPassword: "",
            showRepeatNewPassword: false,
            showEditPasswordModal: false,
        }
    },
    methods: {
        toggleShow(){
            this.showPassword = !this.showPassword;
        },
        editToggleShow(){
            this.showNewPassword = !this.showNewPassword
        },
        repeatEditToggleShow(){
            this.showRepeatNewPassword = !this.showRepeatNewPassword
        },
        repeatToggleShow(){
            this.showRepeatPassword = !this.showRepeatPassword
        },
        async onSubmit(){
            if (this.password == this.repeatPassword){
                this.index = this.id + this.user.studentNumber + this.user.emailAddress
                console.log("index:",this.index)
                var indexSHA256 = this.$CryptoJS.SHA256(this.index).toString();
                console.log("indexSHA256: ", indexSHA256)
                this.key = this.id + this.password
                var details = {
                    uuid: this.id,
                    index: indexSHA256,
                    key: this.key,
                }
                const pass = await checkPassword(details)
                console.log("pass", pass)
                if(pass){
                    this.readOnly = false;
                    this.showPasswordModal = false;
                    this.password = "";
                    this.repeatPassword = "";
                    this.showPassword = false;
                    this.showRepeatPassword = false;
                }
                else{
                    const fail = {
                    message: "Wrong Password" ,
                    position: "top-right",
                    showIcon: false,
                    type: "alert",
                    showDurationProgress: false,
                    duration: 5000,
                    }
                    const { setNotification } = useNotificationStore()
                    setNotification(fail)
                    this.cancel()
                }
            }
            else{
                const fail = {
                message: "Passwords do not match" ,
                position: "top-right",
                showIcon: false,
                type: "alert",
                showDurationProgress: false,
                duration: 5000,
                }
                const { setNotification } = useNotificationStore()
                setNotification(fail)
                this.cancel()
            }
        },
        async onSubmitEdit(){
            if (this.password == this.repeatPassword && this.password != "" && this.repeatPassword != ""){
                if(this.newPassword == this.repeatNewPassword && this.newPassword != "" && this.repeatNewPassword != ""){
                    this.index = this.id + this.user.studentNumber + this.user.emailAddress
                    var indexSHA256 = this.$CryptoJS.SHA256(this.index).toString();
                    this.key = this.id + this.password
                    var details = {
                        uuid: this.id,
                        index: indexSHA256,
                        key: this.key,
                    }
                    const pass = await checkPassword(details)
                    console.log("pass", pass)
                    if(pass){
                        this.password = "";
                        this.repeatPassword = "";
                        this.showPassword = false;
                        this.showRepeatPassword = false;

                        //work here
                        var newKey = this.id + this.newPassword
                        var update = {
                            index: indexSHA256,
                            uuid: this.$CryptoJS.AES.encrypt(this.id,newKey).toString(),
                            name: this.$CryptoJS.AES.encrypt(this.user.name,newKey).toString(),
                            studentNumber: this.$CryptoJS.AES.encrypt(this.user.studentNumber,newKey).toString(),
                            course: this.$CryptoJS.AES.encrypt(this.user.course,newKey).toString(),
                            emailAddress: this.$CryptoJS.AES.encrypt(this.user.emailAddress,newKey).toString(),
                            newIndex: this.$CryptoJS.SHA256(this.index).toString()
                        }

                        const success = {
                            message: "Your Password was successfully updated" ,
                            position: "top-right",
                            showIcon: false,
                            type: "info",
                            showDurationProgress: false,
                            duration: 5000,
                        }
                        const fail = {
                            message: "An error has occurred" ,
                            position: "top-right",
                            showIcon: false,
                            type: "alert",
                            showDurationProgress: false,
                            duration: 5000,
                        }
                        const { setNotification } = useNotificationStore()
                        const updateUser = updateUserDetails(update).then(
                            result => {
                                console.log(result)
                                setNotification(success)    
                            }
                        ).catch( error => {
                            setNotification(fail)
                            }
                        )


                        this.newPassword = "" 
                        this.repeatNewPassword = ""
                        this.showNewPassword = false
                        this.showRepeatNewPassword = false

                        this.showEditPasswordModal = false
                    }
                    else{
                        const fail = {
                        message: "Wrong Password" ,
                        position: "top-right",
                        showIcon: false,
                        type: "alert",
                        showDurationProgress: false,
                        duration: 5000,
                        }
                        const { setNotification } = useNotificationStore()
                        setNotification(fail)
                        this.cancelEdit()
                    }
                }
                else{
                    const fail = {
                    message: "Passwords do not match" ,
                    position: "top-right",
                    showIcon: false,
                    type: "alert",
                    showDurationProgress: false,
                    duration: 5000,
                    }
                    const { setNotification } = useNotificationStore()
                    setNotification(fail)
                    this.cancelEdit()
                }
            }
            else{
                const fail = {
                message: "Passwords do not match" ,
                position: "top-right",
                showIcon: false,
                type: "alert",
                showDurationProgress: false,
                duration: 5000,
                }
                const { setNotification } = useNotificationStore()
                setNotification(fail)
                this.cancelEdit()
            }
        },
        edit(){
            this.readOnly = false
        },
        cancel(){
            this.readOnly = true
            this.showPasswordModal = false;
            this.password = "";
            this.repeatPassword = "";
            this.showPassword = false;
            this.showRepeatPassword = false;
        },
        cancelEdit(){
            this.readOnly = true
            this.showEditPasswordModal = false;
            this.password = "";
            this.repeatPassword = "";
            this.showPassword = false;
            this.showRepeatPassword = false;
        },
        save(){
            var indexUpdate = this.id + this.user.studentNumber + this.user.emailAddress
            var indexSHA256 = this.$CryptoJS.SHA256(this.index).toString();
            var update = {
                index: indexSHA256,
                uuid: this.$CryptoJS.AES.encrypt(this.id, this.key).toString(),
                name: this.$CryptoJS.AES.encrypt(this.user.name, this.key).toString(),
                studentNumber: this.$CryptoJS.AES.encrypt(this.user.studentNumber, this.key).toString(),
                course: this.$CryptoJS.AES.encrypt(this.user.course, this.key).toString(),
                emailAddress: this.$CryptoJS.AES.encrypt(this.user.emailAddress, this.key).toString(),
                newIndex:this.$CryptoJS.SHA256(indexUpdate).toString(),
            }
            console.log("update:",update)

            const success = {
                message: "Your information was successfully updated" ,
                position: "top-right",
                showIcon: false,
                type: "info",
                showDurationProgress: false,
                duration: 5000,
            }
            const fail = {
                message: "An error has occurred" ,
                position: "top-right",
                showIcon: false,
                type: "alert",
                showDurationProgress: false,
                duration: 5000,
            }
            const { setNotification } = useNotificationStore()
            const updateUser = updateUserDetails(update).then(
                result => {
                    console.log(result)
                    setNotification(success)    
                }
            ).catch( error =>{
                console.log(error)
                setNotification(error)
                }
            )

            this.readOnly = true
        }
    },
    mounted() {
        console.log(this.m)
        const notification = {
            message: this.m ,
            position: "top-right",
            showIcon: false,
            type: "info",
            showDurationProgress: false,
            duration: 5000,
        }
        const { setNotification } = useNotificationStore()
        setNotification(notification);
    }
}
</script>

<template>
    <div class=container>
        <vue-notification-list position="top-right"></vue-notification-list>
        <div>
            <h1 class="blue">Welcome to FilSys!</h1>
        </div>
        <p></p>
        <div class="Wrapper">
            <label for="name" class="Title">FilSys ID</label>
            <div class="Input">
                <input 
                type="text"
                class="form-control"  
                id="name" 
                v-model="this.id"
                readonly
                >
            </div>
        </div>
        <div class="Wrapper">
            <label for="name" class="Title">Name:</label>
            <div class="Input">
                <input 
                type="text"
                class="form-control"  
                id="name" 
                v-model="this.user.name"
                :readonly="this.readOnly"
                >
            </div>
        </div>
        <div class="Wrapper">
            <label for="name" class="Title">Student Number:</label>
            <div class="Input">
                <input 
                type="text"
                class="form-control"  
                id="name" 
                v-model="this.user.studentNumber"
                :readonly="this.readOnly"
                >
            </div>
        </div>
        <div class="Wrapper">
            <label for="name" class="Title">Course:</label>
            <div class="Input">
                <input 
                type="text"
                class="form-control"  
                id="name" 
                v-model="this.user.course"
                :readonly="this.readOnly"
                >
            </div>
        </div>
        <div class="Wrapper">
            <label for="name" class="Title">Email Address:</label>
            <div class="Input">
                <input 
                type="text"
                class="form-control"  
                id="name" 
                v-model="this.user.emailAddress"
                :readonly="this.readOnly"
                >
            </div>
        </div>
        
        <div v-if="this.readOnly == true">
            <b-button class="cancel btn btn-primary"  @click="showEditPasswordModal = !showEditPasswordModal">Change Password</b-button>
            <b-button class="button btn" id="show-btn" @click="showPasswordModal = !showPasswordModal">Edit Details</b-button>
        </div>
        <div v-else-if="this.readOnly == false">
            <b-button class="cancel btn btn-danger" @click="cancel">Cancel</b-button>
            <b-button class="button btn" @click="save">Save Changes</b-button>
        </div> 
        <b-modal v-model="showPasswordModal" id="passwordModal" hide-header-close no-close-on-backdrop hide-footer title="Enter Password">
            <div class="Wrapper">
                <label >Password</label>
                <div class="input-group">
                    <input 
                    v-if="showPassword"
                    type="text"
                    class="form-control"  
                    placeholder="Enter Password"
                    v-model="password"
                    >
                    <input
                    v-else
                    type="password"
                    class="form-control"
                    placeholder="Enter Password"
                    v-model="password"
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
            <div class="Wrapper">
                <label>Repeat Password</label>
                <div class="input-group">
                    <input 
                    v-if="showRepeatPassword"
                    type="text"
                    class="form-control"  
                    placeholder="Re-enter Password"
                    v-model="repeatPassword"
                    >
                    <input
                    v-else
                    type="password"
                    class="form-control"
                    placeholder="Re-enter Password"
                    v-model="repeatPassword"
                    />
                    <button class="btn btn-outline-secondary" @click="repeatToggleShow">
                        <div v-if="showRepeatPassword == true">
                        <i class="fas fa-eye"></i>
                        </div>
                        <div v-else-if="showRepeatPassword == false">
                        <i class="fas fa-eye-slash"></i>
                        </div>
                    </button>
                </div>
            </div>
            <b-button type="button" class="cancel btn btn-secondary" @click="cancel">Close</b-button>
            <b-button type="button" class="button btn" @click="onSubmit" >Submit</b-button>
        </b-modal>

        <b-modal v-model="showEditPasswordModal" hide-header-close no-close-on-backdrop hide-footer title="Change Password">
            <div class="Wrapper">
                <label >Current Password</label>
                <div class="input-group">
                    <input 
                    v-if="showPassword"
                    type="text"
                    class="form-control"  
                    placeholder="Enter Current Password"
                    v-model="password"
                    >
                    <input
                    v-else
                    type="password"
                    class="form-control"
                    placeholder="Enter Current Password"
                    v-model="password"
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
            <div class="Wrapper">
                <label>Repeat Current Password</label>
                <div class="input-group">
                    <input 
                    v-if="showRepeatPassword"
                    type="text"
                    class="form-control"  
                    placeholder="Re-enter Current Password"
                    v-model="repeatPassword"
                    >
                    <input
                    v-else
                    type="password"
                    class="form-control"
                    placeholder="Re-enter Current Password"
                    v-model="repeatPassword"
                    />
                    <button class="btn btn-outline-secondary" @click="repeatToggleShow">
                        <div v-if="showRepeatPassword == true">
                        <i class="fas fa-eye"></i>
                        </div>
                        <div v-else-if="showRepeatPassword == false">
                        <i class="fas fa-eye-slash"></i>
                        </div>
                    </button>
                </div>
            </div>
            <div class="Wrapper">
                <label >New Password</label>
                <div class="input-group">
                    <input 
                    v-if="showNewPassword"
                    type="text"
                    class="form-control"  
                    placeholder="Enter New Password"
                    v-model="newPassword"
                    >
                    <input
                    v-else
                    type="password"
                    class="form-control"
                    placeholder="Enter New Password"
                    v-model="newPassword"
                    />
                    <button class="btn btn-outline-secondary" @click="editToggleShow">
                        <div v-if="showNewPassword == true">
                        <i class="fas fa-eye"></i>
                        </div>
                        <div v-else-if="showNewPassword == false">
                        <i class="fas fa-eye-slash"></i>
                        </div>
                    </button>
                </div>
            </div>
            <div class="Wrapper">
                <label>Repeat New Password</label>
                <div class="input-group">
                    <input 
                    v-if="showRepeatNewPassword"
                    type="text"
                    class="form-control"  
                    placeholder="Re-enter New Password"
                    v-model="repeatNewPassword"
                    >
                    <input
                    v-else
                    type="password"
                    class="form-control"
                    placeholder="Re-enter New Password"
                    v-model="repeatNewPassword"
                    />
                    <button class="btn btn-outline-secondary" @click="repeatEditToggleShow">
                        <div v-if="showRepeatNewPassword == true">
                        <i class="fas fa-eye"></i>
                        </div>
                        <div v-else-if="showRepeatNewPassword == false">
                        <i class="fas fa-eye-slash"></i>
                        </div>
                    </button>
                </div>
            </div>
            <b-button type="button" class="cancel btn btn-secondary" @click="cancelEdit">Close</b-button>
            <b-button type="button" class="button btn" @click="onSubmitEdit" >Submit</b-button>
        </b-modal>
    </div>
    <!-- <div class="modal fade" id="enterPassword" tabindex="-1" aria-labelledby="enterPasswordLabel" aria-hidden="true" >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="enterPasswordLabel">Enter Password</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            </div>
            <div class="modal-body">
                
            </div>
            <div class="modal-footer">
                
            </div>
        </div>
    </div> -->
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Dosis');

.container {
padding-left: 1%;
padding-top: 5%;
}

.Wrapper {
  padding-bottom: 1%;
}

.Title {
color: #0f0f0f;
margin: 0 0 var(--gutterXx) 0;
padding-top: 10px;
font-size: var(--fontSizeXx);
font-weight: 400;
line-height: var(--lineHeightSm);
text-align: center;
text-shadow: -0.1rem 0.1rem 0.2rem var(--colorPrimary800);
}

.Input {
position: relative;
}

.Input-text {
display: block;
margin: 0;
margin-bottom: 5px;
padding: 10px;
color: #111111;
width: 100%;
font-family: inherit;
font-size: var(--inputFontSize);
font-weight: inherit;
line-height: var(--inputLineHeight);
border: none;
border-radius: 0.4rem;
transition: box-shadow var(--transitionDuration);
}

.Input-text::placeholder {
color: #111111;
}

.button {
float: right;
margin-top: 10px;
margin-left: 10px;
background-color: rgb(0, 151, 189);
}

.cancel {
float: right;
margin-top: 10px;
margin-left: 10px;
}
</style>