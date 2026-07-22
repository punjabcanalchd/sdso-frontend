import { InjectionToken } from '@angular/core';
import { SecurityFeature } from './security.types';

/**
 * SECURITY FEATURES REGISTRY TOKEN
 * ----------------------------------------------------
 * Allows application to register multiple security
 * features dynamically (Captcha, Device Check, IP Policy etc.)
 */
export const SECURITY_FEATURES =
  new InjectionToken<SecurityFeature[]>('SECURITY_FEATURES');


/**
 * SECURITY FEATURE ORCHESTRATOR TOKEN
 * ----------------------------------------------------
 * Allows dependency injection of orchestrator
 * without hard-coupling implementation
 */
export const SECURITY_ORCHESTRATOR =
  new InjectionToken<any>('SECURITY_ORCHESTRATOR');

