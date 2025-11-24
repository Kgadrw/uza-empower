# MongoDB Setup Guide

## Connection String

The backend is now configured to use MongoDB Atlas. The connection string has been set up in `.env`:

```
DATABASE_URL="mongodb+srv://kalisagad05_db_user:Kigali20%40@cluster0.uamtdm9.mongodb.net/uzaempower?appName=Cluster0"
```

**Note**: The password `Kigali20@` is URL-encoded as `Kigali20%40` in the connection string (the `@` symbol is encoded as `%40`).

## Database Setup Steps

1. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

2. **Push Schema to MongoDB**
   ```bash
   npm run prisma:push
   ```
   
   This will create all collections in your MongoDB database. Unlike PostgreSQL, MongoDB doesn't use traditional migrations - Prisma will sync your schema directly.

3. **Verify Connection**
   ```bash
   npm run prisma:studio
   ```
   
   This opens Prisma Studio where you can view and manage your database.

## Important MongoDB Notes

- **ObjectIds**: All IDs are now MongoDB ObjectIds (automatically generated)
- **Relations**: Prisma handles MongoDB relations using embedded references
- **Decimal Types**: Changed to `Float` (MongoDB doesn't have a native Decimal type)
- **No Foreign Keys**: MongoDB doesn't enforce foreign key constraints, but Prisma maintains referential integrity through relations

## Troubleshooting

### Connection Issues

If you encounter connection errors:

1. **Check Network Access**: Ensure your IP address is whitelisted in MongoDB Atlas
2. **Verify Password**: Make sure the password is correctly URL-encoded
3. **Check Database Name**: The connection string includes `/uzaempower` as the database name

### Schema Sync Issues

If `prisma db push` fails:

1. Check your MongoDB Atlas cluster is running
2. Verify your connection string is correct
3. Ensure you have write permissions on the database

## Environment Variables

Make sure your `.env` file has the correct `DATABASE_URL`. The connection string format is:

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?appName=<app>
```

Where:
- `<username>`: Your MongoDB username
- `<password>`: URL-encoded password
- `<cluster>`: Your cluster address
- `<database>`: Database name (uzaempower)
- `<app>`: Application name

