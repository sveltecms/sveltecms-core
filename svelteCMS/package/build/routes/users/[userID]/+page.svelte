<script lang="ts">
    export let data:PageServerData
    import type { PageServerData } from "./$types"
    let userData:UserData= data.userData
    import type { UserData } from "$Types";
    import type { UpdateUserLoad,UpdateUserRes } from "$Types/api"
    import { goto } from "$app/navigation";
    import { postJson, validateNewUser, wait } from "$Utils"
    import PageTitleLink from "$Comps/PageTitleLink.svelte";
    // Packages
    import { newToast } from "$Packages/svelteToasts";
    import FileUploader from "$Packages/fileUploader/FileUploader.svelte";
    import type { AssetData } from "$Packages/fileUploader/types";
    // Icons
    import UpdateIcon from "$Icons/RotateRight.svelte";
    import PlusIcon from "$Icons/Plus.svelte";
    import EmailIcon from "$Icons/EnvelopeAt.svelte"
    // Routes components
    import Content from "$Comps/routes/Content.svelte";
    import LeftContent from "$Comps/routes/LeftContent.svelte";
    import RightContent from "$Comps/routes/RightContent.svelte";
    import ImagePreview from "$Comps/routes/ImagePreview.svelte";
    // Components
    import Label from "$Elements/Label.svelte";
    import Input from "$Elements/Input.svelte";
    import EmailInput from "$Elements/EmailInput.svelte";
    import Button from "$Elements/Button.svelte";
    import ButtonSelector from "$Elements/buttonSelector/ButtonSelector.svelte";
    /** Handle new/update user */
    async function handleUpdateUser() {
        // Trigger check errors and set loading for publish button
        checkForErrors = true ; loading = true
        const validatorErrors = validateNewUser(userData)
        const validated = validatorErrors.length===0
        // If user data was not validated
        if(!validated){
            newToast({ type:"error",msg:validatorErrors[0] })
            // Remove loading from publish button and stop function
            loading = false ; return
        }
        // Else send request to api
        const apiLoadData:UpdateUserLoad = userData
        const apiResponse:UpdateUserRes = await postJson('/users/update',apiLoadData)
        // If user was created
        if(apiResponse.ok){
            newToast({ type:"ok",msg:apiResponse.msg })
            await wait(500)
            goto("/admin/users")
        }
        // If user was not created
        else newToast({ type:"error",msg:apiResponse.msg })
        // Remove loading from publish button
        loading = false
    }
    /** Handle file selected */
    function handleFileSelected(e:any){
        const asset:AssetData = e.detail
        userData.image = asset
    }
    let isFileUploaderOpen:boolean = false
    let checkForErrors:boolean = false
    let loading:boolean = false
    $: firstNameError = checkForErrors && userData.firstName.trim() === ""
    $: lastNameError = checkForErrors && userData.lastName.trim() === ""
    $: emailError = checkForErrors && userData.email.trim() === ""
</script>

<FileUploader bind:open={isFileUploaderOpen} on:select={handleFileSelected}/>
<PageTitleLink href="/admin/users" linkText="All users" title="Updating" goBackSrc="/admin/users"/>
<Content>
    <LeftContent>
        <Label text="First name"/>
        <Input placeholder="...Name" bind:value={userData.firstName} error={firstNameError}/>
        <Label text="Last name"/>
        <Input placeholder="...Last name" bind:value={userData.lastName} error={lastNameError}/>
        <Label text="Email"/>
        <EmailInput placeholder="...email" bind:value={userData.email} icon={EmailIcon} error={emailError}/>
    </LeftContent>
    <RightContent>
        <Label text="User role"/>
        <ButtonSelector bind:currentValue={userData.role} data={["user","admin","root"]}/>
        <Label text="Profile image"/>
        <ImagePreview image={userData.image}/>
        <Button text="Update image" icon={UpdateIcon} on:click={()=>isFileUploaderOpen=true}/>
        <Button text={`Update user`} {loading} on:click={handleUpdateUser}/>
    </RightContent>
</Content>