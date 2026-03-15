import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGO_URI")

print("--- 🐍 Python MongoDB Debugger ---")
print(f"Target: {uri[:25]}...{uri[-15:]}")

try:
    print("\nAttempting connection (timeout 15s)...")
    client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=15000)
    
    # The ismaster command is cheap and does not require auth.
    print("Step 1: Pinging server...")
    client.admin.command('ping')
    print("✅ PING SUCCESSFUL!")
    
    print("\nStep 2: Checking Auth and Database...")
    db = client.get_database() # gets database from URI (timeless-finds)
    print(f"Connected to DB: {db.name}")
    
    collections = db.list_collection_names()
    print(f"✅ AUTH SUCCESSFUL! Collections: {collections}")
    
except Exception as e:
    print("\n❌ CONNECTION FAILED!")
    print(f"Error Type: {type(e).__name__}")
    print(f"Error Message: {e}")
    
    if "authentication failed" in str(e).lower():
        print("\n💡 TIP: Your username or password in .env is incorrect.")
    elif "timeout" in str(e).lower():
        print("\n💡 TIP: Your IP might still be blocked by a local firewall or Atlas Whitelist is not propagating.")
