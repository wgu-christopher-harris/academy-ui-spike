export type AcademyAppName = 'academy-shell' | 'enrollment' | 'student-portal' | 'style-guide';

export interface AcademyAppUrls {
  shell: string;
  enrollment: string;
  studentPortal: string;
}

export interface AcademyAppConfig {
  appName: AcademyAppName;
  bffBaseUrl: string;
  authIssuerUrl: string;
  appUrls: AcademyAppUrls;
  featureFlagsEnabled: boolean;
  observabilityEnabled: boolean;
}

interface AcademyEnvironment {
  ACADEMY_APP_NAME: string;
  ACADEMY_BFF_BASE_URL: string;
  ACADEMY_AUTH_ISSUER_URL: string;
  ACADEMY_SHELL_URL: string;
  ACADEMY_ENROLLMENT_URL: string;
  ACADEMY_STUDENT_PORTAL_URL: string;
  ACADEMY_FEATURE_FLAGS_ENABLED: string;
  ACADEMY_OBSERVABILITY_ENABLED: string;
}

declare const process: {
  env: AcademyEnvironment;
};

const academyEnvironment: AcademyEnvironment = {
  ACADEMY_APP_NAME: process.env.ACADEMY_APP_NAME,
  ACADEMY_BFF_BASE_URL: process.env.ACADEMY_BFF_BASE_URL,
  ACADEMY_AUTH_ISSUER_URL: process.env.ACADEMY_AUTH_ISSUER_URL,
  ACADEMY_SHELL_URL: process.env.ACADEMY_SHELL_URL,
  ACADEMY_ENROLLMENT_URL: process.env.ACADEMY_ENROLLMENT_URL,
  ACADEMY_STUDENT_PORTAL_URL: process.env.ACADEMY_STUDENT_PORTAL_URL,
  ACADEMY_FEATURE_FLAGS_ENABLED: process.env.ACADEMY_FEATURE_FLAGS_ENABLED,
  ACADEMY_OBSERVABILITY_ENABLED: process.env.ACADEMY_OBSERVABILITY_ENABLED,
};

export function readAcademyAppConfig(): AcademyAppConfig {
  return {
    appName: readAcademyAppName('ACADEMY_APP_NAME'),
    bffBaseUrl: readRequiredEnv('ACADEMY_BFF_BASE_URL'),
    authIssuerUrl: readRequiredEnv('ACADEMY_AUTH_ISSUER_URL'),
    appUrls: {
      shell: readRequiredEnv('ACADEMY_SHELL_URL'),
      enrollment: readRequiredEnv('ACADEMY_ENROLLMENT_URL'),
      studentPortal: readRequiredEnv('ACADEMY_STUDENT_PORTAL_URL'),
    },
    featureFlagsEnabled: readBooleanEnv('ACADEMY_FEATURE_FLAGS_ENABLED'),
    observabilityEnabled: readBooleanEnv('ACADEMY_OBSERVABILITY_ENABLED'),
  };
}

function readRequiredEnv(key: keyof AcademyEnvironment): string {
  const value = academyEnvironment[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${String(key)}`);
  }

  return value;
}

function readBooleanEnv(key: keyof AcademyEnvironment): boolean {
  return academyEnvironment[key] === 'true';
}

function readAcademyAppName(key: keyof AcademyEnvironment): AcademyAppName {
  const value = readRequiredEnv(key);

  if (value === 'academy-shell' || value === 'enrollment' || value === 'student-portal' || value === 'style-guide') {
    return value;
  }

  throw new Error(`Invalid ACADEMY_APP_NAME: ${value}`);
}
