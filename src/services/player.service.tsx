import FirebaseService from "./firebase-service";
import Player from "../models/player";

export default class PlayerService {
    static private_currentPlayer: Player | null = null;
    static PLAYERS_DBNAME: string = "Players";

    static async GetCurrentPlayer() {
        const user = FirebaseService.GetCurrentUser()
        if(!user){
            return null
        }
        return await this.GetCurrentPlayerById(user.uid)
    }

    static async GetCurrentPlayerById(id:string) {
        return await FirebaseService.database.collection(this.PLAYERS_DBNAME).doc(id).get()
    }

    static TreatGetCurrentPlayer(document:firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>| null) {
        if(!document){
            return null;
        }
        if (document.exists){
            return document.data() as Player
            
        } else {
            return null
        }
    }

    static CreatePlayer(newPlayer:Player) {
        let id = newPlayer.id
        delete newPlayer.id
        
        let playerRef = FirebaseService.database.collection(this.PLAYERS_DBNAME).doc(id);
        playerRef.get().then(function(document) {
            if (document.exists){
                return
            } else {
                playerRef.set(Object.assign({}, newPlayer))
                .catch(function(error) {
                    console.error("Error creating player: ", error);
                });
            }
        })
        .catch(function(error) {
            alert("Erreur à la création du profil")
            console.error("Error writing player: ", error);
        });
    }

    static $CheckIfPlayerExist(id:string) {
        return FirebaseService.database.collection(this.PLAYERS_DBNAME).doc(id).get()
    }

    static $CreatePlayer(newPlayer:Player): Promise<void> {
        let id = newPlayer.id
        delete newPlayer.id
        
        return FirebaseService.database.collection(this.PLAYERS_DBNAME)
        .doc(id)
        .set(Object.assign({}, newPlayer))
    }

    static $UpdatePlayer(player: Player) {
        var playerRef = FirebaseService.database.collection(this.PLAYERS_DBNAME).doc(player.id)
        return playerRef.update(Object.assign({}, player))
    }

    static calculate_age(birthdate: Date) { 
        var diff_ms = Date.now() - birthdate.getTime();
        var age_dt = new Date(diff_ms); 
      
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }
}