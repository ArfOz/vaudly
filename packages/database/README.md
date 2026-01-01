# Database Package

This package provides a wrapper around Prisma for managing database connections and interactions in a NestJS application.

## Installation

To install the necessary dependencies, run:

```bash
npm install @prisma/client @nestjs/config @prisma/adapter-pg pg
```

## Usage

1. **Configuration**: Ensure that your environment variables are set up correctly, particularly the `DATABASE_URL` variable, which should point to your database.

2. **Service**: The `PrismaService` class is responsible for managing the database connection. It extends `PrismaClient` and implements lifecycle hooks to connect and disconnect from the database.

3. **Schema**: Define your data models and relationships in the `schema.prisma` file located in the `src/prisma` directory.

4. **Entry Point**: The `src/index.ts` file serves as the entry point for this package, exporting the `PrismaService` and any other necessary functionalities.

## License

This project is licensed under the MIT License. See the LICENSE file for details.