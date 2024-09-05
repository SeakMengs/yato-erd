import { defineVitestConfig } from "@nuxt/test-utils/config";
import AutoImport from 'unplugin-auto-import/vite'

export default defineVitestConfig({
    // plugins: [
    //     AutoImport({
    //         imports: [
    //             'vue',
    //         ],
    //         // choose whatever folders u want to auto import
    //         dirs: ['./composables', './stores', './utils', './components', './constants'], 
    //         dts: true
    //     })
    // ],
    test: {
        environment: "node",
        globals: true,
    }
});
