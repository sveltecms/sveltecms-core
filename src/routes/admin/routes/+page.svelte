<script lang="ts">
    export let data:PageServerData
    ROUTES.set(data.routes)
    import type { PageServerData } from "./$types";
    import type { FetchRoutesLoad,FetchRoutesRes } from "$Types/cms";
    import svelteCMS from "$svelteCMS";
    import { wait,postJson } from "$Utils"
    import { ROUTES } from "$Stores";
    import PageTitleLink from "$Comps/PageTitleLink.svelte"
    import Routes from "$Comps/routes/routes/Routes.svelte"
    import NoRoutes from "$Comps/NoRoutes.svelte";
    import Button from "$Comps/Button.svelte"
    /** Load more routes */
    async function loadMoreRoutes() {
        // Set loading more routes
        loadingMoreRoutes = true
        // Update page number
        pageNumber = pageNumber+1
        // Send api request
        const apiLoad:FetchRoutesLoad = { filter:{},count:svelteCMS.config.routesPerPage,pageNumber }
        const apiResponse:FetchRoutesRes = await postJson("/routes",apiLoad) 
        if(apiResponse.length>0){
            if(apiResponse.length<svelteCMS.config.routesPerPage) resetStages()
            // Wait 500 milliseconds
            await wait(500)
            // Marge routes with response routes
            ROUTES.set([...$ROUTES,...apiResponse])
        }
        // Reset stages
        else await resetStages()
        // Remove loading more routes
        loadingMoreRoutes = false
    }
    /** Reset stages */
    async function resetStages(){
        // Wait 500 milliseconds
        await wait(500)
        showLoadMoreBtn = false
        pageNumber = 1
    }
    // Variables
    /** Indicate when loading more Routes */
    let loadingMoreRoutes:boolean = false
    /** Current page number */
    let pageNumber:number = 1
    /** Indicate if show load more button or not */
    let showLoadMoreBtn:boolean = $ROUTES.length >= svelteCMS.config.routesPerPage
</script>

{#if $ROUTES.length>0}
    <PageTitleLink href="/admin/routes/new" title="All routes"/>
    <Routes routes={$ROUTES}/>
    {#if showLoadMoreBtn}
        <Button loading={loadingMoreRoutes} text="Load more" centerBtn={true} --width="fit-content" on:click={loadMoreRoutes}/>
    {/if}
{:else}
    <NoRoutes />
{/if}