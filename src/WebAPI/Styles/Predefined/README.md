# Predefined Styles

This directory contains predefined style templates that can be applied to the application. Each style is defined in a JSON file with variables and component definitions.

## Available Styles

### 1. Microsoft Fluent (`microsoft-fluent.json`)
- **Category**: Corporate
- **Description**: Modern Microsoft Fluent Design System with clean lines and subtle shadows
- **Primary Color**: #0078d4 (Microsoft Blue)
- **Font**: Segoe UI
- **Best For**: Corporate applications, professional dashboards

### 2. Material Design (`material-design.json`)
- **Category**: Modern
- **Description**: Google's Material Design system with bold colors and elevation
- **Primary Color**: #1976d2 (Material Blue)
- **Font**: Roboto
- **Best For**: Modern web applications, mobile-first designs

### 3. Apple Human Interface (`apple-human-interface.json`)
- **Category**: Minimal
- **Description**: Clean and minimal design inspired by Apple's Human Interface Guidelines
- **Primary Color**: #007aff (iOS Blue)
- **Font**: -apple-system, BlinkMacSystemFont
- **Best For**: Minimal interfaces, iOS-style applications

### 4. Ant Design (`ant-design.json`)
- **Category**: Enterprise
- **Description**: Enterprise-class UI design language with refined details
- **Primary Color**: #1890ff (Ant Blue)
- **Font**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Best For**: Enterprise applications, admin panels, data-heavy interfaces

### 5. Bootstrap Modern (`bootstrap-modern.json`)
- **Category**: Classic
- **Description**: Modern interpretation of Bootstrap with updated colors and spacing
- **Primary Color**: #0d6efd (Bootstrap Blue)
- **Font**: system-ui, -apple-system, 'Segoe UI', Roboto
- **Best For**: Traditional web applications, rapid prototyping

## Style Structure

Each style JSON file contains:

```json
{
  "name": "Style Name",
  "description": "Style description",
  "version": "1.0.0",
  "category": "Category",
  "variables": {
    // CSS custom properties
    "primary-color": "#color",
    "font-family-primary": "font-stack",
    // ... more variables
  },
  "components": {
    // Component-specific styles
    "button": {
      "primary": {
        "background": "var(--primary-color)",
        // ... more properties
      }
    }
  }
}
```

## API Endpoints

### Get All Predefined Styles
```
GET /api/v2.0/styles-api/predefined
```

### Get Specific Style
```
GET /api/v2.0/styles-api/predefined/{styleName}
```

### Get Compiled CSS
```
GET /api/v2.0/styles-api/predefined/{styleName}/css
```

### Get Style Preview
```
GET /api/v2.0/styles-api/preview/{styleName}
```

## Usage in Frontend

### React/TypeScript Example
```typescript
// Fetch available styles
const styles = await fetch('/api/v2.0/styles-api/predefined').then(r => r.json());

// Apply a style
const applyStyle = async (styleName: string) => {
  const response = await fetch(`/api/v2.0/styles-api/predefined/${styleName}/css`);
  const css = await response.text();
  
  // Inject CSS into document
  const styleElement = document.createElement('style');
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
};
```

### Angular Example
```typescript
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StyleService {
  constructor(private http: HttpClient) {}
  
  getAvailableStyles() {
    return this.http.get('/api/v2.0/styles-api/predefined');
  }
  
  applyStyle(styleName: string) {
    return this.http.get(`/api/v2.0/styles-api/predefined/${styleName}/css`, 
      { responseType: 'text' });
  }
}
```

## Adding New Styles

1. Create a new JSON file in this directory
2. Follow the structure shown above
3. Include all required variables and components
4. Test the style using the preview endpoint
5. The style will be automatically available through the API

## Variable Categories

### Colors
- `primary-color`, `secondary-color`, `accent-color`
- `success-color`, `warning-color`, `error-color`, `info-color`
- `background-*`, `surface-*`, `text-*`, `border-*`

### Typography
- `font-family-*`, `font-size-*`, `font-weight-*`

### Spacing
- `spacing-*` (xs, sm, md, lg, xl, 2xl, 3xl)

### Effects
- `shadow-*`, `border-radius-*`, `transition-*`

## Component Categories

### Form Elements
- `button`, `input`, `select`, `textarea`

### Layout
- `card`, `modal`, `sidebar`, `header`

### Navigation
- `navbar`, `breadcrumb`, `pagination`, `tabs`

### Feedback
- `alert`, `toast`, `tooltip`, `loading`