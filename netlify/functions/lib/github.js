const { Octokit } = require("@octokit/rest");

function client() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN manquant dans l'environnement");
  return new Octokit({ auth: token });
}

async function createClientRepo({ clientSlug, commandeId, description }) {
  const org = process.env.GITHUB_ORG;
  const octokit = client();
  const name = `bot-${clientSlug}-${commandeId}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  try {
    const { data } = org
      ? await octokit.repos.createInOrg({ org, name, private: true, description, auto_init: true })
      : await octokit.repos.createForAuthenticatedUser({ name, private: true, description, auto_init: true });
    return { repoUrl: data.html_url, fullName: data.full_name, defaultBranch: data.default_branch };
  } catch (err) {
    throw new Error(`GitHub createClientRepo a échoué: ${err.message}`);
  }
}

async function listRecentCommits(owner, repo, { perPage = 10 } = {}) {
  const octokit = client();
  try {
    const { data } = await octokit.repos.listCommits({ owner, repo, per_page: perPage });
    return data.map((c) => ({
      sha: c.sha.slice(0, 7),
      message: c.commit.message,
      author: c.commit.author?.name,
      date: c.commit.author?.date,
      url: c.html_url,
    }));
  } catch (err) {
    throw new Error(`GitHub listRecentCommits a échoué: ${err.message}`);
  }
}

module.exports = { createClientRepo, listRecentCommits };
