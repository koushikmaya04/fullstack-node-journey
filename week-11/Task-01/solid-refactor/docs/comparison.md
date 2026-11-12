# Before and after: applying SRP, OCP and LSP

## Starting point: one God Service

\`GodUserService.register()\` normalizes and validates input, applies plan rules, writes the user to storage, and sends an email. Validation, business policy, persistence, and external delivery all have different reasons to change, but they are coupled in one method.

## Step 1 – SRP: separate the responsibilities

- \`RegisterUserValidator\` owns normalization and validation.
- \`RegisterUserService\` coordinates the registration use case.
- \`UserRepository\` defines the persistence boundary.
- \`MailClient\` defines the email-delivery boundary.
- \`WelcomeMessageStrategy\` owns the message for a plan.

The service coordinates collaborators; it no longer needs to know SQL, SMTP, or the rules for validating an email address.

## Step 2 – OCP: extend plan behavior with strategies

The registration workflow receives a map of strategies keyed by plan. Adding a team plan means implementing \`TeamWelcomeStrategy\` and registering it in the composition map. The existing registration service does not get another \`if/else\` branch.

The registration map is configuration and naturally changes when a new implementation is introduced. OCP does not mean no code ever changes; it means stable workflow code is extended through a planned abstraction rather than repeatedly modified for each variation.

## Step 3 – LSP: verify substitutability

All welcome strategies implement the same \`WelcomeMessageStrategy\` contract. A caller can use any implementation and still rely on the same behavior: it receives a valid user and gets a non-empty subject/body without the strategy mutating the user.

The contract tests run the same assertions against Free, Pro, and Team strategies. This checks more than matching method names: each implementation must honor the expectations callers rely on.

## Before vs after

| Concern | Before | After |
| --- | --- | --- |
| Validation | Inside God Service | Dedicated validator |
| Workflow | Mixed with details | Small orchestration service |
| Persistence | Same class owns the operation | Repository interface |
| Email | Sent by the God Service | Mail client interface |
| Plan variations | Conditional logic | Strategy implementations |
| Tests | One broad setup | Per-responsibility tests and shared contract checks |

## A practical note

SOLID is not about making a class for every line. Split responsibilities when they change for different reasons, and introduce abstractions where an extension point or infrastructure boundary is useful. Keep the design proportional to the problem.
