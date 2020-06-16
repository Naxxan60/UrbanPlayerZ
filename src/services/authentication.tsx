import firebase from "firebase";
import FirebaseService from "./firebase-service";
import User from "../models/user";

export default class AuthentificationService {
    static private_currentUser: User | null = null;

    static ConnectToFacebook(): Promise<firebase.auth.UserCredential> {
        var provider = new firebase.auth.FacebookAuthProvider()
        provider.addScope('user_birthday');
        return firebase.auth().signInWithPopup(provider)
    }

    static async InitAuthentification() {
        FirebaseService.initFirebaseDb()
        await new Promise((resolve, reject) => {
            const unsubscribe = firebase.auth().onAuthStateChanged(user => {
                unsubscribe();
                resolve(user);
            }, reject);
        });
        if (firebase.auth().currentUser) {
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
        if (this.private_currentUser) {
            return this.private_currentUser;
        }
        const userFromFB = firebase.auth().currentUser
        if (!userFromFB?.uid)
            alert("erreur d'id")
        if (!userFromFB?.email)
            alert("erreur d'email")
        const id = userFromFB!.uid
        const email = userFromFB!.email ? userFromFB!.email : "";
        const birthday = new Date()
        let user = new User(id, email, birthday)
        this.private_currentUser = user;
        return user;
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
    }
}