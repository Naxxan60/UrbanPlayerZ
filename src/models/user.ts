export default class User {
    id: string;
    email: string;
    birthday: Date

    constructor(
        id: string,
        email: string,
        birthday: Date,
    ) {
        this.id = id;
        this.email = email;
        this.birthday = birthday;
    }
}