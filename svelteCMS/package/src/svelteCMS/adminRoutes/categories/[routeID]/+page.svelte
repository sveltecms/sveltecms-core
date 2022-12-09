<script lang="ts">
    export let data:PageServerData
    import type { PageServerData } from "./$types"
    import type { CategoryData } from "$Types";
    import type { DeleteCategoryLoad,DeleteCategoryRes } from "$Types/api";
    import type { FetchCategoriesLoad,FetchCategoriesRes } from "$Types/cms"
    import svelteCMS from "$svelteCMS";
    import { capitalize,postJson, wait } from "$Utils";
    import PlusIcon from "$Icons/Plus.svelte";
    import PageTitleLink from "$Comps/PageTitleLink.svelte";
    import Categories from "$Comps/categories/Categories.svelte"
    import Button from "$Comps/Button.svelte";
    /** Handle category delete */
    async function handleCategoryDelete(e:any) {
        const category:CategoryData = e.detail
        // Send remove category request
        const apiLoadData:DeleteCategoryLoad = category
        const apiResponse:DeleteCategoryRes = await postJson(`/routes/${routeID}/categories/delete`,apiLoadData)
        // If category was deleted, remove from current categories list
        if(apiResponse.ok){
            const newCategoriesList = categories.filter(data=>data.slug!==category.slug)
            categories = [...newCategoriesList]
        }
    }
    /** Load more categories */
    async function loadMore() {
        // Set loading more categories
        isGettingMoreCategories = true
        // Update page number
        pageNumber = pageNumber+1
        // Send api request
        const apiLoad:FetchCategoriesLoad = { filter:{},count:svelteCMS.config.categoriesPerPage,pageNumber,routeID }
        const apiResponse:FetchCategoriesRes = await postJson(`/routes/${routeID}/categories`,apiLoad) 
        if(apiResponse.length>0){
            if(apiResponse.length<svelteCMS.config.categoriesPerPage) resetStages()
            // Wait 500 milliseconds
            await wait(500)
            // Marge categories with response categories
            categories = [...categories,...apiResponse]
        }
        // Reset stages
        else await resetStages()
        // Remove loading more categories
        isGettingMoreCategories = false
    }
    /** Reset stages */ 
    async function resetStages(){
        // Wait 500 milliseconds
        await wait(500)
        showLoadMoreBtn = false
        pageNumber = 1
    }
    // Variable
    $: categories = data.categories
    $: routeID = data.routeID
    $: title = `${capitalize(routeID)}'s categories`
    $: newCategotyLink = `/admin/categories/${routeID}/new-category`
    $: showLoadMoreBtn = data.categories.length >= svelteCMS.config.categoriesPerPage
    let pageNumber = 1
    /** Indicate when loading more categories */
    let isGettingMoreCategories = false
</script>

<PageTitleLink {title} icon={PlusIcon} href={newCategotyLink}/>
<Categories {categories} on:delete={handleCategoryDelete}/>
{#if showLoadMoreBtn}
    <Button loading={isGettingMoreCategories} text="Load more" centerBtn={true} --width="fit-content" on:click={loadMore}/>
{/if}