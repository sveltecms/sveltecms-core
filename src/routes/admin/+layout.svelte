<script lang="ts">
    export let data:LayoutServerData
    import "../../admin/layout.css"
    import { ROUTES } from "$Stores"
    // Types
    import type { LayoutServerData } from "./$types"
    // Packages
    import Toasts from "$Packages/svelteToasts/Toasts.svelte";
    // Components
    import Meta from "$Comps/Meta.svelte";
    import MainNav from "$Comps/core/nav/Nav.svelte";
    import TopNav from "$Comps/core/nav/topNav/TopNav.svelte";
    import Footer from "$Comps/core/footer/Footer.svelte";
    // Set stores
    ROUTES.set(data.routes)
</script>

{#if true}
    <Toasts />
    <Meta />
    <div class="app">
        <MainNav />
        <div class="content">
            <TopNav />
            <main class="mainContent">
                <slot />
                <Footer />
            </main>
        </div>
    </div>
{:else}
    <h2>HELLO</h2>
{/if}

<style>
    .app{
        display: flex;
        justify-content: flex-end;
    }
    .content{
        display: flex;
        flex-direction: column;
        width: calc(100% - 140px);
        min-height: 100vh;
    }
    .mainContent{
        padding: 10px;
    }
    @media(max-width:700px){
        .content{ width: 100%; }
    }
</style>