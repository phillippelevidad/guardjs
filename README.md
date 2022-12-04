## Guard JS

Validate input data and parameters with simple guard clauses.

Read the post: [Better data validation with Guard Clauses](https://phillcode.io/better-data-validation-with-guard-clauses)

Includes TypeScript support.

```js
function needANumberLessThen10(someNumber) {
  guard(someNumber, "someNumber") // Name the parameter to generate a better error message
    .max(10); // Ensures the value is a number <= 10

  // Use the number knowing it to be valid.
}

function needAnEmail(email) {
  guard(email, "email").email(); // Ensures the value is a valid email

  // Use the email knowing it to be valid.
}

function firstAndLastNames(first, last) {
  // Ensures a first name at least 3 characters long.
  guard(first, "firstName").minLength(3);

  // Last is options. If provided, also min 3 chars long.
  guard(last, "lastName").optional().minLength(3);

  // Use the first name and optional last name.
}
```

### Included guard (validation) clauses

- `array`: Ensures that the value is a valid JavaScript array
- `date`: Ensures that the value is a valid JavaScript number
- `equal`: Ensures that the value exactly equals (===) the specified value
- `email`: Ensures that the value is a valid email address
- `ensure`: Runs the guarded value through the provided function, which is expected to return true in order for the guarded value to be considered valid
- `hostname`: Ensures that the value is a valid hostname (domain name)
- `in`: Ensures that the value matches one of the possible values
- `instanceOf`: Ensures that the guarded value is a valid instance of the specified class
- `integer`: Ensures that the value is in the valid integer
- `isoDateTime`: Ensures that the value is a valid ISO datetime string
- `length`: Ensures that the value is a string or array within the specified length (min and max)
- `max`: Ensures that the value is a number lesser than or equal to the specified value
- `maxLength`: Ensures that the value is a string or array with length lesser than or equal to the specified value
- `min`: Ensures that the value is a number greater than or equal to the specified value
- `minLength`: Ensures that the value is a string or array with length greater than or equal to the specified value
- `notEqual`: Ensures that the value, does NOT exactly equals (!==) the specified value
- `notIn`: Ensures that the value is not one of the specified values
- `notEmpty`: Ensures that the value is not empty. If the value is a string, it must have at least one character. If it is an array, it must have at least one element. If it is an object, it must have at least one property
- `notEmptyOrWhitespace`: Ensures that the value is a string with at least one character that is not a whitespace
- `number`: Ensures that the value is a valid JavaScript number
- `object`: Ensures that the value is a valid JavaScript object
- `pattern`: Ensures that the guarded value is a string and matches the provided regex pattern
- `patterns`: Ensures that the guarded value is a string and matches at least one of the provided patterns
- `range`: Ensures that the value is a number in the specified range
- `string`: Ensures that the value is a valid JavaScript string
- `unique`: Ensures that the value is an array and that all of its entries are unique
- `url`: Ensures that the value is a valid URL
- `hasValue`: Returns a value indicating whether the guarded value is null or undefined

### Included utility clauses

- `coerceToBoolean`: Coerces the guarded value into a Boolean value, guaranteed to be either true or false
- `defaultTo`: Provides a default value, in case the original is null or undefined
- `do`: If the guarded value is not null nor undefined, runs it through the provided callback function
- `each`: Steps into the items of the input value, when it is an array or object
- `makeUnique`: If the value is present and is an Array, makes its elements unique
- `optional`: Marks the guarded value as optional, so that guard functions will not throw an error if the value is null or undefined
- `transform`: Runs the guarded value through the provided transform function
- `toLowerCase`: Makes a string lower case
- `toUpperCase`: Makes a string upper case
- `trim`: Trims the guarded string value

### Install from NPM

```
npm install @phillcode/guard
```

```
yarn add @phillcode/guard
```
