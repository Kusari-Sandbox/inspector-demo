# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack application with a Vue.js frontend and Go backend:

- `frontend/` - Vue 3 + TypeScript + Vite application
- `backend/` - Go application (minimal setup currently)

## Development Commands

### Frontend (Vue.js)
- `cd frontend && npm run dev` - Start development server
- `cd frontend && npm run build` - Build for production (runs vue-tsc type check then vite build)
- `cd frontend && npm run preview` - Preview production build

### Backend (Go)
- Backend is minimal with only a go.mod file currently
- Standard Go commands would apply once main.go is added

## Architecture Overview

### Frontend
- Vue 3 with Composition API using `<script setup>` syntax
- TypeScript for type safety
- Vite for fast development and building
- Standard Vue SFC (Single File Component) structure
- Components located in `src/components/`

### Backend
- Go module: `github.com/kusari-sandbox/inspector-demo/backend`
- Currently minimal setup - ready for expansion

## Key Technologies
- Frontend: Vue 3, TypeScript, Vite
- Backend: Go 1.24.4
- Build tool: Vite (frontend), Go toolchain (backend)

Great. I’ll put together a step-by-step implementation plan for a self-service GitHub App demo experience using the Kusari Inspector. This will include frontend flow, GitHub API interactions, automation around repo forking, app installation, PR creation, and triggering the scan with a Golang-based vulnerable repo example.

I’ll share a clean, streamlined plan for both static and optionally server-backed deployments, along with sample code snippets or components where helpful.

# Automating a Self-Service Demo for the Kusari Inspector GitHub App

**Goal:** Create a smooth, self-service workflow where a user can **fork a demo repository**, **install the Kusari Inspector GitHub App** on that fork, and **open a Pull Request** (PR) that triggers the app to scan the code and display results. This will let users easily test Kusari Inspector on example "bad code" with minimal manual steps.

## Overview of the Demo Workflow

1. **User visits the demo site (or scans a QR code)** – The site explains the steps and provides one-click actions to guide the user.
2. **Fork the demo repository** – The user clicks a "Fork Repo" button to get their own copy of an example vulnerable repository.
3. **Install Kusari Inspector on the fork** – The user clicks an "Install App" button and goes through GitHub’s standard app installation flow for their new repo.
4. **Open a Pull Request in the fork** – The user clicks a "Create PR" button to open a PR from a branch with insecure code into the main branch of the fork.
5. **View scan results** – Kusari Inspector (installed on the repo) automatically scans the PR and provides inline feedback (comments or PR checks) highlighting security issues. The user can see the results directly on the GitHub PR page.

Each of these steps can be streamlined with minimal user input. Below we detail how to implement each part for a seamless experience.

## Preparing an Example Vulnerable Repository

You will need a GitHub repository containing code with intentional security issues (“bad code”) to demonstrate the scanner:

* **Choose or create a vulnerable app:** If you don’t have one, you can create a small Go application with known security flaws. For example, the open-source **Damn Vulnerable Golang** project contains *intentional vulnerabilities* (SQL injection, command injection, hardcoded credentials, etc.). This could serve as inspiration or even be used directly. Ensure the vulnerabilities are ones Kusari Inspector can detect (e.g. outdated dependencies or insecure code patterns).
* **Include a safe baseline branch:** For the PR demo, consider having a clean `main` branch and a `vulnerable` branch with the insecure changes. This way, a PR from `vulnerable` into `main` will introduce the “bad code.”
* **Keep the repo small and public:** A simpler repository (perhaps a minimal web app or library) is best for users to fork quickly. Public visibility will allow the GitHub App to be installed easily (Kusari Inspector likely works on public or private, but public is simpler for a demo).

If you prefer not to create a new Go app from scratch, you could use an existing vulnerable project like OWASP Juice Shop (Node.js) for demonstration. However, since you prefer Golang, a Go-based example will align better with your stack and highlight relevant issues.

## Step 1: Forking the Demo Repository

**Goal:** Make it as easy as clicking a button for the user to get their own copy of the demo code.

* **Direct “Fork” link:** You can use a special GitHub URL to initiate a fork. For example, `https://github.com/**owner**/**demo-repo**/fork` will prompt the user to fork the repository. This is effectively what the GitHub "Fork" button does. On your demo site, have a **“Fork this repository”** button that links to that URL.

  * *When clicked:* If the user is not logged in to GitHub, they will be asked to log in. If they have multiple organizations, GitHub will ask which account to fork into. In most cases (personal account), it will immediately create the fork and redirect the user to their new repository.
  * This approach is very simple (no coding against the GitHub API) and leverages GitHub’s UI flow. The user ends up on GitHub, viewing their forked repo.
* **Alternative – Template repository (optional):** As an alternative to forking, you could mark the demo repo as a *template*. Then on your site, a “Use this template” button could send users to GitHub’s **Create a new repo** page with the template pre-selected. This requires the user to name the new repo, which is slightly more input than a fork (which defaults to the same name). Given the goal of simplicity, the direct fork link is likely better.

> **Note:** At this stage, the site can either open the fork link in a new tab or window (so your demo site stays open in the original tab). In your instructions, you might say “Click the button to fork the repository on GitHub, then come back here for the next step.” This ensures the user doesn’t get lost after forking.

## Step 2: Installing the Kusari Inspector App on the Fork

**Goal:** Guide the user to install the GitHub App on their newly created repo.

* **App installation link:** Provide a button linking to `https://github.com/apps/kusari-inspector/installations/new`. This is the standard URL to install a GitHub App by its name. The user will be taken to GitHub’s install flow for **Kusari Inspector**.

  * *During installation:* The user will choose their personal account (or org) and then select the forked repository to install the app on. (Since they just forked, it should appear in the repository list. They can also grant access to “All repositories” for simplicity, but you can instruct selecting just the new fork.)
  * The GitHub App will request the permissions it needs; the user must confirm and click “Install”. By design, **this step cannot be fully automated via API** (users must manually approve installs for security reasons).
* **Post-install redirect (optional):** Kusari Inspector’s app configuration can include a *Setup URL* – a link that GitHub will redirect to after a successful install. If you control the app’s settings, you could set this to a specific page on your demo site (e.g. a “installation complete” page or the next step’s instructions). GitHub will append the `installation_id` to the URL when redirecting. This can be used if you want to programmatically confirm the install or personalize next steps (advanced, see below). If not, the user can manually return to the demo site after installing.

**Important:** Clearly instruct the user to **install the app on the forked repo**. If they skip this, the scanning won’t run. Emphasize that this is a one-time authorization step required by GitHub (and remind them the app is safe/trusted).

## Step 3: Triggering the Scan via a Pull Request

**Goal:** Have the user create a PR in their fork that will kick off Kusari Inspector’s analysis.

* **Prepare a branch for the PR:** Ensure the fork has at least two branches (for example, `main` and `vulnerable`). The `vulnerable` branch should contain the “bad code” changes relative to `main`. When merged, these changes would introduce security issues. This simulates a risky code change that the app should catch.
* **One-click PR creation:** On the demo site, provide a **“Open Pull Request”** button or link. You can directly link to the GitHub compare page for the fork, pre-selecting the branches. The URL pattern is:

  ```
  https://github.com/<your-username>/<repo-name>/compare/<base>...<head>
  ```

  For example, if the fork is under the user “**alice**” and the repo name is “**demo-insecure**”, and you want to merge `vulnerable` into `main`, the link would be:
  `https://github.com/alice/demo-insecure/compare/main...vulnerable`
  This loads GitHub’s compare view between the two branches. The user will see a **“Create Pull Request”** button on that page. They should click it to actually open the PR.

  * *How to get the correct username/repo in the URL:* If you set up the optional post-install redirect with the `installation_id`, your backend could use GitHub’s API to determine the username or org for that installation (and the repo name, if only one was installed). Alternatively, you can ask the user for their GitHub username on the site (or have them copy-paste the compare URL from their fork). To keep it simple, you might instruct: *“After installing, replace `YOUR-USERNAME` in the URL below and open it to create a PR.”* However, a small bit of automation here greatly improves UX.
  * *Automated approach:* If implementing a bit of JavaScript, you could detect the fork name dynamically. For instance, if the user came back via the setup redirect (which includes `installation_id`), you can call the GitHub API (via your backend or a cloud function) to list the repositories for that installation. That would tell you the fork’s `full_name` (e.g. `alice/demo-insecure`), which you can then use to craft the compare URL automatically.
* **User opens the PR:** The user will be prompted to enter a title/description (you can prefill a title via URL parameters or they can just click submit). After they confirm, the PR is created in their forked repository (merging `vulnerable` into `main` of their own repo).
* **Kusari Inspector runs:** Since the app is installed and configured to run on pull request events (as per Kusari’s design), it will execute when the PR is opened. The user doesn’t have to trigger anything else — the app will scan the code difference (and possibly the entire project) for issues.
* **Viewing results:** In the PR page on GitHub, the user should soon see the results. Kusari Inspector likely posts **inline comments or a PR review** with findings, and/or attaches a **status check or “checks” report**. For example, it might comment on lines of code that introduce a vulnerability, giving remediation advice. The demo site can instruct the user to scroll through the PR to see this feedback. This immediate, in-context highlighting of issues is exactly what the demo is meant to showcase.

## Implementation Considerations

**Technologies & Hosting:** Given your familiarity with Golang, Vue, and TypeScript, you have a few options:

* **Static Frontend (GH Pages or S3):** The simplest implementation is a static webpage (or single-page app) that contains the instructions and buttons. You can build this with plain HTML/JS or use a framework like Vue for better interactivity. This static site can be hosted on GitHub Pages or an AWS S3 static site. The advantage is low complexity: you mainly provide links and guidance, letting GitHub handle the heavy lifting for fork/PR flows.

  * Using Vue or a lightweight JS app, you could implement a nice step-by-step UI (e.g., showing Step 1 done, now Step 2, etc.). State can be kept in the browser (for example, after the user clicks “Fork”, you might show a “Forked? Proceed to install” with a Next button).
  * Without a backend, certain automations (like detecting the username or auto-creating the PR) are tricky. But as discussed, much can be achieved with static links (fork link, install link, compare link template).
* **Adding a Backend or OAuth (Advanced):** If you decide to further streamline the process (eliminating even the final “Create Pull Request” click, for example), you could implement a backend service:

  * A small **Golang server** (hosted on AWS or Heroku etc.) could handle GitHub API calls. For instance, after the user authorizes your web app via OAuth, the server could use their token to programmatically create the fork and even open the PR via GitHub’s REST API. The GitHub API has endpoints to **create a fork** and to **create a pull request** given a source and base branch.
  * Using the GitHub API requires the user to grant an OAuth app permission (scopes like `public_repo` for forking a public repo and creating PRs). This is an extra upfront step (signing in via your app), which adds complexity for the user, so weigh it against the benefit. Since a direct fork link is so easy, the fully static approach might actually be *simpler for the user* (one less authorization screen).
  * If implementing OAuth, you can use libraries like **Octokit.js** (for a pure frontend solution) or **go-github** in Golang on the backend to interact with GitHub. This could automate: forking the repo under the user’s account, creating the PR, and perhaps even pre-installing the GitHub App on the repo if that were possible (it’s not via API, as noted, the user must still approve the install manually).
  * **Hybrid approach:** You could use a static site for the UI but have a few serverless endpoints (AWS Lambda or similar) for post-installation to fetch the fork info or to create the PR. For example, when the user returns with an `installation_id`, your Lambda (with the GitHub App’s credentials) could identify the repo and respond with the correct PR URL or even trigger PR creation via an installation token (though the app’s installation token might not have permission to create PRs unless it has write access to contents).
* **Automatic triggers in demo app:** You mentioned the demo app itself “should trigger stuff automatically.” This likely refers to guiding the user from one step to the next without confusion. You can implement simple cues: e.g., after clicking “Fork”, the next button could become active or instructions visible. Consider including some basic check or timeout (“Once you’ve forked the repo, click Next to continue”). If you have the user’s GitHub login (via OAuth) or the installation callback, you might even verify that the fork exists or that the app was installed, and then auto-advance the steps or display a confirmation ("Repo forked successfully ✅"). This kind of feedback can make the demo feel polished.

## Ensuring a Smooth User Experience

To keep the process seamless and simple:

* **Provide clear instructions** at each step. For example, after clicking the install link, remind the user to select their forked repo during installation. After installing, tell them to come back to click the PR button.
* **Minimize user input:** The only typing ideally needed might be logging into GitHub (if not already) and the PR title. By using direct links and preselected branches, the user mostly just clicks through.
* **Testing the flow:** Run through the entire demo flow yourself (or better, have a fresh user test it) to identify any confusing points. For instance, ensure that the vulnerable branch in the fork is not immediately merged or deleted, etc., and that Kusari Inspector indeed responds on the PR as expected.
* **Resetting/Repeating:** If many users will use this (e.g., at a conference via QR code), consider how to reset or handle repeated runs. Each user will fork the same source repo, which is fine. The source repo should remain static (with the demo branches) so everyone gets the same starting point. There’s no need to clean up, since each fork is in the user’s account. But you might want to provide a way for a user to run it again (they could delete their fork and fork fresh, or just reuse the fork with another branch if you provide multiple demo scenario branches).

Finally, be sure to highlight what Kusari Inspector is doing on the PR. The value of the demo is in showing the **“inline feedback and safe-to-merge recommendations”** that Kusari provides. The end result is that the user sees a real example of security issues being caught **in real-time on their PR**, with minimal setup on their part. By following the steps above, you’ll achieve a highly automated demo that feels almost magic to the end user, while still staying within GitHub’s security constraints (no need for them to paste tokens or run CLI commands).

**Sources:**

* Stack Overflow – Quick link for forking a repository (using `.../fork` URL)
* GitHub Community Discussion – Confirmation that GitHub Apps cannot be installed via API without user interaction
* *Damn Vulnerable Golang* – Example of an intentionally insecure Go project (vulnerabilities list)
* Kusari Inspector product info – Highlights inline PR feedback for security issues (to ensure the demo aligns with expected behavior)
