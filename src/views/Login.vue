<template>
  <v-container fluid>
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        v-model="email"
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        autocomplete="off"
        :error-messages="emailErrors"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password
        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Forgot login password?
        </a>
      </div>

      <v-text-field
        v-model="password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="toggleVisibility"
        autocomplete="new-password"
      ></v-text-field>

      <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="login"
        :disabled="!isEmailValid"
      >
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import apiService from '@/services/apiService';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const router = useRouter();
const email = ref('');
const password = ref('');
const visible = ref(false);

// Computed property to validate email format
const isEmailValid = computed(() => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
  return regex.test(email.value);
});

// Error messages for email validation
const emailErrors = computed(() => {
  return isEmailValid.value ? [] : ['Invalid email format'];
});

const toggleVisibility = () => {
  visible.value = !visible.value;
};

const login = async () => {
  if (!isEmailValid.value) {
    return; // Prevent login if email is invalid
  }

  try {
    let response = await apiService.store('login', {
      email: email.value,
      password: password.value
    });

    if (response.status == 200) { // Check if response.ok is a property
      cookies.set("token", response.data.token, '1min')
      router.push({ name: 'Home' });
    } else {
      console.error('Login failed');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
</script>