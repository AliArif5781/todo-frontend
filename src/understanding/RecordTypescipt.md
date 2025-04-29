# TypeScript `Record` Explained Simply

The `Record` in TypeScript is like a dictionary that strictly defines what keys are allowed and what type of values those keys can have.

In your code example:

```typescript
type ButtonVarient = "primary" | "secondary" | "danger" | "outline" | "ghost";

const varientClasses: Record<ButtonVarient, string> = {
  // ...
};
```

This means:

1. The object (`varientClasses`) must have **all** the keys listed in `ButtonVarient` (primary, secondary, etc.)
2. Each of these keys must have a value that is a `string`

## Why is this useful?

1. **Safety**: TypeScript will warn you if you miss any variant or try to add an invalid one
2. **Clarity**: It's immediately clear what the structure of the object should be
3. **Autocomplete**: Your IDE can suggest available variants as you type

In your button component, this ensures that every possible button variant has corresponding CSS classes defined - you can't accidentally forget one.

## Without `Record`

You could write this without `Record` as:

```typescript
const varientClasses: { [key in ButtonVarient]: string } = { ... }
```

But `Record` is just a shorter, cleaner way to write the same thing.
