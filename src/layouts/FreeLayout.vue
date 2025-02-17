<template>
     <v-layout>
      <v-app-bar
        color="rgb(91, 167, 149)"
      >

        <v-app-bar-title>Daily Timesheet</v-app-bar-title>

        <v-spacer></v-spacer>
      <v-btn text @click="navigateTo('Login')">Login</v-btn>
      </v-app-bar>

      <v-main>
        <router-view></router-view>
      </v-main>
    </v-layout>
    
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
const navigateTo = (path) => {
   router.push(path);
   router.push({ name: path });
};
</script>

<style scoped>

</style>