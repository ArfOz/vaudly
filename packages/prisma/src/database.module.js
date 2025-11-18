"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const activites_1 = require("./activites");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, activites_1.ActivitiesDatabaseModule],
        providers: [],
        exports: [prisma_module_1.PrismaModule, activites_1.ActivitiesDatabaseModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map