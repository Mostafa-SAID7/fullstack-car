# Translation Validation - Quick Start Guide

## 🚀 Quick Start

### Option 1: PowerShell (Windows/Cross-platform)

```powershell
# Run validation with console output
.\scripts\Validate-Translations.ps1

# Generate HTML report
.\scripts\Validate-Translations.ps1 -OutputFormat Html -OutputPath "translation-report.html"
```

### Option 2: Node.js (Cross-platform)

```bash
# Run validation with console output
node scripts/validate-translations.js

# Generate HTML report
node scripts/validate-translations.js src/WebAPI/Resources html translation-report.html
```

## 📊 Understanding the Output

### Console Output Example
```
========================================
  Translation Validation Report
========================================

Total Features Validated: 25
Total Translation Keys: 450
Total Issues Found: 3

Issues by Severity:
  Critical: 0
  High: 2
  Medium: 1
  Low: 0

Issues by Type:
  MissingKey: 2
  ExtraPlaceholder: 1
```

### Exit Codes
- **0** = ✅ All good! No issues found
- **1** = ⚠️ Non-critical issues (review recommended)
- **2** = ❌ Critical issues (must fix!)

## 🔍 Common Issues

### Missing Translation Key
**What it means:** A translation exists in English but not in another language

**How to fix:**
1. Open the target language file (e.g., `ar-EG.json`)
2. Add the missing key with appropriate translation
3. Run validation again

**Example:**
```json
// en-US.json
{
  "posts": {
    "create": "Create Post"
  }
}

// ar-EG.json - Add this:
{
  "posts": {
    "create": "اكتب بوست"
  }
}
```

### Missing Placeholder
**What it means:** A placeholder like `{{name}}` is missing in translation

**How to fix:**
1. Find the key in the reference (en-US)
2. Copy the placeholders to your translation
3. Keep placeholders in English, translate around them

**Example:**
```json
// en-US.json
{
  "greeting": "Hello, {{name}}!"
}

// ar-EG.json - Correct:
{
  "greeting": "مرحباً، {{name}}!"
}

// ar-EG.json - Wrong (missing {{name}}):
{
  "greeting": "مرحباً!"
}
```

### Empty Value
**What it means:** A translation key exists but has no value

**How to fix:**
1. Add a translation for the key
2. Or remove the key if not needed

## 📁 File Locations

All translation files are in: `src/WebAPI/Resources/`

Structure:
```
src/WebAPI/Resources/
├── Main/Community/
│   ├── Posts/
│   ├── Groups/
│   ├── QA/
│   └── ...
├── Dashboard/
├── Identity/
└── Shared/
```

Each folder contains:
- `en-US.json` (English - reference)
- `ar-EG.json` (Egyptian Arabic)
- `ar-AE.json` (UAE Arabic)
- `ar-SA.json` (Saudi Arabic)

## 🔄 Workflow

1. **Make changes** to translation files
2. **Run validation** before committing
3. **Fix issues** if any are found
4. **Commit** when validation passes

## 💡 Tips

- Always edit `en-US.json` first (it's the reference)
- Keep placeholders like `{{value}}` exactly as they are
- Use consistent terminology across translations
- Run validation frequently during development

## 📚 More Information

- Full documentation: `scripts/TRANSLATION_VALIDATION_README.md`
- Implementation summary: `scripts/TRANSLATION_VALIDATION_SUMMARY.md`
- Design spec: `.kiro/specs/community-localization-enhancement/design.md`

## 🆘 Need Help?

If validation fails and you're not sure why:
1. Check the detailed error message
2. Look at the reference file (en-US.json)
3. Compare with the target language file
4. Review the examples in this guide

## ✅ Success Checklist

- [ ] Validation scripts run without errors
- [ ] All critical issues resolved
- [ ] High severity issues addressed
- [ ] HTML report generated (optional)
- [ ] Changes committed

---

**Ready to validate?** Run one of the commands at the top of this guide!
