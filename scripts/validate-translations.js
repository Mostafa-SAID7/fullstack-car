#!/usr/bin/env node

/**
 * Translation Validation Script
 * 
 * Validates translation files for completeness and consistency by:
 * - Detecting missing translation keys across languages
 * - Validating placeholder consistency (e.g., {{value}})
 * - Checking for empty or null values
 * - Generating detailed validation reports
 */

const fs = require('fs');
const path = require('path');

// Configuration
const RESOURCE_PATH = process.argv[2] || 'src/WebAPI/Resources';
const REFERENCE_CULTURE = 'en-US';
const SUPPORTED_CULTURES = ['en-US', 'ar-EG', 'ar-AE', 'ar-SA'];
const OUTPUT_FORMAT = process.argv[3] || 'console'; // console, json, html
const OUTPUT_PATH = process.argv[4] || '';

// Validation results
const validationResults = {
    totalFeatures: 0,
    totalKeys: 0,
    issues: [],
    timestamp: new Date().toISOString()
};

/**
 * Recursively extracts all keys from a nested JSON object
 */
function getTranslationKeys(obj, prefix = '') {
    const keys = [];
    
    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            keys.push(...getTranslationKeys(value, fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    
    return keys;
}

/**
 * Extracts placeholders from a translation value
 */
function getPlaceholders(value) {
    if (typeof value !== 'string') return [];
    
    const pattern = /\{\{([^}]+)\}\}/g;
    const placeholders = [];
    let match;
    
    while ((match = pattern.exec(value)) !== null) {
        placeholders.push(match[1]);
    }
    
    return placeholders;
}

/**
 * Gets a nested value from an object using dot notation
 */
function getTranslationValue(obj, key) {
    const parts = key.split('.');
    let current = obj;
    
    for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
            current = current[part];
        } else {
            return null;
        }
    }
    
    return current;
}

/**
 * Tests a translation file for issues
 */
function testTranslationFile(filePath, culture, feature, referenceKeys = new Set(), referencePlaceholders = {}) {
    const issues = [];
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        issues.push({
            type: 'MissingFile',
            culture,
            feature,
            message: `Translation file not found: ${filePath}`,
            severity: 'Critical'
        });
        return issues;
    }
    
    try {
        // Load and parse JSON file
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);
        
        // Get all keys from this file
        const currentKeys = getTranslationKeys(json);
        const currentKeysSet = new Set(currentKeys);
        
        // Check for missing keys (compared to reference)
        if (referenceKeys.size > 0) {
            for (const refKey of referenceKeys) {
                if (!currentKeysSet.has(refKey)) {
                    issues.push({
                        type: 'MissingKey',
                        culture,
                        feature,
                        key: refKey,
                        message: `Missing translation key: ${refKey}`,
                        severity: 'High'
                    });
                }
            }
            
            // Check for extra keys (not in reference)
            for (const currentKey of currentKeys) {
                if (!referenceKeys.has(currentKey)) {
                    issues.push({
                        type: 'ExtraKey',
                        culture,
                        feature,
                        key: currentKey,
                        message: `Extra translation key not in reference: ${currentKey}`,
                        severity: 'Low'
                    });
                }
            }
        }
        
        // Check for empty or null values and placeholder consistency
        for (const key of currentKeys) {
            const value = getTranslationValue(json, key);
            
            if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                issues.push({
                    type: 'EmptyValue',
                    culture,
                    feature,
                    key,
                    message: `Empty or null translation value for key: ${key}`,
                    severity: 'High'
                });
            } else if (typeof value === 'string') {
                // Check placeholder consistency
                const currentPlaceholders = getPlaceholders(value);
                
                if (referencePlaceholders[key]) {
                    const refPlaceholders = referencePlaceholders[key];
                    
                    // Check for missing placeholders
                    const missingPlaceholders = refPlaceholders.filter(p => !currentPlaceholders.includes(p));
                    if (missingPlaceholders.length > 0) {
                        issues.push({
                            type: 'MissingPlaceholder',
                            culture,
                            feature,
                            key,
                            message: `Missing placeholders in translation: ${missingPlaceholders.join(', ')}`,
                            severity: 'Critical',
                            details: {
                                expected: refPlaceholders,
                                actual: currentPlaceholders
                            }
                        });
                    }
                    
                    // Check for extra placeholders
                    const extraPlaceholders = currentPlaceholders.filter(p => !refPlaceholders.includes(p));
                    if (extraPlaceholders.length > 0) {
                        issues.push({
                            type: 'ExtraPlaceholder',
                            culture,
                            feature,
                            key,
                            message: `Extra placeholders in translation: ${extraPlaceholders.join(', ')}`,
                            severity: 'Medium',
                            details: {
                                expected: refPlaceholders,
                                actual: currentPlaceholders
                            }
                        });
                    }
                }
            }
        }
        
    } catch (error) {
        issues.push({
            type: 'ParseError',
            culture,
            feature,
            message: `Failed to parse JSON file: ${error.message}`,
            severity: 'Critical'
        });
    }
    
    return issues;
}

/**
 * Recursively finds all feature directories containing translation files
 */
function getFeatureDirectories(basePath) {
    const features = [];
    
    function traverse(dir, relativePath = '') {
        if (!fs.existsSync(dir)) return;
        
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        // Check if this directory contains the reference culture file
        const hasReferenceFile = entries.some(entry => 
            entry.isFile() && entry.name === `${REFERENCE_CULTURE}.json`
        );
        
        if (hasReferenceFile) {
            features.push({
                name: relativePath.replace(/[/\\]/g, '.') || 'root',
                path: dir,
                relativePath
            });
        }
        
        // Recursively traverse subdirectories
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const subPath = path.join(dir, entry.name);
                const subRelative = relativePath ? `${relativePath}/${entry.name}` : entry.name;
                traverse(subPath, subRelative);
            }
        }
    }
    
    traverse(basePath);
    return features;
}

/**
 * Formats output for console display
 */
function formatConsoleOutput(results) {
    const colors = {
        reset: '\x1b[0m',
        cyan: '\x1b[36m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        red: '\x1b[31m',
        gray: '\x1b[90m',
        white: '\x1b[37m'
    };
    
    console.log(`\n${colors.cyan}========================================`);
    console.log(`  Translation Validation Report`);
    console.log(`========================================${colors.reset}\n`);
    
    console.log(`${colors.white}Total Features Validated: ${results.totalFeatures}`);
    console.log(`Total Translation Keys: ${results.totalKeys}`);
    console.log(`Total Issues Found: ${results.issues.length}${colors.reset}\n`);
    
    if (results.issues.length === 0) {
        console.log(`${colors.green}✓ All translations are valid and complete!${colors.reset}`);
        return;
    }
    
    // Group issues by severity
    const critical = results.issues.filter(i => i.severity === 'Critical');
    const high = results.issues.filter(i => i.severity === 'High');
    const medium = results.issues.filter(i => i.severity === 'Medium');
    const low = results.issues.filter(i => i.severity === 'Low');
    
    console.log(`${colors.white}Issues by Severity:`);
    console.log(`  ${colors.red}Critical: ${critical.length}`);
    console.log(`  ${colors.red}High: ${high.length}`);
    console.log(`  ${colors.yellow}Medium: ${medium.length}`);
    console.log(`  ${colors.gray}Low: ${low.length}${colors.reset}\n`);
    
    // Group issues by type
    const issuesByType = {};
    results.issues.forEach(issue => {
        issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
    });
    
    console.log(`${colors.white}Issues by Type:`);
    Object.entries(issuesByType).forEach(([type, count]) => {
        console.log(`  ${colors.cyan}${type}: ${count}`);
    });
    console.log(colors.reset);
    
    console.log(`${colors.gray}----------------------------------------`);
    console.log(`${colors.white}Detailed Issues:`);
    console.log(`${colors.gray}----------------------------------------${colors.reset}\n`);
    
    // Display critical issues
    if (critical.length > 0) {
        console.log(`${colors.red}CRITICAL ISSUES:${colors.reset}`);
        critical.forEach(issue => {
            console.log(`  ${colors.red}[${issue.culture}] ${issue.feature}`);
            console.log(`    Type: ${issue.type}`);
            if (issue.key) console.log(`    Key: ${issue.key}`);
            console.log(`    Message: ${issue.message}${colors.reset}\n`);
        });
    }
    
    // Display high severity issues
    if (high.length > 0) {
        console.log(`${colors.red}HIGH SEVERITY ISSUES:${colors.reset}`);
        high.forEach(issue => {
            console.log(`  ${colors.red}[${issue.culture}] ${issue.feature}`);
            console.log(`    Type: ${issue.type}`);
            if (issue.key) console.log(`    Key: ${issue.key}`);
            console.log(`    Message: ${issue.message}${colors.reset}\n`);
        });
    }
    
    // Display medium severity issues (limited to first 10)
    if (medium.length > 0) {
        console.log(`${colors.yellow}MEDIUM SEVERITY ISSUES (showing first 10):${colors.reset}`);
        const displayCount = Math.min(10, medium.length);
        for (let i = 0; i < displayCount; i++) {
            const issue = medium[i];
            console.log(`  ${colors.yellow}[${issue.culture}] ${issue.feature}`);
            console.log(`    Type: ${issue.type}`);
            if (issue.key) console.log(`    Key: ${issue.key}`);
            console.log(`    Message: ${issue.message}${colors.reset}\n`);
        }
        if (medium.length > 10) {
            console.log(`  ${colors.yellow}... and ${medium.length - 10} more medium severity issues${colors.reset}\n`);
        }
    }
    
    console.log(`${colors.cyan}========================================${colors.reset}\n`);
}

/**
 * Exports results as JSON
 */
function exportJsonReport(results, outputPath) {
    const filename = outputPath || `translation-validation-report-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(results, null, 2), 'utf8');
    console.log(`JSON report saved to: ${filename}`);
}

/**
 * Exports results as HTML
 */
function exportHtmlReport(results, outputPath) {
    const filename = outputPath || `translation-validation-report-${Date.now()}.html`;
    
    const critical = results.issues.filter(i => i.severity === 'Critical');
    const high = results.issues.filter(i => i.severity === 'High');
    const medium = results.issues.filter(i => i.severity === 'Medium');
    const low = results.issues.filter(i => i.severity === 'Low');
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Translation Validation Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .summary-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
        .summary-card h3 { margin: 0 0 10px 0; font-size: 14px; opacity: 0.9; }
        .summary-card .value { font-size: 32px; font-weight: bold; }
        .severity-critical { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .severity-high { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
        .severity-medium { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; }
        .severity-low { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; }
        .issues { margin-top: 30px; }
        .issue { background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .issue.critical { border-left-color: #dc3545; }
        .issue.high { border-left-color: #fd7e14; }
        .issue.medium { border-left-color: #ffc107; }
        .issue.low { border-left-color: #6c757d; }
        .issue-header { font-weight: bold; color: #333; margin-bottom: 5px; }
        .issue-detail { color: #666; font-size: 14px; margin: 5px 0; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }
        .badge-critical { background-color: #dc3545; color: white; }
        .badge-high { background-color: #fd7e14; color: white; }
        .badge-medium { background-color: #ffc107; color: #333; }
        .badge-low { background-color: #6c757d; color: white; }
        .success { color: #28a745; font-size: 18px; font-weight: bold; text-align: center; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Translation Validation Report</h1>
        <p>Generated: ${new Date(results.timestamp).toLocaleString()}</p>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Total Features</h3>
                <div class="value">${results.totalFeatures}</div>
            </div>
            <div class="summary-card">
                <h3>Total Keys</h3>
                <div class="value">${results.totalKeys}</div>
            </div>
            <div class="summary-card">
                <h3>Total Issues</h3>
                <div class="value">${results.issues.length}</div>
            </div>
        </div>
        
        ${results.issues.length === 0 ? 
            '<div class="success">✓ All translations are valid and complete!</div>' :
            `<div class="summary">
                <div class="summary-card severity-critical">
                    <h3>Critical Issues</h3>
                    <div class="value">${critical.length}</div>
                </div>
                <div class="summary-card severity-high">
                    <h3>High Severity</h3>
                    <div class="value">${high.length}</div>
                </div>
                <div class="summary-card severity-medium">
                    <h3>Medium Severity</h3>
                    <div class="value">${medium.length}</div>
                </div>
                <div class="summary-card severity-low">
                    <h3>Low Severity</h3>
                    <div class="value">${low.length}</div>
                </div>
            </div>
            
            <div class="issues">
                <h2>Detailed Issues</h2>
                ${results.issues.map(issue => `
                    <div class="issue ${issue.severity.toLowerCase()}">
                        <div class="issue-header">
                            <span class="badge badge-${issue.severity.toLowerCase()}">${issue.severity}</span>
                            [${issue.culture}] ${issue.feature}
                        </div>
                        <div class="issue-detail"><strong>Type:</strong> ${issue.type}</div>
                        ${issue.key ? `<div class="issue-detail"><strong>Key:</strong> ${issue.key}</div>` : ''}
                        <div class="issue-detail"><strong>Message:</strong> ${issue.message}</div>
                    </div>
                `).join('')}
            </div>`
        }
    </div>
</body>
</html>`;
    
    fs.writeFileSync(filename, html, 'utf8');
    console.log(`HTML report saved to: ${filename}`);
}

// Main execution
console.log('Starting translation validation...');
console.log(`Resource Path: ${RESOURCE_PATH}`);
console.log(`Reference Culture: ${REFERENCE_CULTURE}`);
console.log(`Supported Cultures: ${SUPPORTED_CULTURES.join(', ')}\n`);

// Check if resource path exists
if (!fs.existsSync(RESOURCE_PATH)) {
    console.error(`Error: Resource path not found: ${RESOURCE_PATH}`);
    process.exit(1);
}

// Get all feature directories
const features = getFeatureDirectories(RESOURCE_PATH);
validationResults.totalFeatures = features.length;

console.log(`Found ${features.length} features to validate\n`);

// Process each feature
for (const feature of features) {
    console.log(`Validating feature: ${feature.name}`);
    
    // Load reference culture first
    const referenceFile = path.join(feature.path, `${REFERENCE_CULTURE}.json`);
    
    if (!fs.existsSync(referenceFile)) {
        validationResults.issues.push({
            type: 'MissingReferenceFile',
            culture: REFERENCE_CULTURE,
            feature: feature.name,
            message: `Reference culture file not found: ${referenceFile}`,
            severity: 'Critical'
        });
        continue;
    }
    
    // Load reference keys and placeholders
    const referenceContent = fs.readFileSync(referenceFile, 'utf8');
    const referenceJson = JSON.parse(referenceContent);
    const referenceKeys = getTranslationKeys(referenceJson);
    validationResults.totalKeys += referenceKeys.length;
    
    // Build reference placeholders map
    const referencePlaceholders = {};
    for (const key of referenceKeys) {
        const value = getTranslationValue(referenceJson, key);
        if (value && typeof value === 'string') {
            const placeholders = getPlaceholders(value);
            if (placeholders.length > 0) {
                referencePlaceholders[key] = placeholders;
            }
        }
    }
    
    const referenceKeysSet = new Set(referenceKeys);
    
    // Validate each supported culture
    for (const culture of SUPPORTED_CULTURES) {
        if (culture === REFERENCE_CULTURE) {
            continue; // Skip reference culture
        }
        
        const cultureFile = path.join(feature.path, `${culture}.json`);
        const issues = testTranslationFile(cultureFile, culture, feature.name, referenceKeysSet, referencePlaceholders);
        
        if (issues.length > 0) {
            validationResults.issues.push(...issues);
        }
    }
}

// Generate output based on format
switch (OUTPUT_FORMAT.toLowerCase()) {
    case 'json':
        exportJsonReport(validationResults, OUTPUT_PATH);
        formatConsoleOutput(validationResults);
        break;
    case 'html':
        exportHtmlReport(validationResults, OUTPUT_PATH);
        formatConsoleOutput(validationResults);
        break;
    default:
        formatConsoleOutput(validationResults);
}

// Exit with appropriate code
if (validationResults.issues.length === 0) {
    process.exit(0);
} else {
    const criticalCount = validationResults.issues.filter(i => i.severity === 'Critical').length;
    process.exit(criticalCount > 0 ? 2 : 1);
}
