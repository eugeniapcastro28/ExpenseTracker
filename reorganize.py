#!/usr/bin/env python3
import os
import shutil
from pathlib import Path

# Base path
base_path = Path("frontend/src")
pages_path = base_path / "pages"

# Mapping of old folders to new folders
page_mappings = {
    "auth": "Auth",
    "dashboard": "Dashboard",
    "expense": "Expense",
    "income": "Income",
    "recurring": "Recurring",
    "transactions": "Transactions",
    "add-transaction": "AddTransaction",
}

# Create new folders
for new_folder in set(page_mappings.values()):
    new_path = pages_path / new_folder
    new_path.mkdir(parents=True, exist_ok=True)

# Move files
for old_folder, new_folder in page_mappings.items():
    old_path = pages_path / old_folder
    new_path = pages_path / new_folder
    
    if old_path.exists():
        for file in old_path.glob("*.jsx"):
            print(f"Copying {file.name} to {new_folder}/")
            shutil.copy(file, new_path / file.name)

# Remove old folders
for old_folder in page_mappings.keys():
    old_path = pages_path / old_folder
    if old_path.exists() and old_path.is_dir():
        print(f"Removing {old_folder}/")
        shutil.rmtree(old_path)

print("Pages reorganization complete!")
