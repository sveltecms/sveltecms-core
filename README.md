### How to add svelteCMS to existing or new project
#### Step 1: create a svelteKit project
``` bash
npm create svelte@latest appName
cd appName
```
![create svelte kit](./package/images//step-1.png)
### Make sure you select TypeScript
##### Since svelteCMS uses TypeScript to auto generate routes and routes objects types
![create svelte kit](./package/images//step-2.png)
### Next, choose your app config
![create svelte kit](./package/images//step-3.png)
### Or just add svelteCMS to an existing using npx
``` bash
npx sveltecms-init
```
### Init takes some optionals params
``` bash
# The connection url to your mongoDB database
--dbUrl=mongodb_url
# Example
npx sveltecms-init --dbUrl=mongodb+srv://someUrl:<password>-@user.mongodb.net/
```
#### Step 2: run npx command
``` bash
npx sveltecms-init
# or pass your mongodb url
npx sveltecms-init --dbUrl=mongodb_url
```