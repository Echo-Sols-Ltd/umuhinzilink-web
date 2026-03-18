# Type Safety & Directory Constraints

- **STRICT RULE:** Never modify, delete, or overwrite any files within the `@types/` directory.
- **Source of Truth:** The `@types/` directory is the definitive source of truth for all interfaces, types, and data structures.
- **Component Alignment:** When creating or updating components, you must strictly adhere to the existing definitions in `@types/`. 
- **Conflict Resolution:** If there is a mismatch between a component's implementation and a definition in `@types/`, you must update the **component code** to match the type. Do not suggest "fixing" the type definition to suit the component.
- **Verification:** Always check the relevant `.d.ts` or `.ts` files in `@types/` before generating component props or state logic.