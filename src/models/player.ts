import Feet from "./feet";
import FieldPosition from "./fieldPosition";
import Country from "./country";

export default class Player {
    id: string;
    age: number;
    lastname: string;
    firstname: string;
    photo: string;
    height: number;
    strongFoot: Feet;
    fieldPositions: Array<FieldPosition>;
    countries: Array<Country>;

    constructor(
        id: string,
        age: number,
        lastname: string,
        firstname: string,
        height: number,
        photo: string,
        strongFoot: Feet,
        fieldPositions: Array<FieldPosition> = [],
        countries: Array<Country> = []
    ) {
        this.id = id;
        this.age = age;
        this.lastname = lastname;
        this.firstname = firstname;
        this.height = height;
        this.photo = photo;
        this.strongFoot = strongFoot;
        this.fieldPositions = fieldPositions;
        this.countries = countries;
    }
}