<script setup lang="ts">
interface Step {
  id: number
  title: string
  description: string
  action: string
  actionUrl: string
  completed: boolean
}

interface Props {
  step: Step
  stepNumber: number
  totalSteps: number
  actionUrl: string
}

defineProps<Props>()
</script>

<template>
  <div class="step-card">
    <div class="step-header">
      <div class="step-number">{{ stepNumber }}</div>
      <div class="step-info">
        <h2>{{ step.title }}</h2>
        <p>{{ step.description }}</p>
      </div>
    </div>
    
    <div class="step-content">
      <div class="instructions">
        <div v-if="stepNumber === 1" class="instruction-details">
          <p>Click the button below to fork the vulnerable demo repository. This will create a copy under your GitHub account.</p>
          <ul>
            <li>You'll be redirected to GitHub</li>
            <li>The fork will be created automatically</li>
            <li>Come back here after forking</li>
          </ul>
        </div>
        
        <div v-if="stepNumber === 2" class="instruction-details">
          <p>Install the Kusari Inspector GitHub App on your forked repository.</p>
          <ul>
            <li>Click "Install" on the GitHub App page</li>
            <li>Select your forked repository</li>
            <li>Authorize the app permissions</li>
            <li>Return here after installation</li>
          </ul>
        </div>
        
        <div v-if="stepNumber === 3" class="instruction-details">
          <p>Create a Pull Request to trigger the security scan.</p>
          <ul>
            <li>The PR will merge the more-vulnerabilities branch into main</li>
            <li>Kusari Inspector will automatically scan the changes</li>
            <li>You'll see results directly on the PR page</li>
          </ul>
        </div>
        
        <div v-if="stepNumber === 4" class="instruction-details">
          <p>View the security analysis results on your Pull Request.</p>
          <ul>
            <li>Check for inline comments on vulnerable code</li>
            <li>Review the security check status</li>
            <li>See remediation suggestions</li>
          </ul>
        </div>
      </div>
      
      <div class="action-section">
        <a 
          v-if="actionUrl && stepNumber !== 4"
          :href="actionUrl" 
          target="_blank"
          class="action-button"
        >
          {{ step.action }}
          <svg class="external-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </a>
        
        <a 
          v-if="actionUrl && stepNumber === 4"
          :href="actionUrl" 
          target="_blank"
          class="action-button view-results"
        >
          {{ step.action }}
          <svg class="external-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </a>
        
        <div v-if="!actionUrl && stepNumber === 3" class="missing-username">
          <p>Enter your GitHub username above to generate the PR link</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.step-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.step-number {
  background: #4ade80;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.step-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.step-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.instruction-details {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #4ade80;
}

.instruction-details p {
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.instruction-details ul {
  margin: 0;
  padding-left: 1.5rem;
}

.instruction-details li {
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.action-section {
  display: flex;
  justify-content: center;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #4ade80;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.action-button:hover {
  background: #22c55e;
  transform: translateY(-2px);
}

.action-button.view-results {
  background: #3b82f6;
}

.action-button.view-results:hover {
  background: #2563eb;
}

.external-link-icon {
  width: 20px;
  height: 20px;
}

.missing-username {
  background: rgba(255, 193, 7, 0.2);
  color: #fbbf24;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.missing-username p {
  margin: 0;
  font-weight: 500;
}
</style>