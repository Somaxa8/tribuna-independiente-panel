<template>
  <v-container fluid>
    <v-card>
      <v-progress-linear :indeterminate="true" :active="loading"/>
      <v-card-title>{{ $route.name === "headlineCreate" ? "Nueva " : "Editar " }}Cabecera</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="12">
              <v-textarea
                  v-model="headline.body"
                  name="Contenido"
                  label="Contenido"
                  :rules="titleRules"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions class="pr-0">
          <v-spacer/>
          <v-btn v-if="$route.name === 'headlineUpdate'" @click="updateHeadline()" small color="primary">Guardar</v-btn>
          <v-btn v-if="$route.name === 'headlineUpdate'" @click="deleteHeadline()" small color="error">Eliminar</v-btn>
          <v-btn v-if="$route.name === 'headlineCreate'" @click="createHeadline()" small color="primary">Crear</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from "vue-property-decorator";
import {getModule} from "vuex-module-decorators";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/models/vue/Dialog";
import Headline from "@/models/Headline";
import HeadlineService from "@/services/HeadlineService";

@Component
export default class HeadlineView extends Vue {
  @Ref() readonly form!: HTMLFormElement
  headline: Headline = new Headline()
  loading: boolean = false
  titleRules = [(v: string) => v && v.length > 0 ? true : "Campo requerido"]

  getHour(): string {
    return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }

  created() {
    this.refresh()
  }

  refresh() {
    if (this.$route.params.id) HeadlineService.getHeadline(this, Number(this.$route.params.id))
  }

  updateHeadline() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de actualizar la cabecera?",
          () => HeadlineService.patchHeadline(this, this.headline.body, this.getHour(), this.headline.id!)
      ))
    }
  }

  createHeadline() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de crear esta cabecera?",
          () => HeadlineService.postHeadline(this, this.headline.body!, this.getHour())
      ))
    }
  }

  deleteHeadline() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de eliminar esta cabecera?",
          () => HeadlineService.deleteHeadline(this, this.headline.id!)
      ))
    }
  }
}
</script>
