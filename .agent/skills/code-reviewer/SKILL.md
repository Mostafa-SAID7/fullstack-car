---
name: code-reviewer
description: A specialized agent for reviewing code, enforcing Clean Architecture, CQRS, and Vertical Slices.
---

# Code Review Skill

## Purpose
To provide comprehensive code reviews that strictly enforce this project's architectural standards (Clean Architecture, CQRS, Vertical Slices), identify bugs, and ensure best practices.

## Project Architecture Context
The project follows a **strict Clean Architecture** with **CQRS** and **Vertical Slices**.

### Layer Requirements

#### Domain Layer
**Must conform to:**
- No external dependencies (no NuGet packages unrelated to pure logic)
- Pure POCO entities inheriting from `BaseAuditableEntity`
- Domain Events for side effects
- Navigation properties marked as `virtual` for lazy loading
- **Anti-pattern found**: Duplicate properties (e.g., `MemberCount`/`MembersCount`) - flag these

#### Application Layer
**Must conform to:**
- **Vertical Slices**: Features grouped by domain (e.g., `Community/Groups`), then `Commands`/`Queries`
- **CQRS**: Strict separation of Command (write) and Query (read) models
- **MediatR**: Use `IRequest<Result<T>>` and `IRequestHandler<TRequest, TResponse>`
- **Queries**: Should implement `ICacheableRequest` with proper cache keys, expiration, and tags
- **Commands**: Should invalidate cache using `_cacheService.RemoveByTagAsync()`
- **Validation**: FluentValidation validators SHOULD exist for commands (currently missing in many features - flag this)
- **Mapping**: AutoMapper profiles exist but handlers often use manual DTO mapping - ensure consistency
- **Specifications**: Complex queries should use the Specification pattern (e.g., `GroupWithDetailsSpecification`)

#### Infrastructure Layer
**Must conform to:**
- Implement interfaces defined in Application/Domain
- EF Core configurations in separate `IEntityTypeConfiguration<T>` files
- Repository pattern with generic `IRepository<T>`
- UnitOfWork pattern via `IUnitOfWork`
- **CancellationToken**: ALL repository calls must pass `CancellationToken`
- **Use UnitOfWork.SaveChangesAsync()**: NOT `DbContext.SaveChangesAsync()` directly (UnitOfWork dispatches domain events)
- **Specification Pattern**: Complex queries with includes must use `ISpecification<T>`
- **Entity Configurations**: 
  - Use Fluent API in separate configuration classes
  - Explicit `HasMaxLength()` for string properties
  - Explicit `DeleteBehavior` on all foreign keys
  - Enum properties should use `.HasConversion<string>()`
- **Anti-patterns to flag**:
  - Duplicate methods in repositories (e.g., `GetAllAsync` vs `ListAllAsync`)
  - Missing `AsNoTracking()` for read-only queries
  - Inline entity configurations in `OnModelCreating`
  - Duplicate `DbSet<T>` declarations


#### WebAPI Layer
**Must conform to:**
- Thin controllers delegating immediately to MediatR
- Standardized response envelopes using `Result<T>`
- Proper route conventions (`[Route("api/v{version:apiVersion}/[controller]")]`)

---

## Execution Rules

### 1. Analyze Structure & Dependencies
- **Check**: Does the code violate layer dependencies? (e.g., Domain using Infrastructure types)
- **Check**: Is the Vertical Slice pattern followed? (Are DTOs, Handlers, and Validators co-located?)
- **Check**: Are Commands and Queries properly separated?

### 2. Analyze CQRS Implementation
- **Commands**: 
  - Must save changes via `_unitOfWork.SaveChangesAsync(cancellationToken)`
  - Must invalidate cache with appropriate tags
  - Should have corresponding FluentValidation validator (flag if missing)
- **Queries**: 
  - Must implement `ICacheableRequest` if reading data
  - Should use Specification pattern for complex filtering
  - Must pass `CancellationToken` to all async operations

### 3. Analyze Code Quality
- **Async/Await**: Verify proper `async/await` usage. Detect blocking calls like `.Result` or `.Wait()`
- **CancellationToken**: Ensure `CancellationToken` is passed to all async methods and EF Core calls
- **Null Safety**: Check for proper null checks and use of null-forgiving operator (`!`)
- **Mapping Consistency**: Flag if manual DTO mapping is used when AutoMapper profile exists
- **Error Handling**: Ensure no generic `try/catch` blocks that swallow exceptions
- **Logging**: Check for structured logging usage (Serilog)

### 4. Domain Entity Review
- **Base Classes**: Entities should inherit from `BaseAuditableEntity` for audit fields
- **Navigation Properties**: Should be marked `virtual` and initialized to empty collections
- **Duplicate Properties**: Flag any redundant properties (e.g., `Count`/`CountAlias`)

### 5. Duplicate Detection
- **Duplicate Properties**: Flag any "alias" properties (e.g., `MemberCount` AND `MembersCount` in same entity)
- **Duplicate Methods**: 
  - Check for identical method names with only CancellationToken difference (anti-pattern)
  - Flag duplicate repository methods (e.g., `GetAllAsync` vs `ListAllAsync`)
  - Recommend: Use `CancellationToken = default` pattern instead of separate overloads
- **Duplicate Files**: Check for duplicate class names across projects (except build artifacts)
- **Duplicate DbSets**: Flag duplicate `DbSet<T>` declarations in DbContext
- **Duplicate Endpoints**: Check for duplicate route patterns in controllers
- **Duplicate Code Patterns**: Flag repeated logic that should be extracted to base class/helper

---

## Output Format

Provide reviews in the following markdown format:

### 🔍 Review Summary
Brief overview of the code quality and compliance.

### 🏗️ Architectural Compliance
- **Layering**: [✅ Pass / ❌ Fail]
- **CQRS Pattern**: [✅ Pass / ❌ Fail]
- **Vertical Slices**: [✅ Pass / ❌ Fail]

**Notes:** List any architectural violations.

### 🐛 Issues & Improvements
| Severity | Category | Description | Recommendation |
|----------|----------|-------------|----------------|
| 🔴 High  | ... | ... | ... |
| 🟡 Med   | ... | ... | ... |
| 🟢 Low   | ... | ... | ... |

### 💡 Refactored Snippet (if applicable)
```csharp
// Provide corrected code for the most critical issue
```

### ✨ Best Practices Observed
- List positive patterns found in the code
