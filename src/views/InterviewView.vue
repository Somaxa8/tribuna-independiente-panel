<template>
  <v-container fluid>
    <v-card>
      <v-progress-linear :indeterminate="true" :active="loading"/>
      <v-card-title>{{ $route.name === "interviewCreate" ? "Nueva " : "Editar " }}Entrevista</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="interview.title" label="Titulo"/>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="interview.videoUrl" label="Url"/>
            </v-col>
            <v-col cols="12">
              <v-textarea
                  v-model="interview.body"
                  name="Contenido"
                  label="Contenido"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions class="pr-0">
          <v-spacer/>
          <v-btn v-if="$route.name === 'interviewUpdate'" @click="deleteInterview()" small color="error">Eliminar</v-btn>
          <v-btn v-if="$route.name === 'interviewUpdate'" @click="updateInterview()" small color="primary">Guardar</v-btn>

          <v-btn v-if="$route.name === 'interviewCreate'" @click="createInterview()" small color="primary">Crear</v-btn>
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
import Interview from "@/models/Interview";
import InterviewService from "@/services/InterviewService";

@Component
export default class InterviewView extends Vue {
  @Ref() readonly form!: HTMLFormElement
  interview: Interview = new Interview()
  loading: boolean = false
//  titleRules = [(v: string) => v && v.length > 0 ? true : "Campo requerido"]

  created() {
    this.refresh()
  }

  refresh() {
    if (this.$route.params.id) InterviewService.getInterview(this, Number(this.$route.params.id))
  }

  updateInterview() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de actualizar la entrevista?",
          () => InterviewService.patchInterview(this, this.interview.title, this.interview.body, this.interview.videoUrl, this.interview.id!)
      ))
    }
  }

  createInterview() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de crear esta entrevista?",
          () => InterviewService.postInterview(this, this.interview.title!, this.interview.body!, this.interview.videoUrl!)
      ))
    }
  }

  deleteInterview() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de eliminar esta entrevista?",
          () => InterviewService.deleteInterview(this, this.interview.id!)
      ))
    }
  }
}
</script>
