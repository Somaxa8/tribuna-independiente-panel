import {Vue} from "vue-property-decorator";
import Vue2Editor from "vue2-editor";

export default class VueEditorConfig {

    static init() {
        Vue.use(Vue2Editor)
    }

}