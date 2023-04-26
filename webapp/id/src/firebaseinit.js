import * as firebase from "firebase/app"
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, query, where} from 'firebase/firestore';
import { onUnmounted } from "vue";
import aes from "crypto-js/aes"
import CryptoJS from "crypto-js/crypto-js"

let firebaseConfig = {
    apiKey: "AIzaSyAFlWHh0mNbx1vyOtpphkgfWCEf6wtJ0P8",
    authDomain: "cs199-idph.firebaseapp.com",
    projectId: "cs199-idph",
    storageBucket: "cs199-idph.appspot.com",
    messagingSenderId: "381331143676",
    appId: "1:381331143676:web:c2ee818b2bd99ba1fad079",
    measurementId: "G-KC1ZYLV46X"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)

export const createUser = user => {
  console.log("Creating User");
  try {
    const userRef = addDoc(collection(db, "users"), {
      user
    });
    console.log("Document written with ID: ", userRef.id);
    return userRef
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export const getUser = async index => {
  // const userRef = doc(db,"users",id);
  // const userSnap = await getDoc(userRef);
  console.log("index", index)
  const usersRef = collection(db,"users")
  const userRef = query(usersRef, where("user.index", "==", index))
  const userSnap = await getDocs(userRef);
  var toReturn;
  userSnap.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log("pass")
    console.log(doc.id, " => ", doc.data());
    var temp = doc.data();
    console.log("temp:", temp.user.uuid)
    if(temp.user.index == index){
      toReturn = temp;
    }
    else{
      toReturn = 0;
    }
  });
  return toReturn;
  // if (userSnap.exists()){
  //   return userSnap.data();
  // }
  // else{
  //   console.log("No matching user!");
  //   return 0;
  // }
}

export const loginUser = async details => {

  console.log("console.log(details.index):",details.index)
  const usersRef = collection(db,"users")
  const userRef = query(usersRef, where("user.index", "==", details.index))
  //const userRef = doc(db,"users",details.id);
  const userSnap = await getDocs(userRef);
  console.log(userSnap)
  var toReturn;
  userSnap.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    var temp = doc.data();
    console.log("temp:",temp)
    if(temp.user.index == details.index){
      var decryptedUUID = aes.decrypt(temp.user.uuid, details.key).toString(CryptoJS.enc.Utf8);
      console.log("decryptedUUID", decryptedUUID);
      if(decryptedUUID == details.uuid){
        console.log("pass")
        toReturn = temp;
        console.log(toReturn)
      }
      else{
        toReturn = 1; // wrong key
      }
    }
  });

  return toReturn;

}

export const checkPassword = async details => {
  console.log("console.log(index):",details.index)
  const usersRef = collection(db,"users")
  const userRef = query(usersRef, where("user.index", "==", details.index))
  const userSnap = await getDocs(userRef);
  console.log(userSnap)
  var toReturn;
  userSnap.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    var temp = doc.data();
    if(temp.user.index == details.index){
      var decryptedUUID = aes.decrypt(temp.user.uuid, details.key).toString(CryptoJS.enc.Utf8);
      console.log("decrypt:", decryptedUUID)
      if(decryptedUUID == details.uuid){
        toReturn = true;
      }
    }
  })
  console.log(toReturn);
  return toReturn;
}

export const updateUserDetails = async details => {
  const usersRef = collection(db,"users")
  const userRef = query(usersRef, where("user.index", "==", details.index))
  const userSnap = await getDocs(userRef);
  var id;
  userSnap.forEach((doc) => { 
    console.log(doc.id, " => ", doc.data());
    id = doc.id
  })
  const docRef = doc(db,"users",id)
  const docUpdate = await updateDoc(docRef, {
    user: {
      uuid: details.uuid,
      name: details.name,
      studentNumber: details.studentNumber,
      course: details.course,
      emailAddress: details.emailAddress,
      index: details.newIndex,
    } 
  });
  return docUpdate;
  
}



export const deleteUser = id => {
  return usersCollection.doc(id).delete()
}

export const loadUsers = () => {
  const users = ref([])
  const close = usersCollection.onSnapshot(snapshot => {
    users.value = snapshot.docs.map(doc => ({id: doc.id, ...doc.data() }))
  })
    onUnmounted(close)
    return users
}





