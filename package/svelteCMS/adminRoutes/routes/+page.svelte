<script lang="ts">
    import { Routes } from "$Stores";
    import ViewRoutes from "$Comps/routes/routes/Routes.svelte"
    import NoRoutes from "$Comps/NoRoutes.svelte";
</script>

{#if $Routes.length>0}
    <ViewRoutes routes={$Routes}/>
{:else}
    <NoRoutes />
{/if}