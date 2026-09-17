package com.edunova.domain;

public enum VerificationStatus {
    VERIFIED,             // Confirmed active for current 2026-27 cycle
    ACTIVE,               // Running programme — details confirmed
    NEEDS_VERIFICATION,   // Exists but details not yet confirmed
    VERIFY_CURRENT_CYCLE, // Exists but 2026-27 slab/amount needs official check
    EXPIRED_CLOSED,       // Programme ended
    DEMO_DATA             // Placeholder / mock
}
