import { AnswersInterviewType } from "../helper/questions-interview";

export default class Interview {
    answers: Array<AnswersInterviewType>;

    constructor(
        answers: Array<AnswersInterviewType>
    ) {
        this.answers = answers;
    }
}