import db from "$Database"
import Fetch from "./fetch.server"

export default new class {
    /** Fetch database */
    Fetch = new Fetch(db)
}