"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config({
    path: '/Volumes/work/Projects/furnistore/GraduationProj-main-master/config.env',
});
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const passport = require("passport");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Authentication API')
        .setDescription('API documentation for the authentication service')
        .setVersion('1.0')
        .addTag('auth')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.use(session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000 * 60,
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    const port = process.env.PORT ?? 3001;
    console.log(`Application running on port ${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api`);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map