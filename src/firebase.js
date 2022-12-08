import Firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const app = {
    apiKey: " ",
    authDomain: " ",
    projectId: " ",
    storageBucket: " ",
    messagingSenderId: " ",
    appId: " "
};

const FirebaseApp = Firebase.initializeApp(app);
const db = FirebaseApp.firestore();

export default db;