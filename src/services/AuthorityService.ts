import {Vue} from "vue-property-decorator";
import ConstantTool from "@/services/tool/ConstantTool";
import {getModule} from "vuex-module-decorators";
import SnackbarModule from "@/store/SnackbarModule";
import SessionModule from "@/store/SessionModule";
import JsonTool from "@/services/tool/JsonTool";
import Authority, {AuthorityName} from "@/models/Authority";

export default class AuthorityService {


    static sortAuthorities(authorities: Authority[]) {
        let list: Authority[] = []
        authorities.forEach(a => list.push(a));
        authorities.splice(0, authorities.length)
        for (let key in AuthorityName) {
            let name: AuthorityName = (<any>AuthorityName)[key]
            list.forEach(a => {
                if (a.name == name) authorities.push(a)
            })
        }
    }

    static getAuthorities(component: Vue, authorities: Authority[]) {
        // @ts-ignore
        component.loading = false
        component.axios.get(ConstantTool.BASE_URL + "/api/authorities", {
            headers: {Authorization: getModule(SessionModule).session.token}
        })
            .then(response => {
                let list = JsonTool.jsonConvert.deserializeArray(response.data, Authority)
                authorities.splice(0, authorities.length)
                list.forEach(a => authorities.push(a))
            })
            .catch(() => getModule(SnackbarModule).makeToast("No se han podido obtener los roles"))
            // @ts-ignore
            .finally(() => component.loading = false)
    }

    static getAuthoritiesByUserId(component: Vue, authorities: Authority[], userId: number) {
        // @ts-ignore
        component.loading = false
        component.axios.get(ConstantTool.BASE_URL + "/api/users/" + userId + "/authorities", {
            headers: {Authorization: getModule(SessionModule).session.token}
        })
            .then(response => {
                let list = JsonTool.jsonConvert.deserializeArray(response.data, Authority)
                authorities.splice(0, authorities.length)
                this.sortAuthorities(list)
                list.forEach(a => authorities.push(a))
            })
            .catch(() => getModule(SnackbarModule).makeToast("No se han podido obtener los roles"))
            // @ts-ignore
            .finally(() => component.loading = false)
    }

    static patchAuthorityRelateUser(component: Vue, authority: Authority, userId: number) {
        component.axios.patch(ConstantTool.BASE_URL + "/api/authorities/" + authority.name + "/users/" + userId + "/relate",
            null, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            .then(() => {
                authority.enabled = true
                if (getModule(SessionModule).session.user.id == userId) {
                    getModule(SessionModule).relateAuthority(authority);
                    getModule(SessionModule).saveSession()
                }
            })
            .catch(() => getModule(SnackbarModule).makeToast("No se ha podido añadir el rol"))
    }

    static patchAuthorityUnrelateUser(component: Vue, authority: Authority, userId: number) {
        component.axios.patch(ConstantTool.BASE_URL + "/api/authorities/" + authority.name + "/users/" + userId + "/unrelate",
            null, {
                headers: {Authorization: getModule(SessionModule).session.token}
            })
            .then(() => {
                authority.enabled = false
                if (getModule(SessionModule).session.user.id == userId) {
                    getModule(SessionModule).unrelateAuthority(authority)
                    getModule(SessionModule).saveSession()
                }
            })
            .catch(() => getModule(SnackbarModule).makeToast("No se ha podido quitar el rol"))
    }

}