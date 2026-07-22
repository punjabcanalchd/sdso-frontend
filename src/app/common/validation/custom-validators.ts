import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PATTERNS } from './patterns';

/**
 * CustomValidators
 * ------------------------------------------------------------------
 * Angular-side equivalent of FastAPI Pydantic validators.
 * - Uses shared PATTERNS
 * - Returns `validationMessage` (used by DynamicForm)
 * - No UI logic here
 */
export class CustomValidators {

  /* ------------------------------------------------------------------
   * CAPTCHA
   * ---------------------------------------------------------------- */
  static captcha(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = String(control.value);

      const valid =
        PATTERNS.CAPTCHA.test(value) &&
        value.length >= 5 &&
        value.length <= 6;

      return valid
        ? null
        : { validationMessage: 'Enter the characters exactly as shown.' };
    };
  }

  /* ------------------------------------------------------------------
   * TEXT
   * ---------------------------------------------------------------- */
  static shortAlpha(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.ALPHA,
      'Only letters are allowed (2–50 characters).',
      2,
      50
    );
  }

  static mediumAlpha(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.ALPHA,
      'Only letters are allowed (2–100 characters).',
      2,
      100
    );
  }

  static longAlpha(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.ALPHA,
      'Only letters are allowed (up to 255 characters).',
      2,
      255
    );
  }
  static textContent(): ValidatorFn {
  return CustomValidators.regex(
    PATTERNS.ALPHA_NUM_SPECIAL,
    'Letters, numbers, spaces, and symbols (\'"()_.,) are allowed.',
    2,
    255
  );
}

static menuTitle(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.BILINGUAL_MENU_TITLE, 
      'Only letters, numbers, and symbols(/ , () - . &) are allowed (max 100 chars).',
      1,
      100
    );
  }

  static alphaNum(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.ALPHA_NUM,
      'Only letters and numbers are allowed.',
      2,
      50
    );
  }

  static alphaNumDash(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.ALPHA_NUM_DASH,
      'Only letters, numbers, and hyphens are allowed.',
      2,
      100
    );
  }

  static slug(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.SLUG,
      'Use lowercase letters, numbers, and hyphens only.',
      3,
      100
    );
  }

  /* ------------------------------------------------------------------
   * IDENTIFIERS
   * ---------------------------------------------------------------- */
  static uuid(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.UUID,
      'Invalid identifier.'
    );
  }

  static code(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.ALPHA_NUM_UNDERSCORE,
      'Only letters, numbers, and underscores are allowed.',
      2,
      30
    );
  }

  /* ------------------------------------------------------------------
   * NUMBERS
   * ---------------------------------------------------------------- */
 static numDash(): ValidatorFn {
  return CustomValidators.regex(
    PATTERNS.NUM_DASH,
    'Year must be in format YYYY-YY (e.g. 1980-81)'
  );
}

 static yearPattern(): ValidatorFn {
  return CustomValidators.regex(
    PATTERNS.ALPHANUM_DASH_BRACKETS,
    'this string accepts 0-9, -, (), a-z'
  );
}

  static digitsOnly(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.DIGITS_ONLY,
      'Only digits are allowed.'
    );
  }

  static positiveInt(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.POSITIVE_INT,
      'Enter a positive number.'
    );
  }
  
  static nonNegative(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;

    // allow empty (required handled elsewhere)
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const num = Number(value);

    // block negatives
    if (isNaN(num) || num < 0) {
      return { nonNegative: 'Negative values are not allowed' };
    }

    return null;
  };
}


  static decimal2(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.DECIMAL_2,
      'Enter a valid number (up to 2 decimal places).'
    );
  }

  /* ------------------------------------------------------------------
   * CONTACT
   * ---------------------------------------------------------------- */
  static phone10(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.PHONE_10,
      'Enter a valid 10-digit mobile number.',
      10,
      10
    );
  }

  static e164Phone(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.E164_PHONE,
      'Enter a valid international phone number.'
    );
  }

  /* ------------------------------------------------------------------
   * CHECKBOX
   * ---------------------------------------------------------------- */
  static requiredTrue(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === true) return null;

      return {
        validationMessage: 'You must accept this before continuing.'
      };
    };
  }

  /* ------------------------------------------------------------------
   * RADIO BUTTON
   * ---------------------------------------------------------------- */
  static requiredSelection(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value !== null && control.value !== undefined && control.value !== '') {
        return null;
      }

      return { validationMessage: 'Please select an option.' };
    };
  }

  /* ------------------------------------------------------------------
   * DATEPICKER
   * ---------------------------------------------------------------- */

  // VALID DATE
  static validDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const date = new Date(control.value);
      return isNaN(date.getTime())
        ? { validationMessage: 'Enter a valid date.' }
        : null;
    };
  }

  // DATE MUST BE TODAY OR FUTURE
  static dateInFuture(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const date = new Date(control.value);
      if (isNaN(date.getTime())) {
        return { validationMessage: 'Enter a valid date.' };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date >= today
        ? null
        : { validationMessage: 'Date must not be in the past.' };
    };
  }

  // DATE RANGE
  static dateBetween(min: Date, max: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const date = new Date(control.value);
      if (isNaN(date.getTime())) {
        return { validationMessage: 'Enter a valid date.' };
      }

      if (date < min || date > max) {
        return {
          validationMessage: `Date must be between ${min.toDateString()} and ${max.toDateString()}.`
        };
      }

      return null;
    };
  }


  /* ------------------------------------------------------------------
   * SECURITY
   * ---------------------------------------------------------------- */
  static password(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = String(control.value);

      const valid =
        value.length >= 8 &&
        value.length <= 50 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /\d/.test(value) &&
        /[@$!%*?&]/.test(value);

      return valid
        ? null
        : {
            validationMessage:
              'Password must be 8–50 characters and include uppercase, lowercase, number, and special character.'
          };
    };
  }

    // Confirm Password Validator
  static matchPassword(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.parent) return null;

      const matchingControl = control.parent.get(matchTo);

      if (!matchingControl) return null;

      const isMatch = control.value === matchingControl.value;

      return isMatch
        ? null
        : { validationMessage: 'Passwords do not match' };
    };
  }


  static otp(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.OTP,
      'Enter a valid OTP.'
    );
  }

  /* ------------------------------------------------------------------
   * WEB
   * ---------------------------------------------------------------- */
  static urlSafe(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.URL_SAFE,
      'Enter a valid URL.',
      5,
      2048
    );
  }

  /* ------------------------------------------------------------------
   * EMAIL
   * ---------------------------------------------------------------- */

  static email(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.EMAIL,
      'Enter a valid email address.',
      5,
      255
    );
  }

  /* ------------------------------------------------------------------
  * FILE UPLOAD (UX-ONLY VALIDATION)
  * ---------------------------------------------------------------- */

  static fileRequired(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // valid if a File exists
    if (value instanceof File) {
      return null;
    }

    return {
      validationMessage: 'Please select a file.'
    };
  };
}

// For KB Validation
static fileMaxSizeKB(maxKB: number): ValidatorFn {
  const maxBytes = maxKB * 1024;

  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;

    if (!(file instanceof File)) {
      return null;
    }

    return file.size <= maxBytes
      ? null
      : {
          validationMessage: `File size must not exceed ${maxKB} KB.`
        };
  };
}

// For MB Validation
  static fileMaxSizeMB(maxMB: number): ValidatorFn {
    const maxBytes = maxMB * 1024 * 1024;

    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (!(file instanceof File)) return null;

      return file.size <= maxBytes
        ? null
        : {
            validationMessage: `File size must not exceed ${maxMB} MB.`
          };
    };
  }

  static fileTypes(allowedExtensions: string[]): ValidatorFn {

  const allowed = allowedExtensions.map(e => e.toLowerCase());

  return (control: AbstractControl): ValidationErrors | null => {

    const file = control.value;

    if (!(file instanceof File)) {
      return null;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!ext || !allowed.includes(ext)) {
      return {
        validationMessage: `Allowed file types: ${allowed.join(', ')}`
      };
    }

    return null;
  };
}
// static fileTypes(allowedExtensions: string[]): ValidatorFn {

//   const allowed = allowedExtensions.map(
//     e => e.toLowerCase()
//   );

//   return (
//     control: AbstractControl
//   ): ValidationErrors | null => {

//     const file = control.value;

//     if (!(file instanceof File)) {
//       return null;
//     }

//     const ext = file.name
//       .split('.')
//       .pop()
//       ?.toLowerCase();

//     if (!ext || !allowed.includes(ext)) {

//       return {
//         validationMessage:
//           `Allowed file types: ${allowed.join(', ')}`
//       };

//     }

//     return null;

//   };

// }
  /* ------------------------------------------------------------------
   * UNIQUE FIELDS IN SCHEMA BUILDER
   * ---------------------------------------------------------------- */
  static unique(existingNames: string[]): any {
    return (control: any) => {
      if (!control.value) return null;
      const isDuplicate = existingNames.some(
        (name) => name.toLowerCase() === control.value.toLowerCase()
      );
      return isDuplicate ? { duplicateName: true } : null;
    };
  }
  
  static pan(): ValidatorFn {
      return CustomValidators.regex(
        PATTERNS.PAN,
        'Enter valid PAN number (Example: ABCDE1234F).'
      );
  }

  static drivingLicense(): ValidatorFn {
    return CustomValidators.regex(
      PATTERNS.DRIVING_LICENSE,
       'Enter valid Driving License number (Example: DL1420110012345 or DL-01-2009-1234567).'
    );

  }

  static gst(): ValidatorFn {
      return CustomValidators.regex(
        PATTERNS.GST,
        'Enter a valid 15-character GST number.'
      );
  }

static idProofValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.trim();
    const proofType = control.parent?.get('idProof')?.value;
    
    if (!value) {
      return null;
    }

    // PAN - Maximum 10 characters
    if (proofType === 'PAN' || proofType === '1' ) {
      if (value.length > 10) {
        return {
          validationMessage: 'PAN number cannot exceed 10 characters.'
        };
      }

      if (!PATTERNS.PAN.test(value)) {
        return {
          validationMessage:
            'Enter a valid PAN number (Example: ABCDE1234F).'
        };
      }
    }

    // Driving License - Maximum 15 characters
    if (proofType === 'DL' || proofType === '3' ) {
      if (value.length > 15) {
        return {
          validationMessage:
            'Driving License number cannot exceed 15 characters.'
        };
      }

      if (!PATTERNS.DRIVING_LICENSE.test(value)) {
        return {
          validationMessage:
            'Enter a valid Driving License number (Example: DL1420110012345 or DL-01-2009-1234567).'
        };
      }
    }

    return null;
  };
}


// view only last 4 digit and hide all digit 
static maskIdProof(value: string): string {
    if (!value) {
      return '';
    }

    let visible = 4;
    let result = '';

    for (let i = value.length - 1; i >= 0; i--) {
      const char = value[i];

      if (char === '-') {
        result = char + result;
      } else if (visible > 0) {
        result = char + result;
        visible--;
      } else {
        result = 'X' + result;
      }
    }

    return result;
}
  /* ------------------------------------------------------------------
   * INTERNAL HELPER (DO NOT USE DIRECTLY)
   * ---------------------------------------------------------------- */
  private static regex(
    pattern: RegExp,
    message: string,
    minLength?: number,
    maxLength?: number
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = String(control.value);

      if (minLength && value.length < minLength) {
        return { validationMessage: message };
      }

      if (maxLength && value.length > maxLength) {
        return { validationMessage: message };
      }

      if (!pattern.test(value)) {
        return { validationMessage: message };
      }

      return null;
    };
  }


 /* ------------------------------------------------------------------
   * Check Suspicious File Validation 
   * ---------------------------------------------------------------- */


static suspiciousFileUpload(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const file = control.value as File;

    if (!file) {
      return null;
    }

    const fileName = file.name.toLowerCase();

    const blockedExtensions = [
      'exe', 'bat', 'cmd', 'com', 'msi',
      'js', 'vbs', 'ps1', 'sh',
      'php', 'jsp', 'asp', 'aspx', 'jar'
    ];

    const extension = fileName.split('.').pop() || '';

    if (blockedExtensions.includes(extension)) {

          return {
          validationMessage: 'Executable or script files are not allowed.'
          };
      // return {
        
        // suspiciousFile: {
        //   message: 'Executable or script files are not allowed.'
        // }
      // };
    }

    // Reject files like document.pdf.exe
    const parts = fileName.split('.');
    if (parts.length > 2) {
      // return {
      //   suspiciousFile: {
      //     message: 'Files with multiple extensions are not allowed.'
      //   }
      // };

          return {
          validationMessage: 'Files with multiple extensions are not allowed.'
          };
    }

    // Invalid filename characters
    if (/[<>:"/\\|?*\x00-\x1F]/.test(fileName)) {
      return {
          validationMessage: 'The file name contains invalid characters.'

        // suspiciousFile: {
        //   message: 'The file name contains invalid characters.'
        // }
      };
    }

    return null;
  };
}






}
