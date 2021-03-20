<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Usuarios
        <v-spacer/>
        <v-btn @click="openCreateDialog()" color="primary" small class="ml-5">Nuevo usuario</v-btn>
      </v-card-title>
      <v-card-title>
        <v-row>
          <v-col cols="12">
            <v-text-field clearable v-model="search" append-icon="mdi-magnify" label="Buscar"/>
          </v-col>
        </v-row>
      </v-card-title>
      <v-pagination v-model="page" :length="pageCount" :total-visible="8"/>
      <v-card-text>
        <v-data-table :headers="headers" :items="users" hide-default-footer :loading="loading" :items-per-page="10"
                      :show-select="false" :page.sync="page" @page-count="pageCount = $event" loading-text="Cargando..."
                      :search="search" no-results-text="No hay resultados" no-data-text="No hay resultados"
                      @click:row="rowClick">
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline primary--text">Nuevo usuario</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="user.email" label="Email" :rules="emailRules"/>
          </v-form>

        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="createUser()" text color="primary">Crear</v-btn>
          <v-btn @click="dialog = false" text color="primary">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from "vue-property-decorator";
import User from "@/models/User";
import UserService from "@/services/UserService";
import StringTool from "@/services/tool/StringTool";
import {getModule} from "vuex-module-decorators";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/models/vue/Dialog";

@Component
export default class UsersView extends Vue {
  @Ref() readonly form!: HTMLFormElement
  dialog: boolean = false
  users: User[] = []
  user: User = new User()
  page: number = 1
  pageCount: number = 0
  loading: boolean = false
  search: string = ""
  headers = [
    { text: "Id", value: "id", width: "200px" },
    { text: "Email", value: "email", width: "200px" },
    { text: "Nombre", value: "name", width: "200px" },
    { text: "Apellidos", value: "lastname", width: "200px" },
    { text: "Teléfono", value: "phone", width: "200px" },
  ]
  emailRules = [
    (v: string) => v && v.length > 0 ? true : "Email requerido",
    (v: string) => StringTool.validateEmail(v) ? true : "Email no es válido"
  ]

  created() {
    UserService.getUsers(this, this.users)
  }

  rowClick(user: User) {
    this.$router.push({path: "/users/" + user.id})
  }

  openCreateDialog() {
    if (this.form) this.form.resetValidation()
    this.dialog = true
    this.user = new User()
  }

  createUser() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de crear el usuario?",
          () => UserService.postUser(this, this.user)
      ))
    }
  }
}
</script>
