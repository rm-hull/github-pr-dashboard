export type GitHubSearchItem = {
  id: number
  number: number
  title: string
  html_url: string
  repository_url: string // e.g. https://api.github.com/repos/owner/repo
  repository_full_name?: string // computed
}
