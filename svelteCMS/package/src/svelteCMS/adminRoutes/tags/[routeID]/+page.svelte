<script lang="ts">
    export let data:PageServerData
    // @ts-ignore
    import type { PageServerData } from "./$Types"
    import type { TagData } from "$Types";
    import type { DeleteTagLoad,DeleteTagRes } from "$Types/api";
    import { capitalize,postJson } from "$Utils";
    import PlusIcon from "$Icons/Plus.svelte";
    import PageTitleLink from "$Comps/PageTitleLink.svelte";
    import Tags from "$Comps/tags/Tags.svelte"
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
    $: tags = data.tags
    $: routeID = data.routeID
    $: title = `${capitalize(routeID)}'s tags`
    $: newTagLink = `/admin/tags/${routeID}/new-tag`
</script>

<PageTitleLink {title} icon={PlusIcon} href={newTagLink} />
<Tags {tags} on:delete={handleTagDelete}/>