import fetch from 'node-fetch'
import { createCodeHandler } from './utils'

const { GITHUB_OAUTH_CLIENT_ID = '', GITHUB_OAUTH_CLIENT_SECRET = '' } = process.env

async function oauth(code: string) {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    redirect: 'follow',
    method: 'post',
    body: JSON.stringify({
      code,
      client_id: GITHUB_OAUTH_CLIENT_ID,
      client_secret: GITHUB_OAUTH_CLIENT_SECRET,
    }),
  })

  const body = await res.json()
  const { access_token: accessToken, scope, error_description: errorDescription } = body
  if (errorDescription) {
    throw new Error(errorDescription)
  } else if (scope !== 'repo' || !accessToken || !(typeof accessToken === 'string')) {
    console.log(JSON.stringify(body))
    throw new Error(`Cannot resolve response from GitHub`)
  }
  return accessToken
}


// src/platforms/GitHub.ts
async listBranches(meta: MetaData): Promise<Branch[]> {
  const { user, repo } = meta
  const response = await this.request(
    `repos/${user}/${repo}/branches?per_page=100`
  )
  return response.map((b: any) => ({
    name: b.name,
    protected: b.protected,
  }))
}

export default createCodeHandler(oauth)
