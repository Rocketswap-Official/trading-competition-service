import axios from "axios";
import config from "../config";
import { competitions_store } from "../store";

const base_url = config.is_prod ? 'api/' : `${constructTestingUrl()}:2001/`

function constructTestingUrl() {
    const url = `${window.location.protocol}//${window.location.hostname}`
    console.log(url)
    return url
}

export async function syncCompetitions() {
    try {
        const competitions = (await axios.get(`${base_url}get_competitions_sorted/`)).data;
        competitions_store.set(competitions)
        console.log(competitions)
    } catch (err) {
        console.log({ err });
    }
}

export async function getTokenInfo(contract_name: string) {
    try {
        const url = `${base_url}get_token_info/${contract_name}`
        console.log(url)
        const token_info = (await axios.get(url)).data;
        console.log(token_info)
        return token_info
    } catch (err) {
        console.log({ err });
    }
}
