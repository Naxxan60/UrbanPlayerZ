import firebase from "firebase";
import FirebaseService from "./firebase-service";

export default class ProfilService {
    static isAuthenticated: boolean = false;

    static CreateAccount(email: string, firstname: string, lastname: string, password: string): Promise<firebase.auth.UserCredential> {
        FirebaseService.initFirebaseDb()

        let data = {
            name: 'Los Angeles',
            state: 'CA',
            country: 'USA'
        };

        return firebase.auth().createUserWithEmailAndPassword(email, password)

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