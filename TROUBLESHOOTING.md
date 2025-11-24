# MongoDB Connection Troubleshooting

## Authentication Failed Error

If you're getting `SCRAM failure: bad auth : authentication failed`, check the following:

### 1. Verify MongoDB Atlas Credentials

**Double-check in MongoDB Atlas:**
- Go to MongoDB Atlas Dashboard
- Navigate to **Database Access** (in the left sidebar)
- Verify the username: `kalisagad05_db_user`
- Check if the password is exactly: `Kigali20@`

**If the password is different:**
- Update the `.env` file with the correct password
- URL-encode special characters:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `%` becomes `%25`
  - etc.

### 2. Check IP Whitelist

**MongoDB Atlas requires IP whitelisting:**

1. Go to MongoDB Atlas Dashboard
2. Click on **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Either:
   - Add your current IP address
   - Or temporarily add `0.0.0.0/0` (allow from anywhere) - **⚠️ Only for testing!**

### 3. Verify Database User Permissions

**Check user permissions:**
1. Go to **Database Access**
2. Find your user: `kalisagad05_db_user`
3. Click **Edit**
4. Ensure the user has:
   - **Atlas Admin** role, OR
   - **Read and write to any database** permissions

### 4. Test Connection String Format

Try these connection string variations in your `.env` file:

**Option 1: Standard format**
```
DATABASE_URL="mongodb+srv://kalisagad05_db_user:Kigali20%40@cluster0.uamtdm9.mongodb.net/uzaempower?retryWrites=true&w=majority"
```

**Option 2: Without database name (Prisma will create it)**
```
DATABASE_URL="mongodb+srv://kalisagad05_db_user:Kigali20%40@cluster0.uamtdm9.mongodb.net/?retryWrites=true&w=majority"
```

**Option 3: Direct password (if encoding is the issue)**
If URL encoding causes issues, you might need to create a new user with a password that doesn't contain special characters.

### 5. Test Connection Manually

You can test the connection using MongoDB Compass or the MongoDB shell:

```bash
# Using MongoDB Compass
# Download from: https://www.mongodb.com/products/compass
# Use connection string: mongodb+srv://kalisagad05_db_user:Kigali20@cluster0.uamtdm9.mongodb.net/
```

### 6. Verify Cluster Status

1. Go to **Clusters** in MongoDB Atlas
2. Ensure your cluster is **running** (not paused)
3. Check the cluster name matches: `Cluster0`

### 7. Check Connection String from Atlas

**Get the official connection string from Atlas:**
1. Go to **Clusters**
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your actual password (URL-encoded)
6. Replace `<database>` with `uzaempower`

### Common Issues

**Issue: Password contains special characters**
- Solution: URL encode the password (`@` = `%40`, `#` = `%23`, etc.)

**Issue: Database doesn't exist**
- Solution: Prisma will create it, but make sure the connection string is correct

**Issue: User doesn't have permissions**
- Solution: Give the user **Atlas Admin** role or **Read and write to any database**

**Issue: IP not whitelisted**
- Solution: Add your IP to Network Access whitelist, or use `0.0.0.0/0` for testing

## Quick Fix Checklist

- [ ] Verified username and password in MongoDB Atlas
- [ ] Added IP address to Network Access whitelist
- [ ] Verified user has proper permissions
- [ ] Checked cluster is running
- [ ] Tested connection string format
- [ ] URL-encoded password if it contains special characters

