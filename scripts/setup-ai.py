"""Run directly in your own terminal. Never pass a provider key as an argument."""
import getpass
import json
import os
from pathlib import Path
import secrets
import subprocess

os.chdir(Path(__file__).resolve().parent.parent / "backend")
cmd = ["npx", "--yes", "wrangler@4"]
print("This sets up your private planner API on Cloudflare. Sign in or create an account when asked.")
subprocess.run(cmd + ["login"], check=True)
subprocess.run(cmd + ["deploy"], check=True)
key = getpass.getpass("Paste your OpenAI API key (hidden): ").strip()
if not key.startswith("sk-"):
    raise SystemExit("Expected an OpenAI API key. Nothing was uploaded.")
code = secrets.token_urlsafe(32)
# Secrets go through stdin, never shell arguments, files, GitHub, or browser code.
subprocess.run(cmd + ["secret", "bulk"], input=json.dumps({
    "OPENAI_API_KEY": key, "PLANNER_ACCESS_TOKEN": code
}), text=True, check=True)
key = ""
print("\nIn Still Days → Settings → AI planner:")
print("1. Enter the https://billow-planner.…workers.dev URL shown above.")
print("2. Enter this private planner access code (not your OpenAI key):")
print(code)
print("3. Save, then use Shape my day. Keep the access code private.")
