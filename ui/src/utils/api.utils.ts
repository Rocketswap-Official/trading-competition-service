import axios from "axios";
import config from "../config";
import { competitions_store } from "../store";

const base_url = config.is_prod ? 'api/' : 'http://0.0.0.0:2001/'

export async function syncCompetitions() {
    console.log(config.is_prod)
    try {
        const competitions = (await axios.get(`${base_url}get_competitions/`)).data;
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