import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    onwarn:(warning, handler)=>{ if(warning.code.startsWith('a11y-')) return ; handler(warning); },
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
        alias:{
            //<svelteCMSAlias>
            $svelteCMS:"src/admin/svelteCMS.ts",
            $Cms:"src/admin/cms",
            $Utils:"src/admin/utils.ts",
            $Stores:"src/admin/stores.ts",
            $Database:"src/admin/db/mongo.server.ts",
            $Types:"src/admin/types",
            $Comps:"src/admin/components/",
            $Elements:"src/admin/elements/",
            $Icons:"src/admin/icons/",
            $Packages:"src/admin/packages/"
            //</svelteCMSAlias>
        }
	}
};

export default config;
