# Testing - Life Tracker

## Testing Strategy

The project uses a combination of:
- Manual testing
- Automated unit testing
- Automated end-to-end testing

Testing is based directly on:
- User flows
- Requirements
- Acceptance criteria,

## Testing tools

Unit testing - Jest
End-to-end testing - Playwright
Manual testing - Test cases
Linting - ESLint
CI pipeline - GitLab CI

## Automated Testing

### Jest Unit Tests
Jest is used to test isolated application logic such as:
- Habit validation
- Completion logic
- State Changes
- Frequency handling

#### Example Tests
- Empty habit name is rejected.
- Habit completion state updates properly

### Playwright End-to-End Tests

Playwright is used to test complete browser-based user flows such as:
- Application loads correctly
- Create habit
- Delete habit
- Validation error
- Rendering behavior

#### Example Flow
Create Habit:
1. Open application
2. Click "Create Habit"
3. Enter habit name
4. Save habit
5. Verify habit appears in UI.

## Manual Testing
Manual testing was continuously performed during development using test cases documented in a GitLab Wiki.

Manual testing focused on:
- UI behavior
- Calendar navigation
- Habit completion status behavior

## Test Status 

Current automated test results:

Jest:
- 6 unit tests implemented.
- All tests currently passing

Playwright:
- End-to-end tests implemeted for core flows.
- Chromium-based tests currently stable

Automated tests are executed automatically through the GitLab CI pipeline on pushes and merge requests.

## Known Testing Challenges

Some Playwright tests initially experienced timing-related issues due to asynchronous rendering and Shadow DOM interactions. for example would Playwright occasionally interact with old UI state before updates completed.

## Future Testing Improvments
- Additional test to cover more of the requirements.
- Integration tests.
- Expanded Playwright coverage.
