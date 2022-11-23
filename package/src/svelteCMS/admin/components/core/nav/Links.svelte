<script lang="ts">
    import { CATEGORIES_ROUTES,TAGS_ROUTES } from "$Stores"
    // Components
    import Link from "./Link.svelte"
    import ExternalLink from "./ExternalLink.svelte"
    // Icons
    import HomeIcon from "$Icons/House.svelte"
    import RoutesIcon from "$Icons/Diagram3.svelte"
    import TagsIcon from "$Icons/Tags.svelte"
    import CategoriesIcon from "$Icons/Tags.svelte"
    import UsersIcon from "$Icons/People.svelte"
    import AssetsIcon from "$Icons/Images.svelte"
    // import SettingsIcon from "$Icons/Gear.svelte"
    import DisplayIcon from "$Icons/Display.svelte"
    /** If any routes includes categories, use one of the as the default categories link */
    $: categoriesLink = $CATEGORIES_ROUTES.length>0 ? `/admin/categories/${$CATEGORIES_ROUTES[0]}` : "/admin/categories"
    /** If any routes includes tags, use one of the as the default tags link */
    $: tagsLink = $TAGS_ROUTES.length>0 ? `/admin/tags/${$TAGS_ROUTES[0]}` : "/admin/tags"
</script>

<ul class="links">
    <Link text="Home" href="/admin" icon={HomeIcon}/>
    <Link text="Routes" href="/admin/routes" icon={RoutesIcon}/>
    <Link text="Categories" href={categoriesLink} icon={CategoriesIcon}/>
    <Link text="Tags" href={tagsLink} icon={TagsIcon}/>
    <Link text="users" href="/admin/users" icon={UsersIcon}/>
    <Link text="Assets" href="/admin/assets" icon={AssetsIcon}/>
    <ExternalLink text="Preview" href="/" icon={DisplayIcon}/>
</ul>

<style>
    .links{
        width: 100%;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
    }
</style>