<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Noticias
        <v-spacer/>
        <v-btn @click="$router.push('/news/create')" color="primary" small class="ml-5">Nueva noticia</v-btn>
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
        <v-data-table :headers="headers" :items="news" hide-default-footer :loading="loading" :items-per-page="itemsPerPage"
                      :show-select="false" :page.sync="page" @page-count="pageCount = $event" loading-text="Cargando..."
                      :search="search" no-results-text="No hay resultados" no-data-text="No hay resultados"
                      @click:row="rowClick">
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from "vue-property-decorator";
import News from "@/models/News";
import NewsService from "@/services/NewsService";

@Component
export default class NewsView extends Vue {
  @Ref() readonly form!: HTMLFormElement
  dialog: boolean = false
  news: News[] = []
  page: number = 1
  itemsPerPage: number = 8
  pageCount: number = 0
  loading: boolean = false
  search: string = ""
  headers = [
    { text: "Id", value: "id", width: "200px" },
    { text: "Titulo", value: "title", width: "200px" },
  ]
  file: File | null = null

  created() {
    NewsService.getNewsPaginated(this, this.news, this.page - 1, this.itemsPerPage, null)
  }

  rowClick(news: News) {
    this.$router.push({path: "/news/update/" + news.id})
  }

}
</script>