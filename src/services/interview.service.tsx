import FirebaseService from "./firebase-service";
import { AnswersInterviewType } from "../helper/questions-interview";

export default class InterviewService {
    static INTERVIEW_DBNAME: string = "Interviews";

    static $GetInterviewOf(id: string) {
        return FirebaseService.database.collection(this.INTERVIEW_DBNAME).doc(id).get()
    }

    static TreatGetInterviewOf(document: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> | null) {
        if (!document) {
            return null;
        }
        if (document.exists) {
            let data = document.data()
            if (!data)
                return null;
            let result = new Array<AnswersInterviewType>();
            let keys = Object.keys(data)
            keys.forEach(key => {
                result.push(data![key])
            });
            return result
        } else {
            return null
        }
    }

    static $UpdateInterview(id: string, answers: AnswersInterviewType[]) {
        var interviewRef = FirebaseService.database.collection(this.INTERVIEW_DBNAME).doc(id)
        return interviewRef.update(Object.assign({}, answers))
    }

    static $CheckIfInterviewExist(id: string) {
        return FirebaseService.database.collection(this.INTERVIEW_DBNAME).doc(id).get()
    }

    static $CreateInterview(id: string, answers: AnswersInterviewType[]) {
        return FirebaseService.database.collection(this.INTERVIEW_DBNAME)
            .doc(id)
            .set(Object.assign({}, answers))
    }
}