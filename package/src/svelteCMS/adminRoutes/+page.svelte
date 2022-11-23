<script lang="ts">
    export let data:PageServerData
    ASSETS.set(data.assets)
    USERS.set(data.users)
    import type { PageServerData } from "./$types"
    import { ROUTES,USERS,ASSETS } from "$Stores"
    import PageTitle from "$Comps/PageTitle.svelte";
    import PageTitleLink from "$Comps/PageTitleLink.svelte";
    import Stats from "$Comps/shared/stats/Stats.svelte";
    import Users from "$Comps/users/Users.svelte";
    import Routes from "$Comps/routes/routes/Routes.svelte";
    import Assets from "$Comps/shared/assets/Assets.svelte";
</script>

<PageTitle title="Website stats"/>
<Stats stats={data.stats}/>
<PageTitleLink title="Latest routes" href="/admin/routes" linkText="View routes"/>
<Routes routes={$ROUTES}/>
<PageTitleLink title="Latest users" href="/admin/users" linkText="View users"/>
<Users users={$USERS}/>
<PageTitleLink title="Latest assets" href="/admin/assets" linkText="View assets"/>
<Assets assets={$ASSETS}/>