#!/bin/zsh
cd -- "$(dirname -- "$0")/.."
python3 scripts/setup-ai.py
printf "\nPress Return to close."
read
