#!/usr/bin/env python3
"""
Clear Python bytecode cache before starting server
This ensures fresh code is loaded on every deployment
"""

import os
import sys
import shutil

def clear_pycache():
    """Remove all __pycache__ directories and .pyc files"""
    print("=" * 80)
    print("🧹 CLEARING PYTHON BYTECODE CACHE")
    print("=" * 80)
    
    cache_count = 0
    pyc_count = 0
    
    # Walk through all directories
    for root, dirs, files in os.walk('.'):
        # Remove __pycache__ directories
        if '__pycache__' in dirs:
            cache_dir = os.path.join(root, '__pycache__')
            print(f"   Removing: {cache_dir}")
            shutil.rmtree(cache_dir)
            cache_count += 1
            dirs.remove('__pycache__')  # Don't recurse into it
        
        # Remove .pyc files
        for file in files:
            if file.endswith('.pyc'):
                pyc_file = os.path.join(root, file)
                print(f"   Removing: {pyc_file}")
                os.remove(pyc_file)
                pyc_count += 1
    
    print(f"✅ Cleared {cache_count} __pycache__ directories")
    print(f"✅ Removed {pyc_count} .pyc files")
    print("=" * 80)

if __name__ == '__main__':
    clear_pycache()
    print("🚀 Starting Flask server...")
    
    # Now run the actual app
    import app
