import {Vue} from "vue-property-decorator";
import NewsLabel from "@/models/NewsLabel";
import ConstantTool from "@/services/tool/ConstantTool";
import JsonTool from "@/services/tool/JsonTool";
import {getModule} from "vuex-module-decorators";
import SnackbarModule from "@/store/SnackbarModule";
import SessionModule from "@/store/SessionModule";
import News from "@/models/News";

export default class NewsService {

    static async getNewsPaginated(component: Vue, news: News[], page: number, size: number, labelId: number | null | undefined) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(ConstantTool.BASE_URL + "/public/news", {
                params: { page, size, labelId: labelId }
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, News)
            news.splice(0, news.length)
            list.forEach(v => news.push(v))
            // @ts-ignore
            component.totalItems = Number(response.headers["x-total-count"]);
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se han podido obtener las noticias");
        }
    }

    static async getNews(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(ConstantTool.BASE_URL + "/public/news/" + id)
            // @ts-ignore
            component.label = JsonTool.jsonConvert.deserializeObject(response.data, News);
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se ha podido obtener la noticia");
        }
    }

    static async postNews(component: Vue, title: string, body: string, imageFile: File | null, featured: boolean = false, labelId: number | null) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        formData.set("title", title)
        formData.set("body", body)
        formData.set("imageFile", imageFile!)
        formData.set("featured", featured ? "true" : "false")
        if (labelId) formData.set("labelId", labelId.toString())

        try {
            await component.axios.post(ConstantTool.BASE_URL + "/api/news/",
                formData, {
                    headers: {Authorization: getModule(SessionModule).session.token}
                })
            getModule(SnackbarModule).makeToast("Se ha creado la noticia correctamente!")
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
            getModule(SnackbarModule).makeToast("No se ha podido crear la noticia")
        }
    }

    static async patchNews(component: Vue, title: string | null, body: string | null, imageFile: File | null, featured: boolean = false, labelId: number | null, id: number) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        if (title) formData.set("title", title)
        if (body) formData.set("body", body)
        if (imageFile) formData.set("imageFile", imageFile)
        formData.set("featured", featured ? "true" : "false")
        if (labelId) formData.set("labelId", labelId.toString())

        try {
            await component.axios.patch(ConstantTool.BASE_URL + "/api/news/" + id,
                formData, {
                    headers: {Authorization: getModule(SessionModule).session.token}
                })
            getModule(SnackbarModule).makeToast("Se ha editado la noticia correctamente!")
            // @ts-ignore
            component.loading = false
            // @ts-ignore
            component.refresh()
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se ha podido editar la noticia")
        }
    }

    static async deleteNews(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.delete(ConstantTool.BASE_URL + "/api/news/" + id, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false;
            // @ts-ignore
            component.refresh();
            getModule(SnackbarModule).makeToast("Se ha eliminado la noticia de manera exitosa!")
        } catch (err) {
            console.log(err)
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al eliminar la noticia")
        }
    }

}