<template>
  <v-container fluid>
    <v-card>
      <v-progress-linear :indeterminate="true" :active="loading"/>
      <v-card-title>Nuevo Slider</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="slider.title" label="Titulo" :rules="titleRules"/>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="slider.url" label="Url" :rules="titleRules"/>
            </v-col>
            <v-col cols="12">
              <v-file-input v-model="imageFile" label="Slider" filled prepend-icon="mdi-image" accept="image/png, image/jpeg"/>
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions class="pr-0">
          <v-spacer/>
          <v-btn @click="createSlider()" small color="primary">Crear</v-btn>
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
import SliderService from "@/services/SliderService";
import Slider from "@/models/Slider";

@Component
export default class SliderView extends Vue {
  @Ref() readonly form!: HTMLFormElement
  slider: Slider = new Slider()
  loading: boolean = false
  imageFile: File | null = null
  titleRules = [(v: string) => v && v.length > 0 ? true : "Campo requerido"]

  createSlider() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de crear esta cabecera?",
          () => SliderService.postSlider(this, this.slider.title!, this.slider.url!, this.imageFile)
      ))
    }
  }
}
</script>
