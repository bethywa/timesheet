<template>
  <v-container fluid class="d-flex align-center justify-center" style="height: 100vh;">
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <!-- Project-Specific Greeting -->
      <div class="text-center mb-6">
        <v-img
          src="@/assets/logo.png"
          alt="Daily Timesheet Logo"
          max-width="120"
          class="mx-auto"
        ></v-img>
        <div class="text-h5 mt-4">Daily Timesheet</div>
        <div class="text-body-1 text-medium-emphasis">
          Track and manage your daily tasks and time entries.
        </div>
      </div>

      <!-- Email Field -->
      <div class="text-subtitle-1 text-medium-emphasis">Email</div>
      <v-text-field
        v-model="email"
        density="compact"
        placeholder="Enter your email"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        autocomplete="off"
        :error-messages="emailErrors"
      ></v-text-field>

      <!-- Password Field -->
      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password
        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Forgot password?
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

      <!-- Login Button -->
      <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="login"
        :disabled="!isEmailValid || !password"
      >
        Log In
      </v-btn>

      <!-- Error Message (Optional) -->
      <v-alert v-if="errorMessage" type="error" class="mb-4">
        {{ errorMessage }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import apiService from '@/services/apiService';

const { cookies } = useCookies();
const router = useRouter();
const email = ref('');
const password = ref('');
const visible = ref(false);
const errorMessage = ref('');

// Computed property to validate email format
const isEmailValid = computed(() => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
  return regex.test(email.value);
});

// Error messages for email validation
const emailErrors = computed(() => {
  return isEmailValid.value ? [] : ['Invalid email format'];
});

// Toggle password visibility
const toggleVisibility = () => {
  visible.value = !visible.value;
};

// Login function
const login = async () => {
  if (!isEmailValid.value || !password.value) {
    errorMessage.value = 'Please enter a valid email and password.';
    return;
  }

  try {
    const response = await apiService.store('login', {
      email: email.value,
      password: password.value,
    });

    if (response.status === 200) {
      cookies.set('token', response.data.token, '60min'); // Set token in cookies
      router.push({ name: 'Home' }); // Redirect to home page
    } else {
      errorMessage.value = 'Login failed. Please check your credentials.';
    }
  } catch (error) {
    errorMessage.value = 'An error occurred. Please try again later.';
    console.error('Login error:', error);
  }
};
</script>

<style scoped>
/* Optional: Add custom styles here */
</style>