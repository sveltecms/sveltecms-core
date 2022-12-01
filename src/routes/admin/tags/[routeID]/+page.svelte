<script lang="ts">
    export let data:PageServerData
    // @ts-ignore
    import type { PageServerData } from "./$Types"
    import type { TagData } from "$Types";
    import type { DeleteTagLoad,DeleteTagRes } from "$Types/api";
    import type { FetchTagsLoad,FetchTagsRes } from "$Types/cms"
    import svelteCMS from "$svelteCMS";
    import { capitalize,postJson, wait } from "$Utils";
    import PlusIcon from "$Icons/Plus.svelte";
    import PageTitleLink from "$Comps/PageTitleLink.svelte";
    import Tags from "$Comps/tags/Tags.svelte"
    import Button from "$Comps/Button.svelte";
    /** Handle tag delete */
    async function handleTagDelete(e:any) {
        const tag:TagData = e.detail
        // Send remove tag request
        const apiLoadData:DeleteTagLoad = tag
        const apiResponse:DeleteTagRes = await postJson(`/routes/${routeID}/tags/delete`,apiLoadData)
        // If tag was deleted, remove from current tags list
        if(apiResponse.ok){
            const newTagsList = tags.filter(data=>data.slug!==tag.slug)
            tags = [...newTagsList]
        }
    }
    /** Load more tags */
    async function loadMore() {
        // Set loading more tags
        isGettingMoreTags = true
        // Update page number
        pageNumber = pageNumber+1
        // Send api request
        const apiLoad:FetchTagsLoad = { filter:{},count:svelteCMS.config.tagsPerPage,pageNumber,routeID }
        const apiResponse:FetchTagsRes = await postJson(`/routes/${routeID}/tags`,apiLoad) 
        if(apiResponse.length>0){
            if(apiResponse.length<svelteCMS.config.tagsPerPage) resetStages()
            // Wait 500 milliseconds
            await wait(500)
            // Marge tags with response tags
            tags = [...tags,...apiResponse]
        }
        // Reset stages
        else await resetStages()
        // Remove loading more tags
        isGettingMoreTags = false
    }
    /** Reset stages */ 
    async function resetStages(){
        // Wait 500 milliseconds
        await wait(500)
        showLoadMoreBtn = false
        pageNumber = 1
    }
    $: tags = data.tags
    $: routeID = data.routeID
    $: title = `${capitalize(routeID)}'s tags`
    $: newTagLink = `/admin/tags/${routeID}/new-tag`
    $: showLoadMoreBtn = data.tags.length >= svelteCMS.config.tagsPerPage
    let pageNumber = 1
    /** Indicate when loading more tags */
    let isGettingMoreTags = false
</script>

<PageTitleLink {title} icon={PlusIcon} href={newTagLink} />
<Tags {tags} on:delete={handleTagDelete}/>
{#if showLoadMoreBtn}
    <Button loading={isGettingMoreTags} text="Load more" centerBtn={true} --width="fit-content" on:click={loadMore}/>
{/if}