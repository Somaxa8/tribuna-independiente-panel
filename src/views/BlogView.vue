<template>
  <v-container fluid>
    <v-card>
      <v-progress-linear :indeterminate="true" :active="loading"/>
      <v-card-title>{{ $route.name === "blogCreate" ? "Nueva " : "Editar " }} Opinion</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="12" sm="12" v-if="blog.image">
              <v-card>
                <v-img :src="blog.image.url" height="300"/>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="blog.title" label="Titulo" :rules="titleRules"/>
            </v-col>
            <v-col cols="12">
              <v-textarea
                  v-model="blog.body"
                  name="Contenido"
                  label="Contenido"
                  :rules="titleRules"
              />
            </v-col>
            <v-col cols="12">
              <v-file-input v-model="imageFile" label="Banner" filled prepend-icon="mdi-image" accept="image/png, image/jpeg"/>
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions class="pr-0">
          <v-spacer/>
          <v-btn v-if="$route.name === 'blogUpdate'" @click="updateBlog()" small color="primary">Guardar</v-btn>
          <v-btn v-if="$route.name === 'blogUpdate'" @click="deleteBlog()" small color="primary">Eliminar</v-btn>
          <v-btn v-if="$route.name === 'blogCreate'" @click="createBlog()" small color="primary">Crear</v-btn>
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
import NewsLabel from "@/models/NewsLabel";
import Blog from "@/models/Blog";
import BlogService from "@/services/BlogService";

@Component
export default class BlogView extends Vue {
  @Ref() readonly form!: HTMLFormElement
  blog: Blog = new Blog()
  loading: boolean = false
  imageFile: File | null = null
  labels: NewsLabel[] = []
  titleRules = [(v: string) => v && v.length > 0 ? true : "Campo requerido"]

  created() {
    this.refresh()
  }

  refresh() {
    if (this.$route.params.id) BlogService.getBlog(this, Number(this.$route.params.id))
  }

  updateBlog() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de actualizar la opinion?",
          () => BlogService.patchBlog(this, this.blog.title, this.blog.body, this.imageFile, this.blog.id!)
      ))
    }
  }

  createBlog() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de crear esta opinion?",
          () => BlogService.postBlog(this, this.blog.title!, this.blog.body!, this.imageFile)
      ))
    }
  }

  deleteBlog() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de eliminar esta opinion?",
          () => BlogService.deleteBlog(this, this.blog.id!)
      ))
    }
  }
}
</script>
