<script lang="ts">
    export let routes:RouteValueData[]
    import type { RouteValueData } from "$Types"
    import type { DeleteRouteLoad,DeleteRouteRes } from "$Types/api"
    import { postJson } from "$Utils";
    import { newToast } from "$Packages/svelteToasts";
    import { ROUTES } from "$Stores"
    import Route from "./Route.svelte";
    /** handle route deletion */
    async function handleRouteDelete(e:any){
        const route:RouteValueData = e.detail
        // Delete in database
        const apiLoadData:DeleteRouteLoad = route
        const apiResponse:DeleteRouteRes = await postJson(`/routes/${route.ID}/route-delete`,apiLoadData)
        // If route was deleted
        if(apiResponse.ok){
            const newRoutes = routes.filter(data=>data.ID!==route.ID)
            ROUTES.set(newRoutes)
            newToast({type:"ok",msg:apiResponse.msg})
        } 
        // If route was not deleted
        else newToast({type:"error",msg:apiResponse.msg})
    }
</script>

<div class="routes">
    {#each routes as route (route.ID)}
        <Route {route} on:delete={handleRouteDelete}/>
    {/each}
</div>

<style>
    .routes{
        display: flex;
        flex-wrap: wrap;
    }
</style>