# Persistent State Utilities

A tiny, **type-safe** toolkit for persisting React state to different backends using declarative schemas. Define how each field is serialized/deserialized once, and reuse the same schema with:

- **LocalStorage**
- **URL Search Params**
- **Custom storages**

Full TypeScript inference included.

---

## Features

- 🔒 **Type-safe schemas** with `DataType<T>` (serialize/deserialize per-field)
- 💾 **Multiple backends**: localStorage, URL query, or your own
- ⚛️ **React hooks**: `usePersistentState`, `useLocalStorageState`, `useSearchParamsState`
- 🧩 **Default values** supported per-field
- 📦 **Utility fns** for direct read/write without hooks

---

## Installation

```bash
npm i @sasha.p/use-persistent-state
```

---

## Core Concepts

### `DataType<T, D>`

Defines how a single field is persisted:

```ts
export type DataType<T, D = null> = {
  serialize(value: NonNullable<T>): string;
  deserialize(serializedValue?: string | null | undefined): T | D;
};
```

- `T` — runtime type you want to work with
- `D` — fallback type when there is no value (defaults to `null`)
- `deserialize` should return either a value of `T` or the fallback `D`

### Creating DataTypes

Use the provided factory helper to build consistent data types with optional defaults:

```ts
export const createDataTypeCtr = <T>(
  impl: (options?: { defaultValue?: T }) => DataType<T, any>,
) => {
  /* ... */
};
```

This yields curried creators like `$String`, `$Number`, etc., each supporting:

- No options → fallback is `null`
- `{ defaultValue }` → fallback is that value

---

## Built-in Data Types

- **`$String`** – persists strings
- **`$StringArray`** – persists string arrays
- **`$Number`** – persists numbers
- **`$NumberArray`** – persists number arrays
- **`$Boolean`** – persists booleans

Example with defaults:

```ts
const name = $String({ defaultValue: 'John' });
const age = $Number({ defaultValue: 30 });
const tags = $StringArray({ defaultValue: [] });
```

---

## Schema

Schemas describe the shape of your persistent state:

```ts
const schema = {
  name: $String({ defaultValue: 'Guest' }),
  age: $Number(),
  tags: $StringArray({ defaultValue: [] }),
};
```

This produces a fully typed object when loaded.

---

## React Hooks

### `usePersistentState`

Backend-agnostic hook that powers all others:

```ts
const [state, setState] = usePersistentState(schema, {
  get: (key) => storage.getItem(key),
  save: (data) => storage.setItem('myKey', JSON.stringify(data)),
});
```

- `state` → typed object matching schema
- `setState(update)` → updates and persists values

---

### `useLocalStorageState`

Persist state in **localStorage**:

```ts
const schema = {
  theme: $String({ defaultValue: 'light' }),
  count: $Number({ defaultValue: 0 }),
};

const [state, setState] = useLocalStorageState(schema, { key: 'app-settings' });

// Usage
console.log(state.theme); // "light"
setState({ theme: 'dark' });
```

---

### `useSearchParamsState`

Persist state in **URL query params**:

```ts
const schema = {
  page: $Number({ defaultValue: 1 }),
  filter: $String(),
};

const [state, setState] = useSearchParamsState(schema);

// Usage
console.log(state.page); // 1 (from ?page=1)
setState({ page: 2 }); // updates URL to ?page=2
```

---

## Non-hook Utilities

### `getPersistedValues`

Read persisted values directly:

```ts
const values = getPersistedValues(schema, { key: 'app-settings' });
```

### `persistValues`

Write values directly:

```ts
persistValues(schema, { theme: 'dark', count: 5 }, { key: 'app-settings' });
```

---

## Custom Storages

Implement the `Storage` interface to create your own backend:

```ts
export interface Storage<Key = string> {
  get(key: Key): string | null;
  save(data: object): void;
}
```

Example: **sessionStorage adapter**:

```ts
const sessionStorageAdapter: Storage<string> = {
  get: (key) => sessionStorage.getItem(key),
  save: (data) => sessionStorage.setItem('state', JSON.stringify(data)),
};
```

---

## Example

```tsx
const schema = {
  username: $String({ defaultValue: 'Anonymous' }),
  darkMode: $Boolean({ defaultValue: false }),
};

function App() {
  const [state, setState] = useLocalStorageState(schema, { key: 'settings' });

  return (
    <div>
      <p>Hello, {state.username}</p>
      <button onClick={() => setState({ darkMode: !state.darkMode })}>
        Toggle Dark Mode
      </button>
    </div>
  );
}
```

---

## License

MIT © Your Name
