const ACADEMY_ENV_KEYS = [
  'ACADEMY_APP_NAME',
  'ACADEMY_BFF_BASE_URL',
  'ACADEMY_AUTH_ISSUER_URL',
  'ACADEMY_SHELL_URL',
  'ACADEMY_ENROLLMENT_URL',
  'ACADEMY_STUDENT_PORTAL_URL',
  'ACADEMY_FEATURE_FLAGS_ENABLED',
  'ACADEMY_OBSERVABILITY_ENABLED',
];

const academyEnvPlugin = {
  name: 'academy-env-plugin',
  setup(build) {
    build.initialOptions.define ??= {};

    for (const key of ACADEMY_ENV_KEYS) {
      build.initialOptions.define[`process.env.${key}`] = JSON.stringify(process.env[key] ?? '');
    }
  },
};

module.exports = academyEnvPlugin;
