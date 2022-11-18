<script>
    import InPageLinks from "$Comps/shared/inPageLink/Links.svelte"
    import { Routes } from "$Stores"
    $: extraLinks = $Routes.map(data=>{ return {title:data.title,href:`/admin/routes/${data.ID}`} }).slice(0,5)
    $: links = [
        { title:"All Routes",href:"/admin/routes"},
        { title:"New route",href:"/admin/routes/new"},
        ...extraLinks
    ]
</script>

<div class="setting">
    <InPageLinks {links}/>
    <!-- Page content -->
    <slot />
</div>

<style>
    .setting{
        color: var(--textColor);
        margin-bottom: 10px;
    }
</style>