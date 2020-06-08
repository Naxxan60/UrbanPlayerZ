import firebase from "firebase";
export default class FirebaseService {

    static database: firebase.firestore.Firestore;

    static GetCurrentUser(): any {
        FirebaseService.initFirebaseDb()
        return firebase.auth().currentUser;
    }

    static async initFirebaseDb() {

        if (FirebaseService.database) { return }
        var firebaseConfig = {
            apiKey: "AIzaSyCUw37XVPKlv7gexsK7WkH57zk3qhRGBO8",
            authDomain: "urbanplayerz-1e042.firebaseapp.com",
            databaseURL: "https://urbanplayerz-1e042.firebaseio.com",
            projectId: "urbanplayerz-1e042",
            storageBucket: "urbanplayerz-1e042.appspot.com",
            messagingSenderId: "914446867811",
            appId: "1:914446867811:web:cdb143086ba3d606374756"
        };

        // Initialize Firebase
        await firebase.initializeApp(firebaseConfig);
        FirebaseService.database = await firebase.firestore();
    }
}