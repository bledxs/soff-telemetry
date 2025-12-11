# Contributing to SOFF Telemetry

## 🛠️ Development Setup

1. **Clone y instalar**:

   ```bash
   git clone <your-repo>
   cd soff-telemetry
   npm install
   ```

2. **Desarrollo**:

   ```bash
   npm run dev           # Watch mode
   npm run build         # Compile TypeScript
   npm run update-visitor # Test visitor badge
   ```

3. **Linting y Formato**:

   ```bash
   npm run lint          # Check linting
   npm run lint:fix      # Fix linting issues
   npm run format        # Format code
   npm run typecheck     # Type checking
   ```

## 📋 Code Style

- **TypeScript** estricto con `strict: true`
- **ESLint** para linting
- **Prettier** para formateo automático
- **Husky** ejecuta hooks automáticamente:
  - `pre-commit`: lint-staged (lint + format)
  - `pre-push`: typecheck

## 🎯 Architecture

```text
src/
├── domain/          # Types & interfaces (sin dependencias)
├── infrastructure/  # I/O, APIs, storage
└── presentation/    # SVG rendering, templates
```

### Principios

- **Separación de responsabilidades**
- **Inyección de dependencias**
- **Tipos explícitos**
- **Sin side effects en funciones puras**

## 🔄 Pull Request Process

1. Crea un branch: `git checkout -b feature/nueva-funcionalidad`
2. Haz cambios y commits descriptivos
3. Los hooks verificarán automáticamente:
   - ✅ Lint & Format (pre-commit)
   - ✅ Type checking (pre-push)
4. Push y abre PR con descripción clara

## 📝 Commit Messages

Usa conventional commits:

```text
feat: agregar stats card
fix: corregir escapado de XML
docs: actualizar README
refactor: mejorar arquitectura de storage
```

## 🧪 Testing (Coming Soon)

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🚀 Agregar un nuevo badge

1. Define tipos en `domain/types.ts`
2. Crea template en `presentation/templates/`
3. Agrega lógica en `main.ts`
4. Actualiza workflow si es necesario

Ejemplo:

```typescript
// domain/types.ts
export interface MyBadgeData {
  value: number;
}

// presentation/templates/my-badge.ts
export function renderMyBadge(data: MyBadgeData, options: Options): string {
  // ... renderizar SVG
}

// main.ts
if (service === 'mybadge') {
  await generateMyBadge(storage);
}
```

## 📚 Resources

- [GitHub GraphQL API](https://docs.github.com/graphql)
- [SVG Specification](https://www.w3.org/TR/SVG2/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ❓ Questions?

Abre un issue o discusión en GitHub!
