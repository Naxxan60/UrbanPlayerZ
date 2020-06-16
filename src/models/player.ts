import Feet from "./feet";
import FieldPosition from "./fieldPosition";
import Country from "./country";

export default class Player {
    id: string;
    firstname: string;
    lastname: string;
    age: number | null;
    photo: string | null;
    height: number | null;
    strongFoot: Feet | null;
    fieldPositions: Array<FieldPosition>;
    countries: Array<Country>;

    constructor(
        id: string,
        firstname: string,
        lastname: string,
        age: number | null = null,
        height: number | null = null,
        photo: string | null = null,
        strongFoot: Feet | null = null,
        fieldPositions: Array<FieldPosition> = [],
        countries: Array<Country> = []
    ) {
        this.id = id;
        this.age = age;
        this.firstname = firstname;
        this.lastname = lastname;
        this.height = height;
        this.photo = photo;
        this.strongFoot = strongFoot;
        this.fieldPositions = fieldPositions;
        this.countries = countries;
    }
}

// Firestore data converter
export const PlayerConverter = {
    toFirestore: function (player: Player) {
        return {
            id: player.id,
            age: player.age,
            firstname: player.firstname,
            lastname: player.lastname,
            height: player.height,
            photo: player.photo,
            strongFoot: player.strongFoot,
            fieldPositions: player.fieldPositions,
            countries: player.countries,
        }
    },
    fromFirestore: function (snapshot: { data: (arg0: any) => any; }, options: any) {
        const data = snapshot.data(options);
        return new Player(data.name, data.state, data.country)
    }
}