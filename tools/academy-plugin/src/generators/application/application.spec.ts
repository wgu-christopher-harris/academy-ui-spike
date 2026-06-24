import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { applicationGenerator } from './application';
import { ApplicationGeneratorSchema } from './schema';

describe('application generator', () => {
  let tree: Tree;
  const options: ApplicationGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await applicationGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    const buildConfigurations = config.targets?.['build']?.configurations;
    const serveConfigurations = config.targets?.['serve']?.configurations;
    const appConfig = tree.read('apps/test/src/app/app.config.ts', 'utf-8');
    const appRoutes = tree.read('apps/test/src/app/app.routes.ts', 'utf-8');
    const appStyles = tree.read('apps/test/src/styles.css', 'utf-8');

    expect(config.root).toBe('apps/test');
    expect(config.projectType).toBe('application');
    expect(config.targets?.['build']?.options?.['styles']).toEqual([
      'apps/test/src/styles.css',
    ]);
    expect(config.targets?.['build']?.defaultConfiguration).toBe('prod');
    expect(config.targets?.['serve']?.defaultConfiguration).toBe('local');
    expect(Object.keys(serveConfigurations ?? {})).toEqual([
      'local',
      'dev',
      'stage',
      'prod',
    ]);
    expect(appConfig).toContain(
      "import { provideAcademyAppConfig } from '@academy/platform/config';",
    );
    expect(appConfig).toContain(
      "import { provideAcademyPrimeNg } from '@academy/platform/primeng';",
    );
    expect(appConfig).toContain('provideAcademyAppConfig()');
    expect(appConfig).toContain('provideAcademyPrimeNg()');
    expect(appConfig).toContain('provideRouter(appRoutes)');
    expect(appRoutes).toContain('export const appRoutes');
    expect(appStyles).toContain(
      "@import '../../../libs/shared/styles/tailwind.css';",
    );
    expect(appStyles).toContain('@source "./**/*.{html,ts}";');
    expect(appStyles).toContain('@source "../../../libs/**/*.{html,ts}";');
    expect(buildConfigurations?.['local']?.['define']).toMatchObject({
      'process.env.ACADEMY_APP_NAME': '"test"',
      'process.env.ACADEMY_BFF_BASE_URL': '"http://localhost:3010"',
    });
    expect(buildConfigurations?.['dev']?.['define']).toMatchObject({
      'process.env.ACADEMY_APP_NAME': '"test"',
      'process.env.ACADEMY_BFF_BASE_URL': '"/api"',
    });
    expect(buildConfigurations?.['stage']?.['define']).toMatchObject({
      'process.env.ACADEMY_APP_NAME': '"test"',
      'process.env.ACADEMY_SHELL_URL': '"https://stage.academy.wgu.edu"',
    });
    expect(buildConfigurations?.['prod']?.['define']).toMatchObject({
      'process.env.ACADEMY_APP_NAME': '"test"',
      'process.env.ACADEMY_SHELL_URL': '"https://academy.wgu.edu"',
    });
  });
});
