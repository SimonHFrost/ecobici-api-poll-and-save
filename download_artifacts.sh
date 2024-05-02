#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Check if the GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN is not set. Please provide a valid token in the .env file."
  exit 1
fi

# Read the artifact URLs from the file
filename="artifact_urls.txt"

# Create the "artifacts" folder if it doesn't exist
mkdir -p artifacts

# Initialize a counter for unique IDs
counter=1

# Download each artifact
while IFS= read -r url; do
  # Generate a unique filename for the artifact
  artifact_filename="artifact_${counter}.zip"

  # Download the artifact and save it in the "artifacts" folder
  echo "Downloading artifact: $artifact_filename"
  curl -L -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github+json" -o "artifacts/$artifact_filename" "$url"

  # Check if the download was successful
  if [ $? -eq 0 ]; then
    echo "Successfully downloaded artifact: $artifact_filename"
  else
    echo "Failed to download artifact: $artifact_filename"
  fi

  # Increment the counter for the next artifact
  counter=$((counter + 1))
done < "$filename"