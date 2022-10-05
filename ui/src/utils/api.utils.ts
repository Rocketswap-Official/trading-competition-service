import axios from "axios";
import { competitions_store } from "../store";

export async function syncCompetitions() {
    try {
        const competitions = (await axios.get("http://0.0.0.0:2001/get_competitions/")).data;
        competitions_store.set(competitions)
        console.log(competitions)
    } catch (err) {
        console.log({ err });
    }
}

export async function getCompetitionData(id: string) {
    try {
        return (await axios.get("http://0.0.0.0:2001/get_competition_data/")).data;
    } catch (err) {
        console.log(err)
    }
}