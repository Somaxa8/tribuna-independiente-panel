import {Vue} from "vue-property-decorator";
import NewsLabel from "@/models/NewsLabel";
import ConstantTool from "@/services/tool/ConstantTool";
import JsonTool from "@/services/tool/JsonTool";
import {getModule} from "vuex-module-decorators";
import SnackbarModule from "@/store/SnackbarModule";
import SessionModule from "@/store/SessionModule";

export default class NewsLabelService {

    static async getLabels(component: Vue, labels: NewsLabel[]) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(ConstantTool.BASE_URL + "/public/news-label")
            let list = JsonTool.jsonConvert.deserializeArray(response.data, NewsLabel)
            labels.splice(0, labels.length)
            list.forEach(v => labels.push(v))
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se han podido obtener las etiquetas");
        }
    }

    static async getLabel(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(ConstantTool.BASE_URL + "/public/news-label/" + id)
            // @ts-ignore
            component.label = JsonTool.jsonConvert.deserializeObject(response.data, NewsLabel);
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se ha podido obtener la etiqueta");
        }
    }

    static async postLabel(component: Vue, title: string) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        formData.set("title", title)

        try {
            await component.axios.post(ConstantTool.BASE_URL + "/api/news-label/",
                formData, {
                    headers: {Authorization: getModule(SessionModule).session.token}
                })
            getModule(SnackbarModule).makeToast("Se ha creado la etiqueta correctamente!")
            // @ts-ignore
            component.loading = false
            // @ts-ignore
            component.refresh()
            // @ts-ignore
            component.form.reset()
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se ha podido crear la etiqueta")
        }
    }

    static async patchLabel(component: Vue, title: string, id: number) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        if (title) formData.set("title", title)

        try {
            await component.axios.patch(ConstantTool.BASE_URL + "/api/news-label/" + id,
                formData, {
                    headers: {Authorization: getModule(SessionModule).session.token}
                })
            getModule(SnackbarModule).makeToast("Se ha editado la etiqueta correctamente!")
            // @ts-ignore
            component.loading = false
            // @ts-ignore
            component.refresh()
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se ha podido editar la etiqueta")
        }
    }

    static async deleteLabel(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.delete(ConstantTool.BASE_URL + "/api/news-label/" + id, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false;
            // @ts-ignore
            component.refresh();
            getModule(SnackbarModule).makeToast("Se ha eliminado la etiqueta de manera exitosa!")
        } catch (err) {
            console.log(err)
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al eliminar la etiqueta")
        }
    }

}