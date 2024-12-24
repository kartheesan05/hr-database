#!/bin/bash

# Run npm build
echo "Running npm build..."
if npm run build; then
    # If build successful, copy required directories
    echo "Build successful, copying files..."
    cp -r public .next/standalone/
    cp -r .next/static .next/standalone/.next/
    
    # Prompt for commit message
    echo "Enter commit message:"
    read commit_message
    
    # Git operations
    echo "Adding files to git..."
    git add .
    
    echo "Committing changes..."
    git commit -m "$commit_message"
    
    # Push to git
    echo "Pushing to git..."
    git push
    
    echo "All operations completed successfully!"
else
    # If build fails, exit with error
    echo "Build failed! Git push aborted."
    exit 1
fi