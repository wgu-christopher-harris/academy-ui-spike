import {
  formatFiles,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import {
  applicationGenerator as angularApplicationGenerator,
  E2eTestRunner,
  UnitTestRunner,
} from '@nx/angular/generators';
import { ApplicationGeneratorSchema } from './schema';

export async function applicationGenerator(
  tree: Tree,
  options: ApplicationGeneratorSchema,
) {
  await angularApplicationGenerator(tree, {
    directory: `apps/${options.name}`,
    name: options.name,
    style: 'css',
    routing: true,
    linter: 'eslint',
    unitTestRunner: UnitTestRunner.None,
    e2eTestRunner: E2eTestRunner.None,
    skipFormat: true,
  });

  writeAcademyAppConfig(tree, options.name);
  writeAcademyStyles(tree, options.name);

  const project = readProjectConfiguration(tree, options.name);
  const buildTarget = project.targets?.['build'];

  if (!buildTarget) {
    throw new Error(`Expected generated project "${options.name}" to have a build target.`);
  }

  buildTarget.configurations = createAcademyBuildConfigurations(options.name);
  buildTarget.defaultConfiguration = 'prod';

  project.targets['serve'] = createAcademyServeTarget(options.name);

  updateProjectConfiguration(tree, options.name, project);

  await formatFiles(tree);
}

export default applicationGenerator;

function writeAcademyAppConfig(tree: Tree, appName: string): void {
  const appConfigPath = `apps/${appName}/src/app/app.config.ts`;

  if (!tree.exists(appConfigPath)) {
    throw new Error(`Expected generated app config at "${appConfigPath}".`);
  }

  tree.write(
    appConfigPath,
    `import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
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
`,
  );
}

function writeAcademyStyles(tree: Tree, appName: string): void {
  const stylesPath = `apps/${appName}/src/styles.css`;

  if (!tree.exists(stylesPath)) {
    throw new Error(`Expected generated app styles at "${stylesPath}".`);
  }

  tree.write(
    stylesPath,
    `@import "../../../libs/shared/styles/tailwind.css";

@source "./**/*.{html,ts}";
@source "../../../libs/**/*.{html,ts}";
`,
  );
}

function createAcademyBuildConfigurations(appName: string) {
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

function createAcademyServeTarget(appName: string) {
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

function quoteDefineValue(value: string): string {
  return JSON.stringify(value);
}
