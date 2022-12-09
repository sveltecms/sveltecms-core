<script lang="ts">
    // To use in edit and new route, just need to update these variables
    let routeData:RouteLoad = { ID:"", title:"", includeCategories:"yes", includeTags:"yes", meta: { title: "",desc: "" },elements: []}
    /** Label for publish or update button */
    let publishLabel = "Add Route"
    /** Api path to add new or update route */
    $: apiPath = `/routes/${routeData.ID}/route-create`
    /** Use to know when updating or adding */
    let addingNewRoute = true
    //--------------------------------------------------
    // Types
    import type { RouteLoad,ElementData } from "$Types"
    import type { CreateRouteRes } from "$Types/api"
    // Other
    import { ROUTES } from "$Stores"
    // Utils
    import { validateNewRoute,capitalize,getRealValue,postJson,wait } from "$Utils";
    // Icons
    import SaveIcon from "$Icons/Cloud.svelte"
    // Packages
    import { newToast } from "$Packages/svelteToasts";
    // Components
    import PageTitleLink from "$Comps/PageTitleLink.svelte";
    // Elements comps
    import Label from "$Elements/Label.svelte";
    import LabelSelector from "$Elements/LabelSelector.svelte";
    import Textarea from "$Elements/Textarea.svelte";
    import Input from "$Elements/Input.svelte";
    import Button from "$Comps/Button.svelte";
    import Elements from "$Comps/routes/newRoute/elements/Elements.svelte";
    import ElementEditor from "$Comps/routes/newRoute/ElementEditor.svelte";
    // Route comps
    import Content from "$Comps/routes/Content.svelte";
    import RightContent from "$Comps/routes/RightContent.svelte";
    import LeftContent from "$Comps/routes/LeftContent.svelte";
    /** Add new route */
    async function addRoute() {
        // Set loading and enable check for inputs error
        loading = true ; checkError = true
        // Validate values
        const validatorErrors = validateNewRoute(routeData)
        const wasValidated = validatorErrors.length===0
        // Alert any error
        if(!wasValidated){
            newToast({ type:"error",msg:validatorErrors[0] })
            // Stop function and disable loading
            loading = false ; return
        }
        // Else convert elements default value(string) to real js value 
        for(const elementIndex in routeData.elements){
            const elementData = routeData.elements[elementIndex]
            const realValue = getRealValue(elementData.type)
            routeData.elements[elementIndex] = {...elementData,value:realValue}
        }
        // Add status by default when adding new route
        if(addingNewRoute) routeData.elements.unshift({ ID:"status",name:"Status",type:"status",value:"public" })
        // Publish or update routes
        const apiResponse:CreateRouteRes = await postJson(apiPath,routeData)
        // If routes was created or updated
        if(apiResponse.ok){
            newToast({type:"ok",msg:apiResponse.msg})
            // Add new routes to Routes store if adding new one
            if(addingNewRoute){
                // @ts-ignore
                $ROUTES = [...$ROUTES,routeData]
            }
            // Wait 2 seconds
            await wait(2000)
            // Go to routes page
            window.location.href = "/admin/routes"
        }
        // If routes was not created or updated
        else newToast({type:"error",msg:apiResponse.msg})
        // Wait 
        await wait(500)
        loading = false
    }
    /** Handle new element change */
    function handleElementUpdate(e:any){
        const element:ElementData = {...e.detail}
        const elementExists = routeData.elements.find(data=>data.ID===element.ID)
        // Add element if it do not exists
        if(!elementExists){ routeData.elements = [...routeData.elements,element] }
        // Else send alert
        else newToast({type:"error",msg:`Element ID:${element.ID} already exists`})
    }
    /** Auto generate route title */
    function autoGenerateTitle(){ routeData.title = capitalize(routeData.ID) }
    // Variables
    /** Is adding new route or updating route*/
    let loading:boolean
    /** Check for inputs error if not filled */
    let checkError:boolean = false
    $: IDerror = checkError && routeData.ID.trim().length===0
    $: titleError = checkError && routeData.title.trim().length===0
    $: metaTitleError = checkError && routeData.meta.title.trim().length===0
    $: metaDescError = checkError && routeData.meta.desc.trim().length===0
    $: elementError = checkError && routeData.elements.length===0
</script>

<PageTitleLink href="/admin/routes" linkText="All routes" title="Adding route" goBackSrc="/admin/routes"/>
<Content>
    <LeftContent>
        {#if addingNewRoute}
            <Label text="ID"/>
            <Input placeholder="Route id..." bind:value={routeData.ID} error={IDerror}/>
        {/if}
        <Label text="Title" btnText="Generate" on:click={autoGenerateTitle}/>
        <Input placeholder="Route title..." bind:value={routeData.title} error={titleError}/>
        <Label text="Page info"/>
        <Input placeholder="Page title..." bind:value={routeData.meta.title} error={metaTitleError}/>
        <Textarea placeholder="Page description..." bind:value={routeData.meta.desc} error={metaDescError}/>
        <Label text="Route elements"/>
        <Elements bind:elements={routeData.elements}/>
    </LeftContent>
    <RightContent>
        <ElementEditor error={elementError} on:change={handleElementUpdate}/>
        <LabelSelector bind:value={routeData.includeCategories} text="Add categories" options={["yes","no"]}/>
        <LabelSelector bind:value={routeData.includeTags} text="Add tags" options={["yes","no"]}/>
        <Label text="Publish route"/>
        <Button text={publishLabel} icon={SaveIcon} bind:loading on:click={addRoute}/>   
    </RightContent>
</Content> 