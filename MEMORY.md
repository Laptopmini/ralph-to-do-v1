Renamed jest.config.js to jest.config.cjs to fix ESM/CommonJS conflict. 
Implemented src/storage.js with named exports loadTodos and saveTodos using ES modules (export) instead of module.exports, matching the project's "type": "module" configuration. 
Ensured validation logic in loadTodos filters for correct types as specified.
