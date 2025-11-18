"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesDatabaseModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const activities_database_service_1 = require("./activities.database.service");
let ActivitiesDatabaseModule = class ActivitiesDatabaseModule {
};
exports.ActivitiesDatabaseModule = ActivitiesDatabaseModule;
exports.ActivitiesDatabaseModule = ActivitiesDatabaseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [activities_database_service_1.ActivitiesDatabaseService],
        exports: [activities_database_service_1.ActivitiesDatabaseService],
    })
], ActivitiesDatabaseModule);
//# sourceMappingURL=activities.database.module.js.map