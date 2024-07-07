import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: "src/umbnav-sorter-property-editor-ui.ts", // your web component source file
            formats: ["es"],
        },
        outDir: "./dist", // all compiled files will be placed here
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            external: [/^@umbraco/], // ignore the Umbraco Backoffice package in the build
        },
    },
    base: "/App_Plugins/UmbNavSorter/", // the base path of the app in the browser (used for assets)
});