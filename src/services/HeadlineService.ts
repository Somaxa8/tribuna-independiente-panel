import {Vue} from "vue-property-decorator";
import ConstantTool from "@/services/tool/ConstantTool";
import JsonTool from "@/services/tool/JsonTool";
import {getModule} from "vuex-module-decorators";
import SnackbarModule from "@/store/SnackbarModule";
import Headline from "@/models/Headline";
import SessionModule from "@/store/SessionModule";
import Cartoon from "@/models/Cartoon";

export default class HeadlineService {

    static async getHeadlines(component: Vue, headlines: Headline[], page: number, size: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(ConstantTool.BASE_URL + "/public/headline", {
                params: { page, size }
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Headline)
            headlines.splice(0, headlines.length)
            list.forEach(v => headlines.push(v))
            // @ts-ignore
            component.totalItems = Number(response.headers["x-total-count"]);
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se han podido obtener las cabeceras");
        }
    }

    static async getHeadline(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(ConstantTool.BASE_URL + "/public/headline/" + id)
            // @ts-ignore
            component.headline = JsonTool.jsonConvert.deserializeObject(response.data, Headline);
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se ha podido obtener la cabecera");
        }
    }

    static async postHeadline(component: Vue, body: string, hour: string) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        formData.set("body", body)
        formData.set("hour", hour)

        try {
            await component.axios.post(ConstantTool.BASE_URL + "/api/headline/",
                formData, {
                    headers: {Authorization: getModule(SessionModule).session.token}
                })
            getModule(SnackbarModule).makeToast("Se ha creado la cabecera correctamente!")
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
            getModule(SnackbarModule).makeToast("No se ha podido crear la cabecera")
        }
    }

    static async patchHeadline(component: Vue, body: string | undefined, hour: string, id: number) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        if (body) formData.set("body", body)
        if (hour) formData.set("hour", hour)

        try {
            await component.axios.patch(ConstantTool.BASE_URL + "/api/headline/" + id,
                formData, {
                    headers: {Authorization: getModule(SessionModule).session.token}
                })
            getModule(SnackbarModule).makeToast("Se ha editado la cabecera correctamente!")
            // @ts-ignore
            component.loading = false
            // @ts-ignore
            component.refresh()
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se ha podido editar la cabecera")
        }
    }

    static async deleteHeadline(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.delete(ConstantTool.BASE_URL + "/api/headline/" + id, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false;
            // @ts-ignore
            component.refresh();
            getModule(SnackbarModule).makeToast("Se ha eliminado la cabecera de manera exitosa!")
        } catch (err) {
            console.log(err)
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al eliminar la cabecera")
        }
    }

}