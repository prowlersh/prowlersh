# Builtins

Each module in this directory must export a member with the following schema:

```ts
interface REPLCommand {
    /**
     * Help text to be displayed when `.help` is entered.
     */
    help?: string;
    /**
     * The function to execute, optionally accepting a single string argument.
     */
    action: (this: REPLServer, text: string) => void;
}
```

Each of these modules will be loaded into the application with their filename as the name of the command.

Example Structure:

```txt
builtins/
  cd.ts
  kill.ts
  cwd.ts
```

Each of these get loaded into the application as cd, kill, cwd respectively. These are then accessible from the shell as `.cd`, `.kill`, and `.cwd`.
