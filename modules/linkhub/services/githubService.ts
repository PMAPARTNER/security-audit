interface GitHubConfig {
  username: string;
  repo: string;
  token: string;
}

export const uploadToGitHub = async (
  config: GitHubConfig,
  content: string,
  filename: string = 'index.html'
): Promise<string> => {
  const { username, repo, token } = config;
  const url = `https://api.github.com/repos/${username}/${repo}/contents/${filename}`;

  // 1. Get current file SHA (if it exists) to allow updating
  let sha: string | undefined;
  try {
    const getResponse = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
    }
  } catch (e) {
    // Ignore error, file might not exist yet
  }

  // 2. Upload/Update file
  const putResponse = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Update ${filename} via LinkHub`,
      content: btoa(unescape(encodeURIComponent(content))), // Handle UTF-8 strings correctly for Base64
      sha: sha, // Required if updating an existing file
    }),
  });

  if (!putResponse.ok) {
    const errorData = await putResponse.json();
    throw new Error(errorData.message || 'Failed to upload to GitHub');
  }

  // Return the GitHub Pages URL (Standard format)
  return `https://${username}.github.io/${repo}/`;
};