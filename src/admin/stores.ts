import { writable, type Writable } from "svelte/store";
import type { RouteData, UserData } from "$Types"
import type { AssetData } from "$Packages/fileUploader/types";

/** Is nav open when browsing mobiles or not  */
export const IsNavOpen:Writable<boolean> = writable(false)
export const IS_NAV_OPEN:Writable<boolean> = writable(false)

/** Site routes config, it will be set when /admin/+layout.svelte run */
export const Routes:Writable<RouteData[]> = writable([])
export const ROUTES:Writable<RouteData[]> = writable([])

/** List of routes that contains categories */
export const CategoriesRoutes:Writable<string[]> = writable([])
export const CATEGORIES_ROUTES:Writable<string[]> = writable([])

/** List of routes that contains tags */
export const TagsRoutes:Writable<string[]> = writable([])
export const TAGS_ROUTES:Writable<string[]> = writable([])

/** List of assets */
export const _assets:Writable<AssetData[]> = writable([])
export const ASSETS:Writable<AssetData[]> = writable([])

/** List of users */
export const _users:Writable<UserData[]> = writable([])
export const USERS:Writable<UserData[]> = writable([])