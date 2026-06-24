/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CheckoutDto {
  /**
   * edX course id to purchase
   * @example "course-v1:Academy+AIRU+MC"
   */
  courseId: string;
  /** Display name for the Stripe product */
  courseName?: string;
  /** true = pay over time (installment plan); false/absent = pay in full */
  plan?: boolean;
}

export interface EnrollDto {
  /**
   * edX course id
   * @example "course-v1:Academy+AIRU+MC"
   */
  courseId: string;
}

export type CreateAccountDto = object;

export type UpdateProfileDto = object;

export interface UserProfileDto {
  firstName: string;
  lastName: string;
  degree: string;
}

export interface CatalogCourseDto {
  /** @example "course-v1:Academy+ENG+000" */
  course_id: string;
  /** @example "English" */
  name: string;
  /** @example "english" */
  slug: string;
  /** @example "Academy" */
  org: string;
}

export interface CourseEntityDto {
  id: string;
  name: string;
  status: string;
  completedUnits: number;
  totalUnits: number;
  imageAssetPath: string;
}

export type GradeQuizDto = object;

export interface TopicChipDto {
  label: string;
  url?: string;
}

export interface SnippetDto {
  partNumber: number;
  totalParts: number;
  title: string;
  body: string;
  topicChips?: TopicChipDto[];
  audioUrl?: string;
}

export interface QuizQuestionDto {
  id: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

export type AssessmentItemTypeDto = object;

export type AssessmentItemStatusDto = object;

export interface AssessmentItemDto {
  title: string;
  subtitle?: string;
  type: AssessmentItemTypeDto;
  status: AssessmentItemStatusDto;
}

export interface AssessmentCategoryDto {
  name: string;
  items: AssessmentItemDto[];
}

export interface OtherCourseDto {
  name: string;
  completedAssessments: number;
  totalAssessments: number;
}

export interface ProgressOverviewDataDto {
  accessPeriodEnd: string;
  categories: AssessmentCategoryDto[];
  otherCourses: OtherCourseDto[];
}

export interface StreakEntityDto {
  completedDays: number[];
  streakTotalWeeks: number;
  weeklyGoal: number;
}

export interface UpdateWeeklyGoalRequestDto {
  goal: number;
}

export type CoachRequestDto = object;

export type ScheduleSessionDto = object;

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Academy Mobile App API
 * @version 1.0.0
 * @contact
 *
 * API derived from domain layer repository interfaces.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthExchangeControllerExchange
     * @summary Exchange a PKCE authorization code for tokens at PingFed
     * @request POST:/auth/exchange
     */
    authExchangeControllerExchange: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/exchange`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthExchangeControllerJwks
     * @summary Proxy PingFed JWKS
     * @request GET:/auth/jwks
     */
    authExchangeControllerJwks: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/jwks`,
        method: "GET",
        ...params,
      }),
  };
  edx = {
    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetMe
     * @summary EdX user-account record (wguid-resolved)
     * @request GET:/edx/me
     * @secure
     */
    edxControllerGetMe: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/edx/me`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetMyDashboard
     * @summary DM-aggregated dashboard for the authenticated user
     * @request GET:/edx/me/dashboard
     * @secure
     */
    edxControllerGetMyDashboard: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/edx/me/dashboard`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetMyDashboardSummary
     * @summary Reconciled dashboard summary (active enrollment count from edX, installments from DM ∪ Academy plans, coach) — one call, computed server-side.
     * @request GET:/edx/me/dashboard-summary
     * @secure
     */
    edxControllerGetMyDashboardSummary: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/edx/me/dashboard-summary`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetMyCourses
     * @summary Authenticated user's enrolled courses with progress (DM v2)
     * @request GET:/edx/me/courses
     * @secure
     */
    edxControllerGetMyCourses: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/edx/me/courses`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetMyEnrollments
     * @summary Authenticated user's EdX enrollments (EdX direct)
     * @request GET:/edx/me/enrollments
     * @secure
     */
    edxControllerGetMyEnrollments: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/edx/me/enrollments`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetMyCourseOutline
     * @summary DM course outline + per-block completion for the user/course
     * @request GET:/edx/me/courses/{courseId}/outline
     * @secure
     */
    edxControllerGetMyCourseOutline: (
      courseId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/edx/me/courses/${courseId}/outline`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetMyCourseAssessments
     * @summary DM assessment completion + proctoring for the user/course
     * @request GET:/edx/me/courses/{courseId}/assessments
     * @secure
     */
    edxControllerGetMyCourseAssessments: (
      courseId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/edx/me/courses/${courseId}/assessments`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetMyProgress
     * @summary Cross-course progress + assessment roll-up for the authenticated user (DM milestones).
     * @request GET:/edx/me/progress
     * @secure
     */
    edxControllerGetMyProgress: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/edx/me/progress`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetMyLearning
     * @summary Product-centric learning: the user's products (bundles/certs as containers) with nested course progress, grouped by kind.
     * @request GET:/edx/me/learning
     * @secure
     */
    edxControllerGetMyLearning: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/edx/me/learning`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetMyOwnedProducts
     * @summary The products the user OWNS (purchase-based: paid orders + active/paid plans). Includes products since delisted from the catalog — you keep what you bought.
     * @request GET:/edx/me/products
     * @secure
     */
    edxControllerGetMyOwnedProducts: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/edx/me/products`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetMyStreaks
     * @summary Authenticated user's weekly streak (DM-backed)
     * @request GET:/edx/me/gamification/streaks
     * @secure
     */
    edxControllerGetMyStreaks: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/edx/me/gamification/streaks`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerListCatalogCourses
     * @summary Global course catalog (EdX direct via /api/courses/v1/courses/)
     * @request GET:/edx/catalog/courses
     * @secure
     */
    edxControllerListCatalogCourses: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/edx/catalog/courses`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerListCatalogItems
     * @summary Catalog items (programs/certs/courses) via DM /api/catalog/items
     * @request GET:/edx/catalog/items
     * @secure
     */
    edxControllerListCatalogItems: (
      query?: {
        program_type?: string;
        exclude_course_items?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/edx/catalog/items`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetCatalogItem
     * @summary Single catalog item metadata (DM /api/catalog/metadata/item?item_id=)
     * @request GET:/edx/catalog/items/{itemId}
     * @secure
     */
    edxControllerGetCatalogItem: (itemId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/edx/catalog/items/${itemId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetCatalogCourse
     * @summary Single course details (EdX direct via /api/courses/v1/courses/{id})
     * @request GET:/edx/catalog/courses/{courseId}
     * @secure
     */
    edxControllerGetCatalogCourse: (
      courseId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/edx/catalog/courses/${courseId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags edx
     * @name EdxControllerGetCourseBlocks
     * @summary EdX course block tree (depth=all) for the given course_id
     * @request GET:/edx/courses/{courseId}/blocks
     * @secure
     */
    edxControllerGetCourseBlocks: (
      courseId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/edx/courses/${courseId}/blocks`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  products = {
    /**
     * No description
     *
     * @tags products
     * @name ProductsControllerList
     * @summary List active products (full shape — auth required, not public)
     * @request GET:/products
     * @secure
     */
    productsControllerList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/products`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags products
     * @name ProductsControllerSync
     * @summary Rebuild canonical products from the DM catalog (hash-join). Dev seed; auth required.
     * @request POST:/products/sync
     * @secure
     */
    productsControllerSync: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/products/sync`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  public = {
    /**
     * No description
     *
     * @tags public
     * @name PublicCatalogControllerCatalog
     * @summary Public course catalog (active products; no auth, no per-user data).
     * @request GET:/public/catalog
     */
    publicCatalogControllerCatalog: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/public/catalog`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags public
     * @name PublicCatalogControllerDetail
     * @summary Public product detail — the product plus the course(s) inside it (single course or bundle contents). Informational; no progress, no per-user data.
     * @request GET:/public/catalog/{id}
     */
    publicCatalogControllerDetail: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/public/catalog/${id}`,
        method: "GET",
        ...params,
      }),
  };
  ordering = {
    /**
     * No description
     *
     * @tags ordering
     * @name OrderingControllerCheckout
     * @summary Create a Stripe Checkout Session for a course purchase
     * @request POST:/ordering/checkout
     * @secure
     */
    orderingControllerCheckout: (
      data: CheckoutDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/ordering/checkout`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ordering
     * @name OrderingControllerPlans
     * @summary The authenticated user's installment plans (pay-over-time)
     * @request GET:/ordering/plans
     * @secure
     */
    orderingControllerPlans: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ordering/plans`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ordering
     * @name OrderingControllerWebhook
     * @summary Stripe webhook → mark order paid → enroll
     * @request POST:/ordering/webhook
     */
    orderingControllerWebhook: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ordering/webhook`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ordering
     * @name OrderingControllerOrders
     * @summary The authenticated user's orders
     * @request GET:/ordering/orders
     * @secure
     */
    orderingControllerOrders: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ordering/orders`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  enrollment = {
    /**
     * No description
     *
     * @tags enrollment
     * @name EnrollmentControllerCatalog
     * @summary Enrollment-center catalog: curated DM products + edX metadata + my enrollment status
     * @request GET:/enrollment/catalog
     * @secure
     */
    enrollmentControllerCatalog: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/enrollment/catalog`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags enrollment
     * @name EnrollmentControllerOwned
     * @summary Whether the authenticated user owns this product (lightweight; avoids fetching the whole catalog).
     * @request GET:/enrollment/products/{productId}/owned
     * @secure
     */
    enrollmentControllerOwned: (
      productId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/enrollment/products/${productId}/owned`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags enrollment
     * @name EnrollmentControllerEnroll
     * @summary DEV-ONLY direct enroll (no payment). Disabled when the paywall is on — paid enrollment goes through Stripe checkout → webhook.
     * @request POST:/enrollment/enroll
     * @secure
     */
    enrollmentControllerEnroll: (data: EnrollDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/enrollment/enroll`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  registration = {
    /**
     * No description
     *
     * @tags registration
     * @name RegistrationControllerCreate
     * @summary Create a standalone account (no course/purchase)
     * @request POST:/registration/create
     */
    registrationControllerCreate: (
      data: CreateAccountDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/registration/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags registration
     * @name RegistrationControllerGetAccount
     * @summary Canonical Academy user (JIT, read-only) keyed by academyUserId
     * @request GET:/registration/account
     * @secure
     */
    registrationControllerGetAccount: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/registration/account`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags registration
     * @name RegistrationControllerProvision
     * @summary Kick off downstream provisioning (returns initial state)
     * @request POST:/registration/provision
     * @secure
     */
    registrationControllerProvision: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/registration/provision`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags registration
     * @name RegistrationControllerProvisioningStatus
     * @summary Poll per-step provisioning status
     * @request GET:/registration/provisioning-status
     * @secure
     */
    registrationControllerProvisioningStatus: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/registration/provisioning-status`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags registration
     * @name RegistrationControllerUpdateProfile
     * @summary Complete the Academy onboarding profile
     * @request PUT:/registration/profile
     * @secure
     */
    registrationControllerUpdateProfile: (
      data: UpdateProfileDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/registration/profile`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  account = {
    /**
     * No description
     *
     * @tags Account
     * @name AccountControllerGetUserProfile
     * @summary Get user profile
     * @request GET:/account/profile
     */
    accountControllerGetUserProfile: (params: RequestParams = {}) =>
      this.request<UserProfileDto, any>({
        path: `/account/profile`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  catalog = {
    /**
     * No description
     *
     * @tags catalog
     * @name CatalogControllerListCourses
     * @summary List the global course catalog (proxies DM /api/catalog/courses/)
     * @request GET:/catalog/courses
     */
    catalogControllerListCourses: (params: RequestParams = {}) =>
      this.request<CatalogCourseDto[], any>({
        path: `/catalog/courses`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  courses = {
    /**
     * No description
     *
     * @tags Courses
     * @name CoursesControllerGetCourses
     * @summary Get the authenticated user's enrolled courses. Sourced from edX enrollments (the access-of-record), with progress enriched from DM completions best-effort.
     * @request GET:/courses
     * @secure
     */
    coursesControllerGetCourses: (params: RequestParams = {}) =>
      this.request<CourseEntityDto[], any>({
        path: `/courses`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Quick Learn
     * @name QuickLearnControllerGradeQuiz
     * @request POST:/courses/{courseId}/quiz/grade
     */
    quickLearnControllerGradeQuiz: (
      courseId: string,
      data: GradeQuizDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/courses/${courseId}/quiz/grade`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Quick Learn
     * @name QuickLearnControllerFetchSnippets
     * @summary Fetch learning snippets for a course
     * @request GET:/courses/{courseId}/snippets
     */
    quickLearnControllerFetchSnippets: (
      courseId: string,
      query: {
        count: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SnippetDto[], any>({
        path: `/courses/${courseId}/snippets`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Quick Learn
     * @name QuickLearnControllerFetchQuizQuestions
     * @summary Fetch quiz questions for a course
     * @request GET:/courses/{courseId}/quiz-questions
     */
    quickLearnControllerFetchQuizQuestions: (
      courseId: string,
      query: {
        count: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<QuizQuestionDto[], any>({
        path: `/courses/${courseId}/quiz-questions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Progress Overview
     * @name ProgressOverviewControllerFetchProgressData
     * @summary Fetch progress data for a course (DM-backed best-effort). Falls back to mock when DM has no record of the user or the response shape doesn't match.
     * @request GET:/courses/{courseId}/progress
     * @secure
     */
    progressOverviewControllerFetchProgressData: (
      courseId: string,
      params: RequestParams = {},
    ) =>
      this.request<ProgressOverviewDataDto, any>({
        path: `/courses/${courseId}/progress`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  me = {
    /**
     * No description
     *
     * @tags me
     * @name MeControllerWhoAmI
     * @summary Echo back the authenticated user (decoded JWT payload)
     * @request GET:/me
     * @secure
     */
    meControllerWhoAmI: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/me`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  streaks = {
    /**
     * No description
     *
     * @tags Streaks
     * @name StreaksControllerGetStreakData
     * @summary Get the authenticated user's streak status (DM-backed). Falls back to mock data when DM has no record of the user.
     * @request GET:/streaks
     * @secure
     */
    streaksControllerGetStreakData: (params: RequestParams = {}) =>
      this.request<StreakEntityDto, any>({
        path: `/streaks`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Streaks
     * @name StreaksControllerUpdateWeeklyGoal
     * @summary Update the authenticated user's weekly streak goal (DM-backed).
     * @request PUT:/streaks/weekly-goal
     * @secure
     */
    streaksControllerUpdateWeeklyGoal: (
      data: UpdateWeeklyGoalRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/streaks/weekly-goal`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  coaching = {
    /**
     * No description
     *
     * @tags Coaching
     * @name CoachingControllerGetCoach
     * @summary The student's assigned coach (null if not yet matched).
     * @request GET:/coaching/coach
     * @secure
     */
    coachingControllerGetCoach: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/coaching/coach`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Coaching
     * @name CoachingControllerGetRequested
     * @summary Whether the student has requested a coach (durable — drives the 'matching' state across refreshes, even before assignment).
     * @request GET:/coaching/requested
     * @secure
     */
    coachingControllerGetRequested: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/coaching/requested`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Coaching
     * @name CoachingControllerGetAppointments
     * @summary The student's coaching sessions (TimeTrade-backed).
     * @request GET:/coaching/appointments
     * @secure
     */
    coachingControllerGetAppointments: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/coaching/appointments`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Coaching
     * @name CoachingControllerSchedule
     * @summary Book / reschedule / cancel a session — upserts a DM appointment by referenceNumber.
     * @request POST:/coaching/appointments
     * @secure
     */
    coachingControllerSchedule: (
      data: ScheduleSessionDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/coaching/appointments`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Coaching
     * @name CoachingControllerGetOptions
     * @summary Coach-match intake options (strengths + weaknesses).
     * @request GET:/coaching/options
     * @secure
     */
    coachingControllerGetOptions: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/coaching/options`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Coaching
     * @name CoachingControllerRequestCoach
     * @summary Request a coach — saves the intake (CoachMetadata). Does NOT auto-assign.
     * @request POST:/coaching/request
     * @secure
     */
    coachingControllerRequestCoach: (
      data: CoachRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/coaching/request`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
