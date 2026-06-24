# PRD: Course Experience

## Status

Draft.

## Problem

Learners need reliable access to course overview, course content, assessments, attempts, resources, and completion progress. The current app routes course overview, content iframe access, assessment attempts, LMS metadata, and course outline data through multiple authenticated proxy endpoints.

## Users

- Active learners.
- Learners reviewing course requirements before launch.
- Learners taking or reviewing assessment attempts.

## Current Evidence

Current course routes include:

- `course/overview/:id`
- `course/overview/:id/:tab`
- `course/content/:id`
- `course/assessment-attempts/:assessmentId`

Relevant endpoints include dashboard courses, enrolled courses, course metadata, course outline, student view, iframe SSO token generation, iframe URL, assessment attempts, and assessment result.

## Goals

- Provide a clear overview of each enrolled course.
- Launch course content reliably through LMS SSO/iframe integration.
- Show assessments and attempt history.
- Represent course progress and completion state consistently across dashboard and course pages.
- Support course resources such as pacing/completion guides.

## Requirements

- The course overview must load course metadata by course id.
- The course overview must support route tabs.
- The course content route must obtain required LMS iframe/SSO data before rendering content.
- Assessment attempt pages must load attempt status and result data.
- Course progress and completion must remain consistent with dashboard course state.
- Course errors must distinguish unavailable course, auth/session failure, LMS failure, and network failure.
- The route must provide a clear path back to dashboard on mobile and desktop.

## Nonfunctional Requirements

- Course feature state must use SignalStore with typed async call state.
- LMS launch tokens must not be stored longer than required.
- Iframe and external content must be handled with explicit security constraints.
- Route resolvers may load route-critical data, but broader preloading must move into stores or app shell services.
- Course pages must be independently lazy-loaded.

## Success Metrics

- Course launch success rate.
- Course overview load time.
- Assessment attempt load success rate.
- Course-related support contacts.

## Open Questions

- Should course content remain embedded or launch externally for some LMS states?
- What course tabs are required at MVP?
- What offline or degraded state is acceptable if LMS metadata is unavailable?
