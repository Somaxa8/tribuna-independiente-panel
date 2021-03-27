<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Slider
        <v-spacer/>
        <v-btn @click="$router.push('/slider')" color="primary" small class="ml-5">Nuevo Slider</v-btn>
      </v-card-title>
      <v-card-title>
        <v-row>
          <v-col cols="12">
            <v-text-field clearable v-model="search" append-icon="mdi-magnify" label="Buscar"/>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="sliders" hide-default-footer :loading="loading" loading-text="Cargando..."
                      :search="search" no-results-text="No hay resultados" no-data-text="No hay resultados">
          <template v-slot:item.url="{item}">
            <v-btn :href="item.url" target="_blank" link>ENLACE</v-btn>
          </template>
          <template v-slot:item.delete="{item}">
            <v-btn class="ma-1" text icon color="red lighten-2" @click="deleteSlider(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.image="{item}">
            <v-img :src="item.image.url" width="80" @click="redirect(item.image.url)"/>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from "vue-property-decorator";
import Slider from "@/models/Slider";
import SliderService from "@/services/SliderService";
import {getModule} from "vuex-module-decorators";
import DialogModule from "@/store/DialogModule";
import Dialog from "@/models/vue/Dialog";

@Component
export default class SlidersView extends Vue {
  @Ref() readonly form!: HTMLFormElement
  dialog: boolean = false
  sliders: Slider[] = []
  loading: boolean = false
  search: string = ""
  headers = [
    { text: "Id", value: "id", width: "200px" },
    { text: "Titulo", value: "title", width: "200px" },
    { text: "Banner", value: "image", width: "200px" },
    { text: "Url", value: "url", width: "200px"},
    { text: "Eliminar", value: "delete", width: "200px"},
  ]

  created() {
    SliderService.getSliders(this, this.sliders)
  }

  deleteSlider(id: number) {
    getModule(DialogModule).showDialog(new Dialog(
        "Aviso",
        "¿Está seguro de eliminar este Slider?",
        () => SliderService.deleteSlider(this, id)
    ))
  }

  redirect(url: string) {
    window.open(url, "_blank")
  }

}
</script>

