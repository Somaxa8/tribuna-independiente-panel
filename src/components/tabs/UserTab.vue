<template>
  <v-card>
    <v-card-text>

      <v-form ref="form">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="user.email" label="Email"/>
          </v-col>
          <v-col cols="12" sm="5">
            <v-text-field v-model="user.name" label="Nombre"/>
          </v-col>
          <v-col cols="12" sm="7">
            <v-text-field v-model="user.lastname" label="Apellidos"/>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="user.phone" label="Teléfono"/>
          </v-col>
        </v-row>
      </v-form>

      <v-card-actions class="pr-0">
        <v-spacer/>
        <v-btn @click="updateUser()" small color="primary">Guardar</v-btn>
      </v-card-actions>

    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from "vue-property-decorator";
import UserView from "@/views/UserView.vue";
import User from "@/models/User";
import {getModule} from "vuex-module-decorators";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/models/vue/Dialog";
import UserService from "@/services/UserService";

@Component
export default class UserTab extends Vue {
  @Prop() readonly userView!: UserView
  @Prop() readonly userId!: number
  @Prop() readonly user!: User
  @Ref() readonly form!: HTMLFormElement

  updateUser() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de actualizar el usuario?",
          () => UserService.patchUser(this.userView, this.user)
      ))
    }
  }
}
</script>