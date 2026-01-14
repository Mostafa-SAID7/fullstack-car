# Translation Validation Scripts

This directory contains scripts for validating translation completeness and consistency across all supported languages in the Community Localization Enhancement system.

## Overview

The validation scripts check translation files for:
- **Missing translation keys** - Keys present in the reference language (en-US) but missing in other languages
- **Extra translation keys** - Keys present in other languages but not in the reference
- **Empty or null values** - Translation keys with no content
- **Placeholder consistency** - Ensures placeholders like `{{value}}` match between languages
- **JSON parsing errors** - Detects malformed JSON files

## Supported Languages

- `en-US` - English (United States) - Reference language
- `ar-EG` - Arabic (Egypt)
- `ar-AE` - Arabic (United Arab Emirates)
- `ar-SA` - Arabic (Saudi Arabia)

## Scripts

### PowerShell Script (Windows/Cross-platform)

**File:** `Validate-Translations.ps1`

**Usage:**
```powershell
# Basic validation with console output
.\scripts\Validate-Translations.ps1

# Generate JSON report
.\scripts\Validate-Translations.ps1 -OutputFormat Json -OutputPath "report.json"

# Generate HTML report
.\scripts\Validate-Translations.ps1 -OutputFormat Html -OutputPath "report.html"

# Validate specific resource path
.\scripts\Validate-Translations.ps1 -ResourcePath "src/WebAPI/Resources"

# Use different reference culture
.\scripts\Validate-Translations.ps1 -ReferenceCulture "en-US"
```

**Parameters:**
- `-ResourcePath` - Path to translation resources (default: `src/WebAPI/Resources`)
- `-ReferenceCulture` - Reference culture for comparison (default: `en-US`)
- `-OutputFormat` - Output format: `Console`, `Json`, or `Html` (default: `Console`)
- `-OutputPath` - Path to save report file (required for Json/Html formats)

### Node.js Script (Cross-platform)

**File:** `validate-translations.js`

**Usage:**
```bash
# Basic validation with console output
node scripts/validate-translations.js

# Specify resource path
node scripts/validate-translations.js src/WebAPI/Resources

# Generate JSON report
node scripts/validate-translations.js src/WebAPI/Resources json report.json

# Generate HTML report
node scripts/validate-translations.js src/WebAPI/Resources html report.html
```

**Arguments:**
1. Resource path (default: `src/WebAPI/Resources`)
2. Output format: `console`, `json`, or `html` (default: `console`)
3. Output file path (optional, auto-generated if not provided)

## Exit Codes

Both scripts use the following exit codes:
- `0` - All validations passed, no issues found
- `1` - Non-critical issues found (High, Medium, or Low severity)
- `2` - Critical issues found (must be fixed)

## Issue Severity Levels

### Critical
- **Missing reference file** - The en-US reference file is missing
- **Missing placeholders** - Required placeholders are missing from translations
- **Parse errors** - JSON file cannot be parsed

### High
- **Missing keys** - Translation keys are missing compared to reference
- **Empty values** - Translation values are empty or null

### Medium
- **Extra placeholders** - Additional placeholders not in reference

### Low
- **Extra keys** - Additional keys not present in reference language

## Validation Process

1. **Discover Features** - Recursively scans the resource directory for translation files
2. **Load Reference** - Loads the en-US reference file for each feature
3. **Extract Keys** - Extracts all translation keys using dot notation (e.g., `posts.create.title`)
4. **Extract Placeholders** - Identifies all placeholders in reference translations
5. **Compare Cultures** - Validates each supported culture against the reference
6. **Report Issues** - Generates detailed reports of all validation issues

## Output Formats

### Console Output
Displays a formatted report in the terminal with:
- Summary statistics (total features, keys, issues)
- Issues grouped by severity and type
- Detailed issue listings with color coding

### JSON Output
Generates a machine-readable JSON file containing:
```json
{
  "totalFeatures": 25,
  "totalKeys": 450,
  "issues": [
    {
      "type": "MissingKey",
      "culture": "ar-EG",
      "feature": "Main.Community.Posts",
      "key": "posts.create.title",
      "message": "Missing translation key: posts.create.title",
      "severity": "High"
    }
  ],
  "timestamp": "2026-01-14T10:30:00.000Z"
}
```

### HTML Output
Generates a visual HTML report with:
- Interactive summary cards
- Color-coded severity indicators
- Filterable issue listings
- Responsive design for mobile viewing

## Integration with CI/CD

### GitHub Actions Example
```yaml
name: Validate Translations

on:
  pull_request:
    paths:
      - 'src/WebAPI/Resources/**/*.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Validate Translations
        run: node scripts/validate-translations.js
      
      - name: Generate Report
        if: failure()
        run: node scripts/validate-translations.js src/WebAPI/Resources html validation-report.html
      
      - name: Upload Report
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: validation-report
          path: validation-report.html
```

### Pre-commit Hook Example
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check if any translation files are being committed
if git diff --cached --name-only | grep -q "src/WebAPI/Resources.*\.json"; then
    echo "Validating translations..."
    node scripts/validate-translations.js
    
    if [ $? -ne 0 ]; then
        echo "Translation validation failed. Please fix the issues before committing."
        exit 1
    fi
fi
```

## Common Issues and Solutions

### Missing Translation Keys
**Issue:** A key exists in en-US but not in other languages

**Solution:** Add the missing key to the target language file with appropriate translation

**Example:**
```json
// en-US.json
{
  "posts": {
    "create": "Create Post"
  }
}

// ar-EG.json - Add missing key
{
  "posts": {
    "create": "اكتب بوست"
  }
}
```

### Placeholder Mismatch
**Issue:** Placeholders don't match between languages

**Solution:** Ensure all placeholders are present in translations

**Example:**
```json
// en-US.json
{
  "greeting": "Hello, {{name}}!"
}

// ar-EG.json - Correct
{
  "greeting": "مرحباً، {{name}}!"
}

// ar-EG.json - Incorrect (missing placeholder)
{
  "greeting": "مرحباً!"
}
```

### Empty Values
**Issue:** Translation value is empty or null

**Solution:** Provide a translation or remove the key if not needed

### Extra Keys
**Issue:** Keys exist in other languages but not in reference

**Solution:** Either add to reference or remove from other languages for consistency

## Best Practices

1. **Run Before Committing** - Always validate translations before committing changes
2. **Fix Critical Issues First** - Address critical and high severity issues immediately
3. **Review Medium/Low Issues** - Evaluate if extra keys or placeholders are intentional
4. **Keep Reference Updated** - Ensure en-US is always the most complete translation
5. **Document Placeholders** - Add comments explaining placeholder usage
6. **Test Translations** - Verify translations display correctly in the UI
7. **Use Consistent Terminology** - Maintain consistent translation of common terms
8. **Regular Audits** - Run validation regularly, not just on changes

## Troubleshooting

### Script Won't Run
- **PowerShell:** Ensure execution policy allows scripts: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
- **Node.js:** Ensure Node.js is installed: `node --version`

### Path Not Found
- Verify the resource path is correct relative to script location
- Use absolute paths if relative paths cause issues

### JSON Parse Errors
- Validate JSON syntax using a JSON validator
- Check for trailing commas, missing quotes, or invalid characters
- Ensure UTF-8 encoding for files with special characters

### Performance Issues
- For large projects, consider validating specific features
- Use JSON output format for faster processing
- Run validation in parallel for multiple features

## Contributing

When adding new translation features:
1. Create en-US.json first as the reference
2. Add all required keys with proper structure
3. Document any placeholders used
4. Create corresponding files for all supported cultures
5. Run validation to ensure completeness
6. Fix any issues before submitting PR

## Support

For issues or questions:
- Check the validation report for detailed error messages
- Review this README for common solutions
- Consult the design document: `.kiro/specs/community-localization-enhancement/design.md`
- Contact the localization team for translation-specific questions
