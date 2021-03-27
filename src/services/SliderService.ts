import ConstantTool from "@/services/tool/ConstantTool";
import {getModule} from "vuex-module-decorators";
import SessionModule from "@/store/SessionModule";
import SnackbarModule from "@/store/SnackbarModule";
import Slider from "@/models/Slider";
import Vue from "vue/types/umd";
import JsonTool from "@/services/tool/JsonTool";
import PostSliderPanel from "@/components/panel/PostSliderPanel.vue";
import Headline from "@/models/Headline";

export default class SliderService {

    static async postSlider(component: PostSliderPanel, title: string, url: string, imageFile: File | null) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()

        formData.set("title", title)
        formData.set("url", url)
        if(imageFile) formData.set("imageFile", imageFile)

        try {
            await component.axios.post(
                ConstantTool.BASE_URL + "/api/slider/", formData, {
                    headers: {Authorization: getModule(SessionModule).session.token}
                })
            getModule(SnackbarModule).makeToast("Se ha creado el slider correctamente!")
            // @ts-ignore
            component.loading = false
            // @ts-ignore
            component.refresh()
            // @ts-ignore
            component.form.reset()
        } catch(err) {
            console.log(err)
            getModule(SnackbarModule).makeToast("Error al crear el slider")
            // @ts-ignore
            component.loading = false
        }

    }

    static async getSliders(component: Vue, sliders: Slider[]) {
        (<any>component).loading = true
        try {
            const response = await component.axios.get(ConstantTool.BASE_URL + "/public/slider")
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Slider)
            sliders.splice(0, sliders.length)
            list.forEach(v => sliders.push(v));
            (<any>component).loading = false
        } catch (err) {
            (<any>component).loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se han podido obtener los sliders");
        }

    }

    static async getSlider(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(ConstantTool.BASE_URL + "/public/slider/" + id)
            // @ts-ignore
            component.slider = JsonTool.jsonConvert.deserializeObject(response.data, Slider);
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se ha podido obtener el Slider");
        }
    }

    static async deleteSlider(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.delete(ConstantTool.BASE_URL + "/api/slider/" + id, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false;
            // @ts-ignore
            component.refresh();
            getModule(SnackbarModule).makeToast("Se ha eliminado el slider de manera exitosa!")
        } catch (err) {
            console.log(err)
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al eliminar el slider")
        }
    }
}