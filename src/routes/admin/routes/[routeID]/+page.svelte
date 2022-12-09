<script lang="ts">
    export let data:PageData
    import type { PageData } from "./$types"
    import type { RouteObjectData } from "$Types";
    import type { DeleteRouteObjectLoad,DeleteRouteObjectRes } from "$Types/api";
    import type { FetchRouteObjectsLoad,FetchRouteObjectsRes } from "$Types/cms";
    import svelteCMS from "$svelteCMS";
    import { wait,postJson, capitalize } from "$Utils";
    // Packages
    import { newToast } from "$Packages/svelteToasts";
    import Meta from "$Comps/Meta.svelte"
    // Comps
    import PageTitleLink from "$Comps/PageTitleLink.svelte"
    import Objects from "$Comps/routes/objects/Objects.svelte"
    import Button from "$Comps/Button.svelte"
    import NoResult from "$Comps/NoResult.svelte"
    /** Handle route's object deletion */
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
    /** Load more route objects */
    async function loadMoreRouteObjects() {
        // Set loading more routes
        loadMoreBtnLoading = true
        // Update page number
        pageNumber = pageNumber+1
        // Send api request
        const apiLoad:FetchRouteObjectsLoad = { filter:{},routeID,count:svelteCMS.config.routeObjectsPerPage,pageNumber }
        const apiResponse:FetchRouteObjectsRes = await postJson(`/routes/${routeID}/objects`,apiLoad) 
        if(apiResponse.length>0){
            if(apiResponse.length<svelteCMS.config.routeObjectsPerPage) resetStages()
            // Wait 500 milliseconds
            await wait(500)
            // Marge routes with response routes
            routeObjects = [...routeObjects,...apiResponse]
        }
        // Reset stages
        else await resetStages()
        // Remove loading more routes
        loadMoreBtnLoading = false
    }
    /** Reset stages */
    async function resetStages(){
        // Wait 500 milliseconds
        await wait(500)
        showLoadMoreBtn = false
        pageNumber = 1
    }
    // Route data
    $: routeID = data.routeID
    $: routeData = data.routeData
    $: routeObjects = data.routeObjects
    // Variables
    /** Indicate when loading more Routes */
    let loadMoreBtnLoading:boolean = false
    /** Current page number */
    let pageNumber:number = 1
    /** Indicate if show load more button or not */
    let showLoadMoreBtn:boolean = data.routeObjects.length >= svelteCMS.config.routeObjectsPerPage
</script>

<Meta {...routeData.meta} />
<PageTitleLink title={capitalize(routeData.title)} href="/admin/routes/{routeData.ID}/new-object" linkText="Add object" goBackSrc="/admin/routes"/>
{#if routeObjects.length > 0}
    <Objects objects={routeObjects} on:delete={handleObjectDeletion}/>
    {#if showLoadMoreBtn}
        <Button loading={loadMoreBtnLoading} text="Load more" centerBtn={true} --width="fit-content" on:click={loadMoreRouteObjects}/>
    {/if}
{:else}
    <NoResult title="No objects founded" subTitle="Please add some objects" href={`/admin/routes/${routeID}/new-object`} hrefText="Add object"/>
{/if}
