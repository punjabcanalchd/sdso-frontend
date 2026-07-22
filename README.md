# PWRDA Portal Frontend

New generation PWRDA portal frontend built using Angular with modular architecture and Laravel API backend support.

---

# Tech Stack

- Angular
- Angular Material
- SCSS
- RxJS
- REST API
- Laravel Backend API

---

# Prerequisites

| Software | Recommended Version |
|----------|---------------------|
| Node.js | 22 LTS |
| npm | Latest |
| Angular CLI | Latest |
| Git | Latest |

---

# Install Angular CLI

```bash
npm install -g @angular/cli
```

Verify installation:

```bash
ng version
```

---

# Create Project

```bash
ng new pwrda-portal
```

Recommended options:

```text
? Would you like to add Angular routing? → Yes
? Which stylesheet format would you like to use? → SCSS
```


---
  <!-- Dynamic form Pattern -->  

  /** create Login form schema */
  loginSchema: FormSchema = {
    logoUrl: 'assets/images/sugarfedlogo.png',
    layoutStyle: 'minimal',   
    submitLabel: 'Log In',
    submitIcon: 'bi bi-box-arrow-in-right',
    captcha: { enabled: true },
    forgotPassword: {
    enabled: true,
    text: 'Forgot Password?',
    route: '/forgot-password'
  },
    fields: [      
      { name: 'email',
        label: 'Username or Email', 
        type: 'email',
        icon: 'bi bi-person',         
        placeholder: 'Enter username or email', 
        required: true,        
        validationMessages: {
          required: 'Please enter your email address',
          email: 'Please enter a valid email address'
        },
        validators: [CustomValidators.email()],
        updateOn: 'change'},

      { name: 'password', label: 'Password',    placeholder: 'Enter password',   icon: 'bi bi-lock', required: true, type: 'password', validators: [CustomValidators.password()], updateOn: 'change' },
      { name: 'captcha_input', label: 'Captcha', type: 'captcha', validators: [CustomValidators.captcha()],required: true, updateOn: 'change'},
     
     
       { name: 'Name', label: 'Name', type: 'text', validators: [CustomValidators.shortAlpha()], updateOn: 'change'  },
      { name: 'mobile', label: 'Mobile Number', type: 'text', validators: [CustomValidators.phone10()], updateOn: 'change'  },

       { name: 'hobbies', label: 'Hobbies', type: 'checkbox', text:'Cricket', validators: [CustomValidators.requiredTrue()], updateOn: 'change' },
      { name: 'Country', label: 'Country', type: 'radio', options: [{ label: 'India', value: 'IN' },{label: 'USA', value: 'US' },{ label: 'UK', value: 'UK' }], validators: [CustomValidators.requiredSelection()], updateOn: 'change' },
       { name: 'user', label: 'User', type: 'select', placeholder: 'Select user type', options: [{ label: 'User', value: 'user' },{ label: 'Admin', value: 'admin' },], validators: [CustomValidators.requiredSelection()], updateOn: 'change'},
       { name: 'dob', label: 'Date of Birth', type: 'datepicker', validators:[CustomValidators.dateBetween(new Date('2000-02-01'), new Date())], updateOn: 'change' },
      { name: 'volume', label: 'Volume', type: 'slider', min: 0, max: 100, step: 5, validators: [], updateOn: 'change' },
     { name: 'rememberMe', label: 'Remember Me', type: 'toggle', validators: [], updateOn: 'change' },
      { name: 'profilePic', label: 'Upload Profile Picture', type: 'file', validators: [CustomValidators.fileMaxSize(2), CustomValidators.fileTypes(['jpg', 'jpeg', 'png']), CustomValidators.fileRequired()], updateOn: 'change'},
       { name: 'priceRange', label: 'Price Range', type: 'range', min: 10, max: 100, validators: [], updateOn: 'change' },
       { name: 'volume', label: 'Volume Range', type: 'range', min: 50, max: 90, step: 5, required: false, updateOn: 'change'},
    ],
  footerText: 'Your credentials are protected using encryption and HTTPS.'
  };

 Add this dynamic form tag into html 

    <app-dynamic-form   
      [schema]="loginSchema"
      (submitForm)="onSubmit($event)">
    </app-dynamic-form>      
    
      

---



---

# Move Into Project

```bash
cd pwrda-portal
```

---

# Run Development Server

```bash
ng serve
```

Application URL:

```text
http://localhost:4200
```

---

# Install Angular Material

```bash
ng add @angular/material
```

Recommended setup:

```text
Theme → Indigo/Pink
Typography → Yes
Animations → Yes
```

---

# Create Modules

```bash
ng g module modules/auth --routing
ng g module modules/applicant --routing
ng g module modules/officers --routing 
ng g module modules/admin --routing
ng g module modules/reports --routing
ng g module modules/website --routing
```

---

# Create Core Module

```bash
ng g module core
```

---

# Create Shared Module

```bash
ng g module shared
```

---

# Create Layout Components

```bash
ng g component layouts/admin-layout
ng g component layouts/applicant-layout
ng g component layouts/website-layout
```

---

# Create Services

## API Service

```bash
ng g service core/services/api
```

---

# Create Interceptors

## Auth Interceptor

```bash
ng g interceptor interceptors/auth
```

---

# Create Guards

## Auth Guard

```bash
ng g guard guards/auth
```

---

# Install Additional Packages

## Bootstrap

```bash
npm install bootstrap
```

## Bootstrap Icons

```bash
npm install bootstrap-icons
```

# Create Pop-ups
```bash
npm install sweetalert2 @sweetalert2/ngx-sweetalert2
```


## Charts

```bash
npm install ng-apexcharts apexcharts
```

## Permissions

```bash
npm install ngx-permissions
```

## JWT Decode

```bash
npm install jwt-decode
```

```bash
npm install @ng-bootstrap/ng-bootstrap@21.0.0-rc.0 --legacy-peer-deps
```


## @angular/animations

```bash
npm install @angular/animations@21.2.13
```
---

# Recommended Folder Structure

```text
src/app/
│
├── core/
├── shared/
├── layouts/
├── modules/
│   ├── auth/
│   ├── applicant/
│   ├── officers/
│   ├── admin/
│   ├── reports/
│   └── website/
│
├── guards/
├── interceptors/
├── services/
├── models/
├── constants/
├── enums/
├── directives/
├── pipes/
└── store/
```

---

# Proxy Configuration

Create:

```text
proxy.conf.json
```

Add:

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true
  }
}
```

Update package.json:

```json
"start": "ng serve --proxy-config proxy.conf.json"
```

Run application:

```bash
npm start
```

---

# Environment Configuration

Update:

```text
src/environments/environment.ts
```

Example:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1'
};
```

---

# Main Modules

```text
Auth
Applicant
Officers
Admin
Reports
Website
```

---

# Officer Roles

```text
RO
SO
AO
Accountant
Account Executive
Admin
Super Admin
```

Permissions should be controlled from backend APIs.

---

# Build For Production

```bash
ng build --configuration production
```

Generated build location:

```text
dist/pwrda-portal
```

---

# Backend Recommendation

Backend APIs should be developed using Laravel with:

- REST APIs
- JWT/Sanctum Authentication
- Modular Architecture

---

# Git Commands

## Initialize Repository

```bash
git init
```

## Add Files

```bash
git add .
```

## Commit Changes

```bash
git commit -m "Initial Angular project setup"
```

## Add Remote Repository

```bash
git remote add origin YOUR_GIT_REPOSITORY_URL
```

## Push Code

```bash
git push -u origin main
```

---

# Recommended Future Modules

```text
Workflow
Notifications
Payments
Master Data
GIS
Audit Logs
Helpdesk
Settings
```

---

# Development Guidelines

- Use Reactive Forms
- Use Lazy Loading
- Keep business logic in services
- Avoid heavy component logic
- Reuse shared components
- Use route guards for permissions
- Follow modular architecture

---

# Recommended Tech Stack

| Layer | Technology |
|------|-------------|
| Frontend | Angular |
| Backend API | Laravel |
| Mobile App | React Native |
| Database | PostgreSQL / MySQL |
| Cache | Redis |
| Queue | Laravel Queue |

---

# License

Internal PWRDA Project.
```typescripttypescripte
import { EncryptionService } from '../../../../core/services/encryption.service';

const encryptedPayload = this.encryptionService.encrypt('Pwrda@12342');
```


# Use of Environment Variables

```typescript
import { environment } from '../../../environments/environment';

private baseUrl = environment.apiUrl;
```

# Production Build
```bash
ng serve --configuration production
``` 


# Auth Guard Example

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/login/login.component')
      .then(m => m.LoginComponent)
  },

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  }
];
```


---
  <!-- Dynamic form Pattern -->  
  /** create Login form schema */
  loginSchema: FormSchema = {
    logoUrl: 'assets/images/sugarfedlogo.png',
    layoutStyle: 'minimal',   
    submitLabel: 'Log In',
    submitIcon: 'bi bi-box-arrow-in-right',
    captcha: { enabled: true },
    forgotPassword: {
    enabled: true,
    text: 'Forgot Password?',
    route: '/forgot-password'
  },
    fields: [      
      { name: 'email',
        label: 'Username or Email', 
        type: 'email',
        icon: 'bi bi-person',         
        placeholder: 'Enter username or email', 
        required: true,        
        validationMessages: {
          required: 'Please enter your email address',
          email: 'Please enter a valid email address'
        },
        validators: [CustomValidators.email()],
        updateOn: 'change'},

      { name: 'password', label: 'Password',    placeholder: 'Enter password',   icon: 'bi bi-lock', required: true, type: 'password', validators: [CustomValidators.password()], updateOn: 'change' },
      { name: 'captcha_input', label: 'Captcha', type: 'captcha', validators: [CustomValidators.captcha()],required: true, updateOn: 'change'},
     
     
       { name: 'Name', label: 'Name', type: 'text', validators: [CustomValidators.shortAlpha()], updateOn: 'change'  },
      { name: 'mobile', label: 'Mobile Number', type: 'text', validators: [CustomValidators.phone10()], updateOn: 'change'  },

       { name: 'hobbies', label: 'Hobbies', type: 'checkbox', text:'Cricket', validators: [CustomValidators.requiredTrue()], updateOn: 'change' },
      { name: 'Country', label: 'Country', type: 'radio', options: [{ label: 'India', value: 'IN' },{label: 'USA', value: 'US' },{ label: 'UK', value: 'UK' }], validators: [CustomValidators.requiredSelection()], updateOn: 'change' },
       { name: 'user', label: 'User', type: 'select', placeholder: 'Select user type', options: [{ label: 'User', value: 'user' },{ label: 'Admin', value: 'admin' },], validators: [CustomValidators.requiredSelection()], updateOn: 'change'},
       { name: 'dob', label: 'Date of Birth', type: 'datepicker', validators:[CustomValidators.dateBetween(new Date('2000-02-01'), new Date())], updateOn: 'change' },
      { name: 'volume', label: 'Volume', type: 'slider', min: 0, max: 100, step: 5, validators: [], updateOn: 'change' },
     { name: 'rememberMe', label: 'Remember Me', type: 'toggle', validators: [], updateOn: 'change' },
      { name: 'profilePic', label: 'Upload Profile Picture', type: 'file', validators: [CustomValidators.fileMaxSize(2), CustomValidators.fileTypes(['jpg', 'jpeg', 'png']), CustomValidators.fileRequired()], updateOn: 'change'},
       { name: 'priceRange', label: 'Price Range', type: 'range', min: 10, max: 100, validators: [], updateOn: 'change' },
       { name: 'volume', label: 'Volume Range', type: 'range', min: 50, max: 90, step: 5, required: false, updateOn: 'change'},
    ],
  footerText: 'Your credentials are protected using encryption and HTTPS.'
  };
---


---

# Move Into Project

```bash
cd pwrda-portal
```

---

# Run Development Server

```bash
ng serve
```

Application URL:

```text
http://localhost:4200
```

---

# Install Angular Package

```bash
ng add package_name
```

Recommended setup:

```text
Theme → Indigo/Pink
Typography → Yes
Animations → Yes
```

---

# Create Modules

```bash
ng g module modules/auth --routing
ng g module modules/applicant --routing
ng g module modules/officers --routing 
ng g module modules/admin --routing
ng g module modules/reports --routing
ng g module modules/website --routing
```

---

# Create Core Module

```bash
ng g module core
```

---

# Create Shared Module

```bash
ng g module shared
```

---

# Create Layout Components

```bash
ng g component layouts/admin-layout
ng g component layouts/applicant-layout
ng g component layouts/website-layout
```

---

# Create Services

## API Service

```bash
ng g service services/api
```

---

# Create Interceptors

## Auth Interceptor

```bash
ng g interceptor interceptors/auth
```

---

# Create Guards

## Auth Guard

```bash
ng g guard guards/auth
```

---

# Install Additional Packages

## Bootstrap

```bash
npm install bootstrap
```

## Bootstrap Icons

```bash
npm install bootstrap-icons
```


## Charts

```bash
npm install ng-apexcharts apexcharts
```

## Permissions

```bash
npm install ngx-permissions
```

## JWT Decode

```bash
npm install jwt-decode
```

## SweetAlert2

```bash
npm install sweetalert2
```

---

# Recommended Folder Structure

```text
src/app/
│
├── core/
├── shared/
├── layouts/
├── modules/
│   ├── auth/
│   ├── applicant/
│   ├── officers/
│   ├── admin/
│   ├── reports/
│   └── website/
│
├── guards/
├── interceptors/
├── services/
├── models/
├── constants/
├── enums/
├── directives/
├── pipes/
└── store/
```

---

# Proxy Configuration

Create:

```text
proxy.conf.json
```

Add:

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true
  }
}
```

Update package.json:

```json
"start": "ng serve --proxy-config proxy.conf.json"
```

Run application:

```bash
npm start
```

---

# Environment Configuration

Update:

```text
src/environments/environment.ts
```

Example:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1'
};
```

---

# Main Modules

```text
Auth
Applicant
Officers
Admin
Reports
Website
```

---

# Officer Roles

```text
RO
SO
AO
Accountant
Account Executive
Admin
Super Admin
```

Permissions should be controlled from backend APIs.

---

# Build For Production

```bash
ng build --configuration production
```

Generated build location:

```text
dist/pwrda-portal
```

---

# Git Commands

## Initialize Repository

```bash
git init
```

## Add Files

```bash
git add .
```

## Commit Changes

```bash
git commit -m "Initial Angular project setup"
```

## Add Remote Repository

```bash
git remote add origin https://github.com/pwrda/pwrda-frontend.git
```

## Push Code

```bash
git push -u origin master
```

##

```bash
npm install tinymce
```

---

# Recommended Future Modules

```text
Workflow
Notifications
Payments
Master Data
Fee Calculater
Audit Logs
Invest Punjab Workflow
Settings
```

---

# Development Guidelines

- Use Reactive Forms
- Use Lazy Loading
- Keep business logic in services
- Avoid heavy component logic
- Reuse shared components
- Use route guards for permissions
- Follow modular architecture

---


# Use Encryption Service

```typescripttypescripte
import { EncryptionService } from '../../../../services/encryption.service';

const encryptedPayload = this.encryptionService.encrypt({
  email: 'pwrda2022@gmail.com',
  password: 'Pwrda@12342'
});
```