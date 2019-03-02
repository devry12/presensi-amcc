<template>
  <v-app>
    <v-toolbar app flat>
      <v-toolbar-side-icon @click="side = !side"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">AMCC PRESENSI</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-navigation-drawer v-model="side"  app class="blue light1" dark >
    <v-list>
      <v-list-tile v-for="item in items":key="item.title" router :to="item.route">

        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>

    <v-content class="mx-4 mb-4">
        <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Home from './components/Home';

export default {
  name: 'App',
  components: {
    Home,
  },
  data () {
    return {
      side:false,
      items: [
          { title: 'Dashboard', icon: 'dashboard',route:'/' },
          { title: 'Presensi', icon: 'account_box',route:'/presensi' },
          { title: 'rekap', icon: 'gavel',route:'/rekap' }
        ],
    }
  }
}
</script>
