<script lang="ts">
    let userData:UserLoad = { firstName: "",lastName: "",email: "",password: "", image:svelteCMS.defaults.asset, role: "user", verified:true }
    import type { UserLoad } from "$Types";
    import type { CreateUserLoad,CreateUserRes } from "$Types/api"
    import { goto } from "$app/navigation";
    import svelteCMS from "$svelteCMS";
    import { postJson, validateNewUser, wait } from "$Utils"
    import PageTitleLink from "$Comps/PageTitleLink.svelte";
    // Packages
    import { newToast } from "$Packages/svelteToasts";
    import FileUploader from "$Packages/fileUploader/FileUploader.svelte";
    import type { AssetData } from "$Packages/fileUploader/types";
    // Icons
    import UpdateIcon from "$Icons/RotateRight.svelte";
    import PlusIcon from "$Icons/Plus.svelte";
    import PasswordIcon from "$Icons/ShieldLock.svelte"
    import EmailIcon from "$Icons/EnvelopeAt.svelte"
    // Routes components
    import Content from "$Comps/routes/Content.svelte";
    import LeftContent from "$Comps/routes/LeftContent.svelte";
    import RightContent from "$Comps/routes/RightContent.svelte";
    import ImagePreview from "$Comps/routes/ImagePreview.svelte";
    // Components
    import Label from "$Elements/Label.svelte";
    import Input from "$Elements/Input.svelte";
    import EmaiInput from "$Elements/EmaiInput.svelte";
    import PasswordInput from "$Elements/PasswordInput.svelte";
    import Button from "$Elements/Button.svelte";
    import ButtonSelector from "$Elements/buttonSelector/ButtonSelector.svelte";
    /** Handle new/update user */
    async function handleNewUser() {
        // Check if password and confirm password match
        if(userData.password.trim() !== passwordConfirm.trim()){
            newToast({ type:"error",msg:"Confirm password please" }) ; return
        }
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
        const apiLoadData:CreateUserLoad = userData
        const apiResponse:CreateUserRes = await postJson('/users/create',apiLoadData)
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
    let passwordConfirm:string = ""
    let isFileUploaderOpen:boolean = false
    let checkForErrors:boolean = false
    let loading:boolean = false
    $: firstNameError = checkForErrors && userData.firstName.trim() === ""
    $: lastNameError = checkForErrors && userData.lastName.trim() === ""
    $: emailError = checkForErrors && userData.email.trim() === ""
    $: passwordError = checkForErrors && userData.password.trim() === ""
    $: emailConfirmError = checkForErrors && userData.password.trim() !== passwordConfirm.trim()
</script>

<FileUploader bind:open={isFileUploaderOpen} on:select={handleFileSelected}/>
<PageTitleLink href="/admin/users/new" title="Users" icon={PlusIcon}/>
<Content>
    <LeftContent>
        <Label text="First name"/>
        <Input placeholder="Name..." bind:value={userData.firstName} error={firstNameError}/>
        <Label text="Last name"/>
        <Input placeholder="Lastname..." bind:value={userData.lastName} error={lastNameError}/>
        <Label text="Email"/>
        <EmaiInput placeholder="Email..." bind:value={userData.email} icon={EmailIcon} error={emailError}/>
        <Label text="Password"/>
        <PasswordInput placeholder="Password..." bind:value={userData.password} icon={PasswordIcon} error={passwordError}/>
        <Label text="Password confirm"/>
        <PasswordInput placeholder="Confirm password..." bind:value={passwordConfirm} icon={PasswordIcon} error={emailConfirmError}/>
    </LeftContent>
    <RightContent>
        <Label text="User role"/>
        <ButtonSelector bind:currentValue={userData.role} data={["user","admin","root"]}/>
        <Label text="Profile image"/>
        <ImagePreview image={userData.image}/>
        <Button text="Update image" icon={UpdateIcon} on:click={()=>isFileUploaderOpen=true}/>
        <Button {loading} on:click={handleNewUser}/>
    </RightContent>
</Content>