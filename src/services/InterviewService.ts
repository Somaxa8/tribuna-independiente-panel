import {Vue} from "vue-property-decorator";
import ConstantTool from "@/services/tool/ConstantTool";
import JsonTool from "@/services/tool/JsonTool";
import {getModule} from "vuex-module-decorators";
import SnackbarModule from "@/store/SnackbarModule";
import Interview from "@/models/Interview";
import SessionModule from "@/store/SessionModule";
import InterviewView from "@/views/InterviewView.vue";
import InterviewsView from "@/views/InterviewsView.vue";

export default class InterviewService {

    static async getInterviews(component: InterviewsView, interviews: Interview[], page: number, size: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(ConstantTool.BASE_URL + "/public/interview", {
                params: { page, size }
            })
            let list = JsonTool.jsonConvert.deserializeArray(response.data, Interview)
            interviews.splice(0, interviews.length)
            list.forEach(v => interviews.push(v))
            // @ts-ignore
            component.totalItems = Number(response.headers["x-total-count"]);
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se han podido obtener las entrvistas");
        }
    }

    static async getInterview(component: InterviewView, id: number) {
        // @ts-ignore
        component.loading = true
        try {
            const response = await component.axios.get(ConstantTool.BASE_URL + "/public/interview/" + id)
            // @ts-ignore
            component.interview = JsonTool.jsonConvert.deserializeObject(response.data, Interview);
            // @ts-ignore
            component.loading = false
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se ha podido obtener la entrvistas");
        }
    }

    static async postInterview(component: InterviewView, title: string, body: string, videoUrl: string) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        formData.set("title", title)
        formData.set("body", body)
        formData.set("videoUrl", videoUrl)

        try {
            await component.axios.post(ConstantTool.BASE_URL + "/api/interview/",
                formData, {
                    headers: {Authorization: getModule(SessionModule).session.token}
                })
            getModule(SnackbarModule).makeToast("Se ha creado la entrvistas correctamente!")
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
            getModule(SnackbarModule).makeToast("No se ha podido crear la entrvistas")
        }
    }

    static async patchInterview(component: InterviewView, title: string | undefined, body: string | undefined, videoUrl: string | undefined, id: number) {
        // @ts-ignore
        component.loading = true

        let formData = new FormData()
        if (title) formData.set("title", title)
        if (body) formData.set("body", body)
        if (videoUrl) formData.set("videoUrl", videoUrl)

        try {
            await component.axios.patch(ConstantTool.BASE_URL + "/api/interview/" + id,
                formData, {
                    headers: {Authorization: getModule(SessionModule).session.token}
                })
            getModule(SnackbarModule).makeToast("Se ha editado la entrevista correctamente!")
            // @ts-ignore
            component.loading = false
            // @ts-ignore
            component.refresh()
        } catch (err) {
            // @ts-ignore
            component.loading = false
            console.log(err)
            getModule(SnackbarModule).makeToast("No se ha podido editar la entrevista")
        }
    }

    static async deleteInterview(component: Vue, id: number) {
        // @ts-ignore
        component.loading = true

        try {
            await component.axios.delete(ConstantTool.BASE_URL + "/api/interview/" + id, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            // @ts-ignore
            component.loading = false;
            // @ts-ignore
            component.refresh();
            getModule(SnackbarModule).makeToast("Se ha eliminado la entrevista de manera exitosa!")
        } catch (err) {
            console.log(err)
            // @ts-ignore
            component.loading = false
            getModule(SnackbarModule).makeToast("Error al eliminar la entrevista")
        }
    }

}