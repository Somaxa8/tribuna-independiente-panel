<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Entrvistas
        <v-spacer/>
        <v-btn @click="$router.push('/interview/create')" color="primary" small class="ml-5">Nueva Entrevista</v-btn>
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
        <v-data-table :headers="headers" :items="interviews" hide-default-footer :loading="loading" :items-per-page="itemsPerPage"
                      :show-select="false" :page.sync="page" @page-count="pageCount = $event" loading-text="Cargando..."
                      :search="search" no-results-text="No hay resultados" no-data-text="No hay resultados"
                      @click:row="rowClick">
          <template v-slot:item.videoUrl="{item}">
            <v-btn :href="item.videoUrl" target="_blank" link>ENTREVISTA</v-btn>
          </template>
            <template v-slot:item.createdBy="{item}">
                <v-chip v-if="item.createdBy" class="ma-2" color="info" label>
                    {{ item.createdBy.name }}
                </v-chip>
            </template>
            <template v-slot:item.createdAt="{item}">
                <v-chip class="ma-2" color="info" label>
                    {{ item.createdAt.setLocale("es").toFormat('dd MMMM yyyy') }}
                </v-chip>
            </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import {Component, Ref, Vue} from "vue-property-decorator";
import Interview from "@/models/Interview";
import InterviewService from "@/services/InterviewService";

@Component
export default class InterviewsView extends Vue {
  @Ref() readonly form!: HTMLFormElement
  dialog: boolean = false
  interviews: Interview[] = []
  page: number = 1
  itemsPerPage: number = 8
  pageCount: number = 0
  loading: boolean = false
  search: string = ""
  headers = [
    { text: "Id", value: "id", width: "200px" },
    { text: "Titulo", value: "title", width: "200px" },
    { text: "Url", value: "videoUrl", width: "200px" },
    { text: "Fecha de creación", value: "createdAt", width: "200px" },
    { text: "Creado por", value: "createdBy", width: "200px" },
  ]

  created() {
    InterviewService.getInterviews(this, this.interviews, this.page - 1, this.itemsPerPage)
  }

  rowClick(interview: Interview) {
    this.$router.push({path: "/interview/update/" + interview.id})
  }

}
</script>