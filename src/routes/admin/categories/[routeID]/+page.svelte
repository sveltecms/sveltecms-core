<script lang="ts">
    export let data:PageServerData
    import type { PageServerData } from "./$types"
    import type { CategoryData } from "$Types";
    import type { DeleteCategoryLoad,DeleteCategoryRes } from "$Types/api";
    import { capitalize,postJson } from "$Utils";
    import PlusIcon from "$Icons/Plus.svelte";
    import PageTitleLink from "$Comps/PageTitleLink.svelte";
    import Categories from "$Comps/categories/Categories.svelte"
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
    $: categories = data.categories
    $: routeID = data.routeID
    $: title = `${capitalize(routeID)}'s categories`
    $: newCategotyLink = `/admin/categories/${routeID}/new-category`
</script>

<PageTitleLink {title} icon={PlusIcon} href={newCategotyLink}/>
<Categories {categories} on:delete={handleCategoryDelete}/>