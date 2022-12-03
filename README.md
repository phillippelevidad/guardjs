## Guard JS

Validate input data and parameters with simple guard clauses.

Read the post: [Better data validation with Guard Clauses](https://phillcode.io/better-data-validation-with-guard-clauses)

Includes TypeScript support.

```js
function needANumberLessThen10(someNumber) {
  guard(someNumber, "someNumber") // Name the parameter to generate a better error message
    .notNull() // Ensures the value is not null
    .max(10); // Ensures the value is a number <= 10

  // Use the number knowing it to be valid.
}

function needAnEmail(email) {
  guard(email, "email")
    .notNull() // Ensures the value is not null
    .email(); // Ensures the value is a valid email

  // Use the email knowing it to be valid.
}

function firstAndLastNames(first, last) {
  // Ensures a first name at least 3 characters long.
  guard(first, "firstName").notNull().minLength(3);

  // Last is options. If provided, also min 3 chars long.
  guard(last, "lastName").minLength(3);

  // Use the mandatory first name and optional last name.
}
```

### Install from NPM

```
npm install @phillcode/guard
```

```
yarn add @phillcode/guard
```
