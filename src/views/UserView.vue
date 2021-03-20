<template>
  <v-container fluid>
    <v-card>
      <v-progress-linear :indeterminate="true" :active="loading"/>
      <v-card-title>
        Usuario
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-card>
              <v-img class="white--text logo-tint" height="150px" src="@/assets/images/employee.jpg">
                <v-card-title class="primary--white align-end fill-height"><span>{{user.name}} {{user.lastname}}</span></v-card-title>
              </v-img>
              <v-card-text>
                <v-subheader class="text-uppercase pl-0">Datos de contacto</v-subheader>
                <strong>Teléfono</strong><br>
                <span v-if="user.phone">{{user.phone}}</span>
                <span v-else>-</span>
                <br><br>
                <strong>Email</strong><br>
                {{user.email}}
                <v-divider class="mt-3"/>
                <v-subheader class="text-uppercase pl-0">Seguridad</v-subheader>
                <v-btn block small color="primary" @click="openChangePasswordDialog()">Cambiar contraseña</v-btn>
                <v-btn block small color="accent" class="mt-3" @click="resetPassword()">Restablecer contraseña</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="8">
            <v-card min-height="500px" flat>
              <v-tabs v-model="tab" show-arrows>
                <v-tab>Ficha personal</v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <UserTab :userId="Number(this.$route.params.userId)" :user="user" :userView="this"/>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="changePasswordDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline primary--text">
          <span>Cambiar contraseña</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">

            <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Contraseña actual"
                          hint="Deja el campo vacío si este usuario no tenia contraseña"
                          @click:append="showPassword = !showPassword"
                          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"/>

            <v-text-field v-model="newPassword" :type="showNewPassword ? 'text' : 'password'" label="Nueva contraseña"
                          :rules="newPasswordRules" @click:append="showNewPassword = !showNewPassword"
                          :append-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"/>

            <v-text-field v-model="repeatPassword" :type="showNewPassword ? 'text' : 'password'" label="Repite contraseña"
                          @click:append="showNewPassword = !showNewPassword" :append-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                          :rules="[
                                        () => repeatPassword.length > 0 ? true : 'Repite contraseña requerida',
                                        () => repeatPassword && repeatPassword == newPassword ? true : 'Las contraseñas deben coincidir'
                                      ]"/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="changePassword()" text color="primary">Cambiar</v-btn>
          <v-btn @click="changePasswordDialog = false" text color="primary">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue, Watch} from "vue-property-decorator";
import User from "@/models/User";
import {getModule} from "vuex-module-decorators";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/models/vue/Dialog";
import UserService from "@/services/UserService";
import UserTab from "@/components/tabs/UserTab.vue";
import RouterTool from "@/services/tool/RouterTool";

@Component({components: {UserTab}})
export default class UserView extends Vue {
  @Ref() readonly form!: HTMLFormElement
  tabs: string[] = ["/authorities"]
  tab: number = 0
  loading: boolean = false
  user: User = new User()
  changePasswordDialog: boolean = false
  password: string = ""
  newPassword: string = ""
  repeatPassword: string = ""
  showPassword: boolean = false
  showNewPassword: boolean = false
  newPasswordRules = [
    (v: string) => v.length > 0 ? true : "Nueva contraseña requerida",
    (v: string) => v.length >= 4 ? true : "Nueva contraseña de 4 caracteres mímino"
  ]

  created() {
    this.tab = RouterTool.configTabs(this, this.tabs)
    this.refresh()
  }

  refresh() {
    UserService.getUser(this, Number(this.$route.params.userId))
  }

  @Watch("tab")
  watchTab() {
    RouterTool.watchTabs(this, "/users/" + Number(this.$route.params.userId), this.tab, this.tabs)
  }

  changePassword() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de cambiar la contraseña?",
          () => UserService.patchChangePassword(this, this.password, this.newPassword, Number(this.$route.params.userId))
      ))
    }
  }

  openChangePasswordDialog() {
    if (this.form) this.form.resetValidation()
    this.changePasswordDialog = true
    this.password = ""
    this.newPassword = ""
    this.repeatPassword = ""
    this.showPassword = false
    this.showNewPassword = false
  }

  resetPassword() {
    getModule(DialogModule).showDialog(new Dialog(
        "Aviso",
        "¿Está seguro de generar una nueva contraseña?",
        () => UserService.patchResetPassword(this, Number(this.$route.params.userId))
    ))
  }

}
</script>