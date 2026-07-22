/**
 * Centralized REGEX patterns
 * ------------------------------------------------------------------
 * This file mirrors backend (FastAPI) regex definitions.
 * It MUST contain ONLY regex — no Angular logic.
 */

export const PATTERNS = {
  /* ---------- TEXT ---------- */
  ALPHA: /^[A-Za-z\s]+$/,
  ALPHA_NO_SPACE: /^[A-Za-z]+$/,

  ALPHA_NUM: /^[A-Za-z0-9\s]+$/,
  ALPHA_NUM_DASH: /^[A-Za-z0-9\s\-]+$/,
  ALPHA_NUM_UNDERSCORE: /^[A-Za-z0-9_]+$/,

  ALPHA_NUM_SPECIAL: /^[A-Za-z0-9\s'"()_.,]+$/, 

  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  NUM_DASH: /^(19|20)\d{2}-\d{2}$/,


  /* ---------- IDENTIFIERS ---------- */
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  /* ---------- NUMBERS ---------- */
  DIGITS_ONLY: /^\d+$/,
  POSITIVE_INT: /^[1-9]\d*$/,
  DECIMAL_2: /^\d+(\.\d{1,2})?$/,
  ALPHANUM_DASH_BRACKETS: /^[A-Za-z0-9\-()\/\s]+$/,



  /* ---------- CONTACT ---------- */
  PHONE_10: /^[1-9][0-9]{9}$/,
  E164_PHONE: /^\+[1-9]\d{1,14}$/,

  /* ---------- SECURITY ---------- */
  OTP: /^\d{4,6}$/,

  /* ---------- WEB ---------- */
  URL_SAFE: /^[A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=%]+$/,

  /* ---------- CAPTCHA ---------- */
  CAPTCHA: /^[A-Za-z0-9]{5,6}$/,

  EMAIL: /^[a-zA-Z0-9_+-]+(?:\.[a-zA-Z0-9_+-]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+$/,


  /* ---------- GOVERNMENT IDS ---------- */

PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,

DRIVING_LICENSE: /^(DL[-\s]?\d{2}[-\s]?\d{4}[-\s]?\d{7}|DL\d{13})$/i, 

 GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,

/* ---------- MULTILINGUAL ---------- */
  BILINGUAL_MENU_TITLE: /^[\p{L}\p{M}\p{N}0-9\s\/-/,]+$/u,
};
