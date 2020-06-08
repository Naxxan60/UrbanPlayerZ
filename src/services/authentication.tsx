import firebase from "firebase";
import FirebaseService from "./firebase-service";

export default class AuthentificationService {

    static async InitAuthentification() {
        FirebaseService.initFirebaseDb()
        await new Promise((resolve, reject) => {
            const unsubscribe = firebase.auth().onAuthStateChanged(user => {
                unsubscribe();
                resolve(user);
            }, reject);
        });
        if (firebase.auth().currentUser){
            AuthentificationService.isAuthenticated = true
        } else {
            AuthentificationService.isAuthenticated = false
        }
        return AuthentificationService.isAuthenticated
    }
    static SetAuthenticated(newValue: boolean) {
        AuthentificationService.isAuthenticated = newValue
    }
    static GetCurrentUser() {
        return firebase.auth().currentUser;
    }
    static isAuthenticated: boolean = false;

    static login(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    }

    static LogOut(): Promise<void> {
        return firebase.auth().signOut();
    }

    static CreateAccount(email: string, firstname: string, lastname: string, password: string): Promise<firebase.auth.UserCredential> {
        return firebase.auth().createUserWithEmailAndPassword(email, password)

        let data = {
            name: 'Los Angeles',
            state: 'CA',
            country: 'USA'
        };

        FirebaseService.database.collection("Users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.get('test')}`);
            });
        });
        const userRef = FirebaseService.database.collection("Users").add({
            fullname: data.name,
            email: data.state
        });
    }
}