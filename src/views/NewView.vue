<template>
  <v-container fluid>
    <v-card>
      <v-progress-linear :indeterminate="true" :active="loading"/>
      <v-card-title>{{ $route.name === "newsCreate" ? "Nueva " : "Editar " }} Noticia</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="12" sm="12" v-if="news.image">
              <v-card>
                <v-img :src="news.image.url" height="300"/>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="news.title" label="Titulo" :rules="titleRules"/>
            </v-col>
            <v-col cols="12">
              <v-textarea
                  v-model="news.body"
                  name="Contenido"
                  label="Contenido"
                  :rules="titleRules"
              />
            </v-col>
            <v-col cols="6">
              <v-select :items="labels" v-model="news.label" filled label="Categoria" dense>
                <template v-slot:item="{item}">
                  {{item.title}}
                </template>
                <template v-slot:selection="{item}">
                  {{item.title}}
                </template>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-file-input v-model="imageFile" label="Banner" filled prepend-icon="mdi-image" accept="image/png, image/jpeg"/>
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions class="pr-0">
          <div class="mb-5">
            <v-switch v-model="news.featured" label="Destacado" color="success" hide-details/>
          </div>
          <v-spacer/>
          <v-btn v-if="$route.name === 'newsUpdate'" @click="updateNews()" small color="primary">Guardar</v-btn>
          <v-btn v-if="$route.name === 'newsUpdate'" @click="deleteNews()" small color="error">Eliminar</v-btn>
          <v-btn v-if="$route.name === 'newsCreate'" @click="createNews()" small color="primary">Crear</v-btn>
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
import News from "@/models/News";
import NewsService from "@/services/NewsService";
import NewsLabel from "@/models/NewsLabel";
import NewsLabelService from "@/services/NewsLabelService";
import InterviewService from "@/services/InterviewService";

@Component
export default class NewView extends Vue {
  @Ref() readonly form!: HTMLFormElement
  news: News = new News()
  loading: boolean = false
  imageFile: File | null = null
  labels: NewsLabel[] = []
  titleRules = [(v: string) => v && v.length > 0 ? true : "Campo requerido"]

  created() {
    this.refresh()
  }

  refresh() {
    if (this.$route.params.id) NewsService.getNews(this, Number(this.$route.params.id))
    NewsLabelService.getLabels(this, this.labels)
  }

  updateNews() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de actualizar la noticia?",
          () => NewsService.patchNews(this, this.news.title, this.news.body, this.imageFile, this.news.featured, this.news.label!.id, this.news.id!)
      ))
    }
  }

  createNews() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de crear esta noticia?",
          () => NewsService.postNews(this, this.news.title!, this.news.body!, this.imageFile, this.news.featured, this.news.label!.id!)
      ))
    }
  }

  deleteNews() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de eliminar esta noticia?",
          () => NewsService.deleteNews(this, this.news.id!)
      ))
    }
  }
}
</script>
