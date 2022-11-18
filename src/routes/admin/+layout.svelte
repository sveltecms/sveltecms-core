<script lang="ts">
    export let data:LayoutServerData
    import "../../admin/layout.css"
    import { Routes,CategoriesRoutes,TagsRoutes } from "$Stores"
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
    Routes.set(data.routes)
    CategoriesRoutes.set(data.categoriesRoutes)
    TagsRoutes.set(data.tagsRoutes)
</script>

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

<style>
    .app{
        display: flex;
        justify-content: flex-end;
    }
    .content{
        display: flex;
        flex-direction: column;
        width: calc(100% - 140px);
    }
    .mainContent{
        padding: 10px;
    }
    @media(max-width:700px){
        .content{ width: 100%; }
    }
</style>