"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationGenerator = applicationGenerator;
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const generators_1 = require("@nx/angular/generators");
function applicationGenerator(tree, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        yield (0, generators_1.applicationGenerator)(tree, {
            directory: `apps/${options.name}`,
            name: options.name,
            style: 'scss',
            routing: true,
            linter: 'eslint',
            unitTestRunner: generators_1.UnitTestRunner.None,
            e2eTestRunner: generators_1.E2eTestRunner.None,
            skipFormat: true,
        });
        writeAcademyAppConfig(tree, options.name);
        const project = (0, devkit_1.readProjectConfiguration)(tree, options.name);
        const buildTarget = (_a = project.targets) === null || _a === void 0 ? void 0 : _a['build'];
        if (!buildTarget) {
            throw new Error(`Expected generated project "${options.name}" to have a build target.`);
        }
        buildTarget.configurations = createAcademyBuildConfigurations(options.name);
        buildTarget.defaultConfiguration = 'prod';
        project.targets['serve'] = createAcademyServeTarget(options.name);
        (0, devkit_1.updateProjectConfiguration)(tree, options.name, project);
        yield (0, devkit_1.formatFiles)(tree);
    });
}
exports.default = applicationGenerator;
function writeAcademyAppConfig(tree, appName) {
    const appConfigPath = `apps/${appName}/src/app/app.config.ts`;
    if (!tree.exists(appConfigPath)) {
        throw new Error(`Expected generated app config at "${appConfigPath}".`);
    }
    tree.write(appConfigPath, `import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAcademyAppConfig } from '@academy/platform/config';
import { provideAcademyPrimeNg } from '@academy/platform/primeng';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAcademyAppConfig(),
    provideAcademyPrimeNg(),
    provideRouter(appRoutes),
  ],
};
`);
}
function createAcademyBuildConfigurations(appName) {
    return {
        local: {
            optimization: false,
            extractLicenses: false,
            sourceMap: true,
            define: {
                'process.env.ACADEMY_APP_NAME': quoteDefineValue(appName),
                'process.env.ACADEMY_BFF_BASE_URL': quoteDefineValue('http://localhost:3010'),
                'process.env.ACADEMY_AUTH_ISSUER_URL': quoteDefineValue('http://localhost:3010/auth'),
                'process.env.ACADEMY_FEATURE_FLAGS_ENABLED': quoteDefineValue('false'),
                'process.env.ACADEMY_OBSERVABILITY_ENABLED': quoteDefineValue('false'),
                'process.env.ACADEMY_SHELL_URL': quoteDefineValue('http://localhost:4200'),
                'process.env.ACADEMY_ENROLLMENT_URL': quoteDefineValue('http://localhost:4201'),
                'process.env.ACADEMY_STUDENT_PORTAL_URL': quoteDefineValue('http://localhost:4202'),
            },
        },
        dev: {
            optimization: false,
            extractLicenses: false,
            sourceMap: true,
            define: {
                'process.env.ACADEMY_APP_NAME': quoteDefineValue(appName),
                'process.env.ACADEMY_BFF_BASE_URL': quoteDefineValue('/api'),
                'process.env.ACADEMY_AUTH_ISSUER_URL': quoteDefineValue('/auth'),
                'process.env.ACADEMY_FEATURE_FLAGS_ENABLED': quoteDefineValue('true'),
                'process.env.ACADEMY_OBSERVABILITY_ENABLED': quoteDefineValue('true'),
                'process.env.ACADEMY_SHELL_URL': quoteDefineValue('https://dev.academy.wgu.edu'),
                'process.env.ACADEMY_ENROLLMENT_URL': quoteDefineValue('https://dev-enroll.academy.wgu.edu'),
                'process.env.ACADEMY_STUDENT_PORTAL_URL': quoteDefineValue('https://dev-student.academy.wgu.edu'),
            },
        },
        stage: {
            optimization: true,
            extractLicenses: true,
            sourceMap: false,
            outputHashing: 'all',
            budgets: createProductionBudgets(),
            define: {
                'process.env.ACADEMY_APP_NAME': quoteDefineValue(appName),
                'process.env.ACADEMY_BFF_BASE_URL': quoteDefineValue('/api'),
                'process.env.ACADEMY_AUTH_ISSUER_URL': quoteDefineValue('/auth'),
                'process.env.ACADEMY_FEATURE_FLAGS_ENABLED': quoteDefineValue('true'),
                'process.env.ACADEMY_OBSERVABILITY_ENABLED': quoteDefineValue('true'),
                'process.env.ACADEMY_SHELL_URL': quoteDefineValue('https://stage.academy.wgu.edu'),
                'process.env.ACADEMY_ENROLLMENT_URL': quoteDefineValue('https://stage-enroll.academy.wgu.edu'),
                'process.env.ACADEMY_STUDENT_PORTAL_URL': quoteDefineValue('https://stage-student.academy.wgu.edu'),
            },
        },
        prod: {
            optimization: true,
            extractLicenses: true,
            sourceMap: false,
            outputHashing: 'all',
            budgets: createProductionBudgets(),
            define: {
                'process.env.ACADEMY_APP_NAME': quoteDefineValue(appName),
                'process.env.ACADEMY_BFF_BASE_URL': quoteDefineValue('/api'),
                'process.env.ACADEMY_AUTH_ISSUER_URL': quoteDefineValue('/auth'),
                'process.env.ACADEMY_FEATURE_FLAGS_ENABLED': quoteDefineValue('true'),
                'process.env.ACADEMY_OBSERVABILITY_ENABLED': quoteDefineValue('true'),
                'process.env.ACADEMY_SHELL_URL': quoteDefineValue('https://academy.wgu.edu'),
                'process.env.ACADEMY_ENROLLMENT_URL': quoteDefineValue('https://enroll.academy.wgu.edu'),
                'process.env.ACADEMY_STUDENT_PORTAL_URL': quoteDefineValue('https://student.academy.wgu.edu'),
            },
        },
    };
}
function createAcademyServeTarget(appName) {
    return {
        continuous: true,
        executor: '@angular/build:dev-server',
        configurations: {
            local: {
                buildTarget: `${appName}:build:local`,
            },
            dev: {
                buildTarget: `${appName}:build:dev`,
            },
            stage: {
                buildTarget: `${appName}:build:stage`,
            },
            prod: {
                buildTarget: `${appName}:build:prod`,
            },
        },
        defaultConfiguration: 'local',
    };
}
function createProductionBudgets() {
    return [
        {
            type: 'initial',
            maximumWarning: '500kb',
            maximumError: '1mb',
        },
        {
            type: 'anyComponentStyle',
            maximumWarning: '4kb',
            maximumError: '8kb',
        },
    ];
}
function quoteDefineValue(value) {
    return JSON.stringify(value);
}
//# sourceMappingURL=application.js.map