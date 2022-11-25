import db from "$Database"
import Fetch from "./fetch.js"

export default new class {
    /** Fetch database */
    Fetch = new Fetch(db)
}