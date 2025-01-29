#!/usr/bin/env bash

# Set up trap to kill background processes on script exit
cleanup() {
  echo "Cleaning up..."
  kill $(jobs -p) 2>/dev/null
  exit
}
trap cleanup EXIT INT TERM

# Install the dependencies

# Start the api server in the background
pushd server || exit
pnpm install
pnpm start >/dev/null &
popd || exit

# Start a local web server that serves index.html on port 8080
python -m http.server 8080 >/dev/null &

# Print web server URL
echo 'Front-end is up on http://localhost:8080'

# Halt here until user kills the script
read -r -d '' _ </dev/tty
