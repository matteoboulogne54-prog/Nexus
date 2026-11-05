const { wrap } = require("./lib/http");
const github = require("./lib/github");

exports.handler = wrap(({ params }) => {
  const { owner, repo } = params;
  if (!owner || !repo) throw new Error("Paramètres 'owner' et 'repo' requis");
  return github.listRecentCommits(owner, repo);
});
