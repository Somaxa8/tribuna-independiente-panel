<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Cabeceras
        <v-spacer/>
        <v-btn @click="$router.push('/headline/create')" color="primary" small class="ml-5">Nueva Cabecera</v-btn>
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
        <v-data-table :headers="headers" :items="headlines" hide-default-footer :loading="loading" :items-per-page="itemsPerPage"
                      :show-select="false" :page.sync="page" @page-count="pageCount = $event" loading-text="Cargando..."
                      :search="search" no-results-text="No hay resultados" no-data-text="No hay resultados"
                      @click:row="rowClick">
          <template v-slot:item.body="{item}">
            {{item.body.slice(0, 18)}}...
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from "vue-property-decorator";
import Headline from "@/models/Headline";
import HeadlineService from "@/services/HeadlineService";

@Component
export default class HeadlinesView extends Vue {
  @Ref() readonly form!: HTMLFormElement
  dialog: boolean = false
  headlines: Headline[] = []
  page: number = 1
  itemsPerPage: number = 8
  pageCount: number = 0
  loading: boolean = false
  search: string = ""
  headers = [
    { text: "Id", value: "id", width: "200px" },
    { text: "Contenido", value: "body", width: "200px" },
    { text: "Hora", value: "hour", width: "200px" }
  ]
  file: File | null = null

  created() {
    HeadlineService.getHeadlines(this, this.headlines, this.page - 1, this.itemsPerPage)
  }

  rowClick(headline: Headline) {
    this.$router.push({path: "/headline/update/" + headline.id})
  }

}
</script>
