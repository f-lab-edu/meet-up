# Microservices Architecture

Due to the varying levels of traffic that each service in the project receives throughout the week, it appears to be
more cost-effective to individually scale each service up or down as needed.

## Members Service

## Meetings Service

- A new `Meeting` is automatically created at the beginning of each week through a cron job.
- `Admins` can access all `Meetings`.
- `Certified Members` can access `Meetings` from past few weeks.
- `All Members` can access the details of the upcoming `Meeting`.
- `Uncertified Members` can access sample `Mettings` only.
- `Admins` can update details of the upcoming `Meeting`, including the weekly topic discussions.
- `Admins` can delete the upcoming `Meeting` if it will not take place due to lack of participants, national holidays,
  etc.

## Attendances Service

- The attendances table primarily links a `Member` with a `Meeting`, among other entries.
- `Certified Members` can create a `Attendance` for the upcoming `Meeting`.
- `Uncertified Members` can request `Attendance` in the upcoming `Meeting`, resulting in the newbie field being set
  to `true`.
- `Admins` can access the list of all `Members` participating for the upcoming `Meeting`.
- `Certified Members` can access the list of `Members` participating for the upcoming `Meeting` where the newbie field
  is `false`.
- `Uncertified Members` can only access their own `Attendance` records.
- `Admins` can update the no-show field in `Attendances` if the `Member` does not attend.
- `All Members` can delete their own `Attendance` in the upcoming `Meeting`.

# Monorepo

## What is Monorepo?

A monorepo, or monolithic repository, refers to a codebase that contains multiple projects or applications in a single
repository. [source](https://dev.to/mostafakmilly/managing-monorepos-with-lerna-v7-3l9o).

- Shared codebase: Rather than having separate repositories for each project (or service in this project), all related
  code is contained in a single shared repository. This facilitates code reuse across projects.
- Dependency management: Dependencies are managed centrally for all projects, avoiding duplication. Updates to shared
  dependencies are made once in the monorepo rather than separately in each project repository.
- Continuous integration: Changes can be built and tested across the entire codebase as a whole, checking for unintended
  consequences of code changes on dependent services.
- Collaboration: Developers can more easily work on related features or bugs across different applications contained in
  the monorepo.

## Monorepo in Nest

Combining a monorepo with NestJS allows maximizing efficiency through improved code reuse, simplified dependencies, and
streamlined development across related projects.

