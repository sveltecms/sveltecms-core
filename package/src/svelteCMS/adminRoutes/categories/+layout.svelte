<script>
    import { CATEGORIES_ROUTES } from "$Stores"
    import { capitalize } from "$Utils";
    import InPageLinks from "$Comps/shared/inPageLink/Links.svelte"
    $: links = $CATEGORIES_ROUTES.map(name=>{return{ title:capitalize(name),href:`/admin/categories/${name}`}})
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