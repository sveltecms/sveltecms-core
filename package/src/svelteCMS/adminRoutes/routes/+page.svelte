<script lang="ts">
    import { ROUTES } from "$Stores";
    import Routes from "$Comps/routes/routes/Routes.svelte"
    import NoRoutes from "$Comps/NoRoutes.svelte";
</script>

{#if $ROUTES.length>0}
    <Routes routes={$ROUTES}/>
{:else}
    <NoRoutes />
{/if}