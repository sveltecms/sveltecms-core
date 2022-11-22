import { writable, type Writable } from "svelte/store";
import type { RouteData, UserData } from "$Types"
import type { AssetData } from "$Packages/fileUploader/types";

/** Site routes config, it will be set when /admin/+layout.svelte run */
export const Routes:Writable<RouteData[]> = writable([])

/** Is nav open when browsing mobiles or not  */
export const IsNavOpen:Writable<boolean> = writable(false)

/** List of routes that contains categories */
export const CategoriesRoutes:Writable<string[]> = writable([])

/** List of routes that contains tags */
export const TagsRoutes:Writable<string[]> = writable([])

/** List of assets */
export const _assets:Writable<AssetData[]> = writable([])

/** List of users */
export const _users:Writable<UserData[]> = writable([])