## Guard JS

Validate input data and parameters with simple guard clauses.

🧪 Fully tested

😎 Includes TypeScript support

🤓 Read the post: [Better data validation with Guard Clauses](https://phillcode.io/better-data-validation-with-guard-clauses)

```js
function someNumberMax10(someNumber) {
  // Name the parameter to generate a better error message
  // Ensures the value is a number <= 10
  guard(someNumber, "someNumber").max(10);
}

function someEmail(email) {
  // Ensure you get a valid email
  guard(email, "email").email();
}

function firstAndLastName(first, last) {
  // Ensures a first name that is at least 3 characters long
  guard(first, "firstName").minLength(3);

  // Chainable API
  // The last name is optional
  // If provided, it must also be at least 3 characters long
  guard(last, "lastName").optional().minLength(3);
}

function performBuiltInTransformations(someString) {
  // Perform transformations in the value
  // Get the modified value in the end
  someString = guard(someString, "someString")
    .trim()
    .length(3, 15)
    .toLowerCase().value;
}

function guardItemsOfAnArray(arr) {
  // If arr is null or undefined, default to an empty array
  // Each item must be a number <= 10
  arr = guard(arr, "arr")
    .defaultTo([])
    .items((g) => g.max(10)).value;
}

function guardPropertiesOfAnObject(obj) {
  // The object must have at least one property
  // All property values must be numbers
  // Perform an action using the object entries
  // Get the guarded value in the end
  obj = guard(obj, "obj")
    .notEmpty()
    .items((g) => g.number())
    .each((value, key) => console.log(key, value)).value;
}
```

These are just some examples.

Have a look below at all the built-in guard and utility clauses to get a hold of everything you can do.

### Included guard (validation) clauses

- `array`: Ensures that the value is a valid JavaScript array
- `date`: Ensures that the value is a valid JavaScript number
- `equal`: Ensures that the value exactly equals (===) the specified value
- `email`: Ensures that the value is a valid email address
- `ensure`: Runs the guarded value through the provided function, which is expected to return true in order for the guarded value to be considered valid. **Use this to provide your own validation function**
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
- `match`: Ensures that the guarded value is a string and matches the provided regex pattern
- `matchAny`: Ensures that the guarded value is a string and matches at least one of the provided patterns
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
- `matchAndFormat`: Ensures that the guarded value is a string and matches the provided regex pattern. If matched, formats the value using the provided format string
- `matchAnyAndFormat`: Ensures that the guarded value is a string and matches at least one of the provided patterns. If matched, formats the value using the associated format string
- `optional`: Marks the guarded value as optional, so that guard functions will not throw an error if the value is null or undefined
- `transform`: Runs the guarded value through the provided transform function. **Use this to provide your own transformation function**
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
