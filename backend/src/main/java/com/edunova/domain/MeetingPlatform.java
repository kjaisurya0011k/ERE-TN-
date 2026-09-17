package com.edunova.domain;

/**
 * Supported online-meeting platforms for a Session.
 *
 * BUILT_IN_WEBRTC – Uses the application's own WebRTC room (/meetings/:roomCode/room).
 * EXTERNAL_URL    – Mentor supplies a real HTTPS URL (Google Meet, Teams, Jitsi, etc.).
 *                   The URL is stored server-side and exposed ONLY to registered participants
 *                   and the session host.  It is never returned to unauthenticated callers.
 * ZOOM_FUTURE     – Reserved for official Zoom API integration once credentials are available.
 *                   Creating a session with this platform will be rejected by the service
 *                   until Zoom credentials are configured.
 */
public enum MeetingPlatform {
    BUILT_IN_WEBRTC,
    EXTERNAL_URL,
    ZOOM_FUTURE
}
