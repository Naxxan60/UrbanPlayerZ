export default class ProfilInfo {
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    birthday: string;

    constructor(
        first_name: string,
        last_name: string,
        name: string,
        email: string,
        birthday: string
    ) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.name = name;
        this.email = email;
        this.birthday = birthday;
    }
}