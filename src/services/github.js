const GITHUB_API = "https://api.github.com";

function headers(env) {
  if (!env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN manquant dans l'environnement");
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "nexus-worker",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function createClientRepo(env, { clientSlug, commandeId, description }) {
  const name = `bot-${clientSlug}-${commandeId}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const org = env.GITHUB_ORG;
  const url = org ? `${GITHUB_API}/orgs/${org}/repos` : `${GITHUB_API}/user/repos`;

  const res = await fetch(url, {
    method: "POST",
    headers: headers(env),
    body: JSON.stringify({ name, private: true, description, auto_init: true }),
  });
  if (!res.ok) throw new Error(`GitHub createClientRepo a échoué (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return { repoUrl: data.html_url, fullName: data.full_name, defaultBranch: data.default_branch };
}

export async function listRecentCommits(env, owner, repo, { perPage = 10 } = {}) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=${perPage}`, {
    headers: headers(env),
  });
  if (!res.ok) throw new Error(`GitHub listRecentCommits a échoué (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.map((c) => ({
    sha: c.sha.slice(0, 7),
    message: c.commit.message,
    author: c.commit.author?.name,
    date: c.commit.author?.date,
    url: c.html_url,
  }));
}
