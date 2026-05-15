import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ghRepo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isUserOrOrgPage = ghRepo?.endsWith('.github.io')
const base = ghRepo && !isUserOrOrgPage ? `/${ghRepo}/` : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
