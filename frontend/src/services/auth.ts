/**
 * Auth Service - Canonical Entry Point
 * 
 * This is the stable import path for all auth functionality.
 * Re-exports from the feature-based auth service.
 * 
 * Usage:
 *   import { loginUser, getCurrentUserInfo } from "@/services/auth";
 */

export * from "@/features/auth/services/auth.service";

