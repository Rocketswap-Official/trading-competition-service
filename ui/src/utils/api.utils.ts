import axios from "axios";
import { competitions_store } from "../store";

export async function syncCompetitions() {
    try {
        const competitions = (await axios.get("api/get_competitions/")).data;
        competitions_store.set(competitions)
        console.log(competitions)
    } catch (err) {
        console.log({ err });
    }
}

export async function getCompetitionData(id: string) {
    try {
        return (await axios.get("api/get_competition_data/")).data;
    } catch (err) {
        console.log(err)
    }
}