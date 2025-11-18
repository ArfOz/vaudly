"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("./../src/app.module");
(0, globals_1.describe)('AppController (e2e)', () => {
    let app;
    (0, globals_1.beforeEach)(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    (0, globals_1.it)('/ (GET)', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });
});
//# sourceMappingURL=app.e2e-spec.js.map