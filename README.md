# Run

## Local

Prerequisites

- Docker

To run all services locally, use Docker Compose.

```shell
docker compose up
```

## Cloud

*TBD*

# Test-Driven Development

Test-Driven Development (TDD) plays a significant role in this project's development process. It's employed throughout
the entirety of the application's construction, focusing on small, incrementally developed components, each accompanied
by their own tests.

Some techniques have been utilized for testing in this project.

## Mocking a function's behavior

```TypeScript
// ...
describe('findAll', () => {
  describe('when there is no record in members table', () => {
    it('should throw HttpException 204', async () => {
      const want = []
      memberRepository.find.mockReturnValue(want)

      try {
        await service.findAll()
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        expect(error.getStatus()).toBe(HttpStatus.NO_CONTENT)
      }
    })
  })
  // ...
})
```

In this scenario, `memberRepository.find` is mocked to return a specific value. This allows us to examine how the
findAll method handles the outcome of this repository function.

## Spying

Spying allow us to observe the interaction among components in the system without altering their behavior.

```TypeScript
describe('findAll', () => {
  // ...
  describe('when handling deleted members', () => {
    let spy: jest.SpyInstance

    beforeEach(() => {
      spy = jest.spyOn(memberRepository, 'find').mockReturnValue(Promise.resolve([new Member()]))
    })

    afterEach(() => {
      spy.mockRestore()
    })

    it('should return only non-deleted members by default', async () => {
      await service.findAll()
      expect(spy).toHaveBeenCalledWith({ where: { deleted_at: IsNull() } })
    })
    it('should return all members, including deleted ones, if parameter `status` is "all"', async () => {
      await service.findAll('all')
      expect(spy).toHaveBeenCalledWith({ where: {} })
    })
    it('should return only deleted members if parameter `status` is "deleted"', async () => {
      await service.findAll('deleted')
      expect(spy).toHaveBeenCalledWith({ where: { deleted_at: Not(IsNull()) } })
    })
  })
  // ...
})
```

In these tests, spying is used to verify whether the `findAll` method in the members service is accurately creating the
where clause, which is subsequently passed to the repository method. As the result of the repository method isn't a
primary concern of the service layer, we focus on spying on the parameters rather than mocking the method itself.

# Logging

Logging on HTTP `request` and `response` is implemented as a *Middleware function* and followed the official course.

The format follows: `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} ${traceId}`

The below is an example log.

```
[Nest] 1  - 01/09/2024, 4:04:03 AM     LOG [HTTP] GET / 200 12 - Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ::ffff:192.168.65.1 69bfd94b-23e6-4a37-8f79-c2dbb296946d +1568ms
```

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

# Authorization

## Hydrating user data

To implement authorization, the application must first obtain information about the requesting user. For instance, the
request object should include a `role` property.

Due to security concerns, the JWT used in this project will not contain any user data stored in the primary database.
Instead, it will only issue a temporary id that can be associated with the actual user id.

This temporary id will be stored in an in-memory database. Therefore, all the data needed for authorization must be
acquired using the temporary id each time a server receives a request.

I considered three options for implementing this user data hydration feature and analyzed their pros:

1. A Single Service Handling the Process:
    - Easier adherence to the principle of `least privilege`: Only the necessary user info is exposed to the services
      that require it.
    - Centralization: Having a single service handle authorization streamlines the process and potentially reduces
      redundancy.

2. Each Service Handling the Process:
    - High availability: Since each service authorizes independently, a failure in one does not affect the others.
    - Less network overhead: There's no need for inter-service communication for authorization purposes.

3. Cloud Infrastructure Handling the Process:
    - Decoupling: The authorization process gets separated from the services, promoting a service-oriented architecture.
    - Scalability: AWS manages the scaling of the Lambdas, enhancing the potential scalability of the services.
    - Availability: AWS services typically have higher availability than custom-made services.

Comparing these options, option 3 generally outperforms option 2. While option 1 exhibits centralization advantages, it
has a single point of failure and potentially lowers performance, since each service needs to communicate with the
member service before processing a request. This communication might increase response times.

Given these considerations, the project has opted to use AWS Cognito and Lambda functions to hydrate user data.

## Basic Implementation of Role-Based Access Control (RBAC)

Refer to the [NestJS official docs](https://docs.nestjs.com/security/authorization#basic-rbac-implementation) for more
information.

For the current scope of the project, the `role` property in a `member` is the only attribute taken into consideration
for authorization. Consequently, a RBAC approach is highly suitable.

In the project, RBAC is facilitated through the use of a *custom decorator* and *guard*.

The Roles Guard operates by comparing the numerical enumeration `ROLES` assigned to a `member`. Within this setup, the
lower the numeric value, the higher the precedence of the role.

```TypeScript
// libs/auth/src/roles.guard.ts

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {
	}

	canActivate(context: ExecutionContext): boolean {
		const requiredRole = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [context.getHandler(), context.getClass()])
		if (!requiredRole) {
			return true
		}

		const { user } = context.switchToHttp().getRequest() as { user: User }
		// lower value Role has more privilege
		return user.role <= requiredRole
	}
}
```

In addition, the guard is thoroughly verified through corresponding test cases.

Here are some snippets of the test cases.

```TypeScript
// libs/auth/src/roles.guard.spec.ts

// ...
it('should grant access if user has the required role or higher', () => {
	jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(Role.CERTIFIED)

	const context = {
		switchToHttp: () => ({ getRequest: () => ({ user: { role: Role.ADMIN } }) }),
		getHandler: jest.fn(),
		getClass: jest.fn(),
	} as unknown as ExecutionContext

	expect(guard.canActivate(context)).toBe(true)
})
it('should deny access if user does not have the required role or higher', () => {
	jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(Role.CERTIFIED)

	const context = {
		switchToHttp: () => ({ getRequest: () => ({ user: { role: Role.UNCERTIFIED } }) }),
		getHandler: jest.fn(),
		getClass: jest.fn(),
	} as unknown as ExecutionContext

	expect(guard.canActivate(context)).toBe(false)
})

// ...
```

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

