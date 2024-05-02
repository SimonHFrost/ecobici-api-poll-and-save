const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Replace with your GitHub username and repository name
const username = 'simonhfrost';
const repo = 'ecobici-api-poll-and-save';

// Get the personal access token from the environment variable
const token = process.env.GITHUB_TOKEN;

// GitHub API endpoint to list all workflow runs
const workflowRunsUrl = `https://api.github.com/repos/${username}/${repo}/actions/runs`;

// Function to retrieve artifact URLs for a specific run
async function getRunArtifactUrls(runId) {
  const artifactsUrl = `https://api.github.com/repos/${username}/${repo}/actions/runs/${runId}/artifacts`;

  try {
    const response = await fetch(artifactsUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const artifacts = data.artifacts;
      const artifactUrls = artifacts.map(artifact => artifact.archive_download_url);
      artifactUrls.forEach(url => {
        console.log(`Artifact URL retrieved: ${url}`);
      });
      return artifactUrls;
    } else {
      console.log(`Failed to retrieve artifacts for run: ${runId}`);
      return [];
    }
  } catch (error) {
    console.log(`Error retrieving artifacts for run: ${runId}`);
    return [];
  }
}

// Function to retrieve all workflow runs with pagination
async function getAllWorkflowRuns(url, allRuns = []) {
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const runs = data.workflow_runs;
      allRuns.push(...runs);

      const nextPageUrl = getNextPageUrl(response.headers.get('Link'));
      if (nextPageUrl) {
        return getAllWorkflowRuns(nextPageUrl, allRuns);
      }
    } else {
      console.log('Failed to retrieve workflow runs');
    }
  } catch (error) {
    console.log('Error retrieving workflow runs');
  }

  return allRuns;
}

// Function to extract the URL of the next page from the Link header
function getNextPageUrl(linkHeader) {
  if (!linkHeader) return null;

  const links = linkHeader.split(',');
  for (const link of links) {
    const [url, rel] = link.split(';');
    if (rel.trim() === 'rel="next"') {
      return url.trim().slice(1, -1);
    }
  }

  return null;
}

// Function to retrieve artifact URLs for all runs and save to file
async function saveArtifactUrlsToFile(filename) {
  const allRuns = await getAllWorkflowRuns(workflowRunsUrl);
  const artifactUrls = [];

  for (const run of allRuns) {
    const runId = run.id;
    const runArtifactUrls = await getRunArtifactUrls(runId);
    artifactUrls.push(...runArtifactUrls);
  }

  fs.writeFileSync(filename, artifactUrls.join('\n'));
  console.log(`Artifact URLs saved to ${filename}`);
}

// Specify the filename to save the artifact URLs
const filename = 'artifact_urls.txt';

// Start retrieving artifact URLs and save to file
saveArtifactUrlsToFile(filename);