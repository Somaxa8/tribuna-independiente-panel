<template>
  <v-navigation-drawer app v-model="enabled" clipped>
    <v-list dense nav>
      <v-list-item-group>
        <v-list-item two-line>
          <v-avatar color="primary white--text">
            {{avatarInitials}}
          </v-avatar>
          <v-list-item-content class="ml-2">
            <strong class="subtitle-2">{{sessionModule.session.user.email}}</strong><br>
            <v-row class="pa-0">
              <v-col class="py-0">
                <v-chip x-small color="primary" v-for="authority in sessionModule.session.authorities" :key="authority.name">
                  {{authority.title.replace("role", "")}}
                </v-chip>
              </v-col>
            </v-row>
          </v-list-item-content>

        </v-list-item>
        <v-divider class="my-2"></v-divider>

        <div v-for="item in list">
          <v-divider v-if="item.divider" class="mt-2"></v-divider>
          <v-subheader v-if="item.subheader" class="text-uppercase" style="height: 30px">{{item.subheader}}</v-subheader>
          <v-list-item :to="item.to" v-if="!item.hidden">
            <v-list-item-action>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{item.title}}</v-list-item-title>
              <v-list-item-subtitle v-if="item.subtitle">{{item.subtitle}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

        </div>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import SessionModule from "@/store/SessionModule";
import {getModule} from "vuex-module-decorators";
import DeviceTool from "@/services/tool/DeviceTool";
import DrawerModule from "@/store/DrawerModule";

@Component
export default class DrawerComponent extends Vue {

  sessionModule: SessionModule = getModule(SessionModule)
  drawerModule: DrawerModule = getModule(DrawerModule)

  avatarInitials: string = ""

  list = [
    {title: "Inicio", to: "/", icon: "mdi-home", subtitle: "Pantalla de inicio"},
    {title: "Usuarios", to: "/users", icon: "mdi-account-multiple", subheader: "Usuarios", divider: true},
    {title: "Colecciones", to: "/collections", icon: "mdi-bookshelf", subheader: "Mercurio", divider: true},
    {title: "Promociones", to: "/promos", icon: "mdi-percent"},
    {title: "Videos", to: "/videos", icon: "mdi-video"},
    {title: "Características", to: "/product-feature-types", icon: "mdi-tag-multiple", subheader: "Catálogo", divider: true},
    {title: "Familia de productos", to: "/product-categories", icon: "mdi-shape"},
    {title: "Productos", to: "/products", icon: "mdi-package-variant"},
    {title: "Banners", to: "/banners", icon: "mdi-image", subheader: "Publicidad", divider: true},
    {title: "Notificaciones", to: "/notifications", icon: "mdi-bell"},
  ]

  created() {
    if (DeviceTool.isMedium(this)) {
      this.drawerModule.closeOpenDrawer()
    }
    this.createAvatarInitials()
  }

  get enabled() {
    return this.drawerModule.showDrawer
  }
  set enabled(enabled: boolean) {
    this.drawerModule.setDrawerEnabled(enabled)
  }

  createAvatarInitials() {
    let name: string = this.sessionModule.session.user.name!;
    let lastname: string = this.sessionModule.session.user.lastname!
    let n: string = (name != null && name.length > 0) ? name.substring(0, 1).toUpperCase() : ""
    let l: string = (lastname != null && lastname.length > 0) ? lastname.substring(0, 1).toUpperCase() : ""
    if (n.length == 0 && l.length == 0) {
      this.avatarInitials = this.sessionModule.session.user.email!.substring(0, 1).toUpperCase()
    } else {
      this.avatarInitials = n + l;
    }
  }

}
</script>