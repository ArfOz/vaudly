# Database Package

This package contains the Prisma configuration and schema for the `apps/nest` application.

## Directory Structure

- `prisma/`: Contains the Prisma schema and environment configuration.
  - `schema.prisma`: Defines the database models, relationships, and data types.
  - `.env`: Contains environment variables for the database connection.

## Setup Instructions

1. **Install Dependencies**: Ensure you have the necessary dependencies installed. Run the following command in the root of your project:

   ```
   npm install @prisma/client
   ```

2. **Configure Environment Variables**: Update the `.env` file in the `prisma` directory with your database connection details. For example:

   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```

3. **Generate Prisma Client**: After setting up your schema in `schema.prisma`, generate the Prisma client by running:

   ```
   npx prisma generate
   ```

4. **Run Migrations**: If you have defined any models in your schema, run the following command to create the necessary database tables:

   ```
   npx prisma migrate dev --name init
   ```

## Usage Guidelines

- Import the generated Prisma client in your application to interact with the database.
- Use the models defined in `schema.prisma` to perform CRUD operations.

## Additional Information

Refer to the [Prisma documentation](https://www.prisma.io/docs/) for more details on how to use Prisma effectively in your application.