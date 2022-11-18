<script>
    import { CategoriesRoutes } from "$Stores"
    import { capitalize } from "$Utils";
    import InPageLinks from "$Comps/shared/inPageLink/Links.svelte"
    $: links = $CategoriesRoutes.map(name=>{return{ title:capitalize(name),href:`/admin/categories/${name}`}})
</script>

<div class="page">
    <InPageLinks {links}/>
    <!-- Page content -->
    <slot />
</div>

<style>
    .page{
        color: var(--textColor);
        margin-bottom: 10px;
    }
</style>