<script lang="ts">
    export let data:PageData
    import type { PageData } from "./$types"
    import type { RouteObjectData } from "$Types";
    import type { DeleteRouteObjectLoad,DeleteRouteObjectRes } from "$Types/api";
    import { postJson } from "$Utils";
    import { newToast } from "$Packages/svelteToasts";
    import Meta from "$Comps/Meta.svelte"
    import PageTitleLink from "$Comps/PageTitleLink.svelte"
    import Objects from "$Comps/routes/objects/Objects.svelte"
    /** Handle route onject deletion */
    async function handleObjectDeletion(e:any) {
        const object:RouteObjectData = e.detail
        const apiLoadData:DeleteRouteObjectLoad = object
        const apiResponse:DeleteRouteObjectRes = await postJson(`/routes/${routeData.ID}/objects/delete`,apiLoadData)
        // If route object was deleted
        if(apiResponse.ok){
            newToast({ type:"ok",msg:apiResponse.msg})
            const newRouteObjects = routeObjects.filter(data=>data._id!==object._id)
            routeObjects = [...newRouteObjects]
        }
        else newToast({ type:"error",msg:apiResponse.msg})
    }
    // Route data
    $: routeData = data.routeData
    $: routeObjects = data.objects
</script>

<Meta {...routeData.meta} />
<div class="page">
    <PageTitleLink title="All {routeData.title}" href="/admin/routes/{routeData.ID}/new-object" linkText="Add object"/>
</div>
<Objects objects={routeObjects} on:delete={handleObjectDeletion}/>