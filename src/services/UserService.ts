import User from "@/models/User";
import ConstantTool from "@/services/tool/ConstantTool";
import {getModule} from "vuex-module-decorators";
import SessionModule from "@/store/SessionModule";
import {Vue} from "vue-property-decorator";
import JsonTool from "@/services/tool/JsonTool";
import SnackbarModule from "@/store/SnackbarModule";

export default class UserService {

    static postUser(component: Vue, user: User) {
        // @ts-ignore
        component.loading = true
        component.axios.post(ConstantTool.BASE_URL + "/api/users",
            user, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            .then(response => {
                let item: User = JsonTool.jsonConvert.deserializeObject(response.data, User)
                component.$router.push({path: "/users/" + item.id})
            })
            .catch(() => getModule(SnackbarModule).makeToast("No se pudo crear el usuario"))
            // @ts-ignore
            .finally(() => component.loading = false)
    }

    static getUsers(component: Vue, users: User[]) {
        // @ts-ignore
        component.loading = true
        component.axios.get(ConstantTool.BASE_URL + "/api/users", {
            headers : {Authorization: getModule(SessionModule).session.token}
        })
            .then(response => {
                let list = JsonTool.jsonConvert.deserializeArray(response.data, User)
                users.splice(0, users.length)
                list.forEach(u => users.push(u))
            })
            .catch(() => getModule(SnackbarModule).makeToast("No se pudo obtener los usuarios"))
            // @ts-ignore
            .finally(() => component.loading = false)
    }

    static getUser(component: Vue, userId: number) {
        // @ts-ignore
        component.loading = true
        component.axios.get(ConstantTool.BASE_URL + "/api/users/" + userId, {
            headers: {Authorization: getModule(SessionModule).session.token}
        })
            .then(response => {
                let entity = JsonTool.jsonConvert.deserializeObject(response.data, User)
                // @ts-ignore
                component.user = entity
            })
            .catch(() => getModule(SnackbarModule).makeToast("No se pudo obtener el usuario"))
            // @ts-ignore
            .finally(() => component.loading = false)
    }

    static patchUser(component: Vue, user: User) {
        // @ts-ignore
        component.loading = true
        component.axios.patch(ConstantTool.BASE_URL + "/api/users/" + user.id,
            user, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            .then(response => {
                // @ts-ignore
                component.refresh()
            })
            .catch(() => getModule(SnackbarModule).makeToast("No se pudo actualizar el usuario"))
            // @ts-ignore
            .finally(() => component.loading = false)
    }

    static patchChangePassword(component: Vue, password: string, newPassword: string, userId: number) {
        let formData: FormData = new FormData()
        formData.set("password", password)
        formData.set("newPassword", newPassword)
        component.axios.patch(ConstantTool.BASE_URL + "/api/users/" + userId + "/change-password",
            formData, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            .then(response => {
                getModule(SnackbarModule).makeToast("Contraseña cambiada con exito")
                // @ts-ignore
                component.changePasswordDialog = false
            })
            .catch(error => getModule(SnackbarModule).makeToast("No se pudo cambiar la contraseña"))
    }

    static patchResetPassword(component: Vue, userId: number) {
        component.axios.patch(ConstantTool.BASE_URL + "/api/users/" + userId + "/reset-password",
            null, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            .then(response => {
                getModule(SnackbarModule).makeToast("La nueva contraseña ha sido enviada a su email")
                // @ts-ignore
                component.changePasswordDialog = false
            })
            .catch(error => getModule(SnackbarModule).makeToast("No se pudo generar la nueva contraseña"))
    }

}