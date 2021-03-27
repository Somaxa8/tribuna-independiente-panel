<template>
  <v-container fluid>
    <v-card>
      <v-progress-linear :indeterminate="true" :active="loading"/>
      <v-card-title>{{ $route.name === "headlineCreate" ? "Nueva " : "Editar " }}Caricatura</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-col cols="12" sm="12" v-if="cartoon.image">
            <v-card>
              <v-img :src="cartoon.image.url"/>
            </v-card>
          </v-col>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="cartoon.title" label="Titulo" :rules="titleRules"/>
            </v-col>
            <v-col cols="12">
              <v-textarea
                  v-model="cartoon.body"
                  name="Contenido"
                  label="Contenido"
                  :rules="titleRules"
              />
            </v-col>
            <v-col cols="12">
              <v-file-input v-model="imageFile" label="Caricatura" filled prepend-icon="mdi-image" accept="image/png, image/jpeg"/>
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions class="pr-0">
          <v-spacer/>
          <v-btn v-if="$route.name === 'cartoonUpdate'" @click="updateCartoon()" small color="primary">Guardar</v-btn>
          <v-btn v-if="$route.name === 'cartoonUpdate'" @click="deleteCartoon()" small color="error">Eliminar</v-btn>
          <v-btn v-if="$route.name === 'cartoonCreate'" @click="createCartoon()" small color="primary">Crear</v-btn>
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
import Cartoon from "@/models/Cartoon";
import CartoonService from "@/services/CartoonService";

@Component
export default class CartoonView extends Vue {
  @Ref() readonly form!: HTMLFormElement
  cartoon: Cartoon = new Cartoon()
  loading: boolean = false
  imageFile: File | null = null
  titleRules = [(v: string) => v && v.length > 0 ? true : "Campo requerido"]


  created() {
    this.refresh()
  }

  refresh() {
    if (this.$route.params.id) CartoonService.getCartoon(this, Number(this.$route.params.id))
  }

  updateCartoon() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de actualizar la caricatura?",
          () => CartoonService.patchCartoon(this, this.cartoon.title, this.cartoon.body, this.imageFile, this.cartoon.id!)
      ))
    }
  }

  createCartoon() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de crear esta caricatura?",
          () => CartoonService.postCartoon(this, this.cartoon.title!, this.cartoon.body!, this.imageFile)
      ))
    }
  }

  deleteCartoon() {
    if (this.form.validate()) {
      getModule(DialogModule).showDialog(new Dialog(
          "Aviso",
          "¿Está seguro de eliminar esta caricatura?",
          () => CartoonService.deleteCartoon(this, this.cartoon.id!)
      ))
    }
  }
}
</script>
