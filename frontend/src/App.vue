<script setup lang="ts">
import { ref } from 'vue'
import StepCard from './components/StepCard.vue'

const currentStep = ref(0)
const userGithubUsername = ref('')

const steps = [
  {
    id: 1,
    title: 'Fork the Demo Repository',
    description: 'Create your own copy of the vulnerable demo repository. Ensure "Copy the main branch only is left unchecked.',
    action: 'Fork Repository',
    actionUrl: 'https://github.com/kusari-oss/inspector-demo-vulnerable/fork',
    completed: false
  },
  {
    id: 2,
    title: 'Install Kusari Inspector',
    description: 'Install the GitHub App on your forked repository',
    action: 'Install App',
    actionUrl: 'https://github.com/apps/kusari-inspector/installations/new',
    completed: false
  },
  {
    id: 3,
    title: 'Create Pull Request',
    description: 'Open a PR to trigger the security scan',
    action: 'Create PR',
    actionUrl: '',
    completed: false
  },
  {
    id: 4,
    title: 'View Results',
    description: 'See Kusari Inspector\'s security analysis on your PR',
    action: 'View PR',
    actionUrl: '',
    completed: false
  }
]

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const generatePRUrl = () => {
  if (userGithubUsername.value) {
    return `https://github.com/${userGithubUsername.value}/inspector-demo-vulnerable/compare/main...more-vulnerabilities`
  }
  return ''
}

const generateViewPRUrl = () => {
  if (userGithubUsername.value) {
    return `https://github.com/${userGithubUsername.value}/inspector-demo-vulnerable/pulls`
  }
  return ''
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Kusari Inspector Demo</h1>
      <p>Experience automated security scanning with a self-service demo</p>
    </header>

    <main class="main">
      <div class="progress-bar">
        <div 
          class="progress-fill"
          :style="{ width: `${((currentStep + 1) / steps.length) * 100}%` }"
        ></div>
      </div>

      <div class="step-container">
        <StepCard 
          :step="steps[currentStep]"
          :stepNumber="currentStep + 1"
          :totalSteps="steps.length"
          :actionUrl="currentStep === 2 ? generatePRUrl() : currentStep === 3 ? generateViewPRUrl() : steps[currentStep].actionUrl"
        />
      </div>

      <div class="username-input" v-if="currentStep === 2">
        <label for="github-username">Enter your GitHub username:</label>
        <input 
          id="github-username"
          v-model="userGithubUsername" 
          type="text" 
          placeholder="your-github-username"
        />
      </div>

      <div class="navigation">
        <button 
          @click="prevStep" 
          :disabled="currentStep === 0"
          class="nav-button prev"
        >
          Previous
        </button>
        <button 
          @click="nextStep" 
          :disabled="currentStep === steps.length - 1"
          class="nav-button next"
        >
          Next Step
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.main {
  width: 100%;
  max-width: 600px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4ade80;
  transition: width 0.3s ease;
}

.step-container {
  margin-bottom: 2rem;
}

.username-input {
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.username-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.username-input input {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background: white;
  color: #333;
  font-size: 1rem;
}

.navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button.prev {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-button.next {
  background: #4ade80;
  color: white;
}

.nav-button:hover:not(:disabled) {
  transform: translateY(-2px);
}
</style>
