export function getWebRTCSignalServer(): string {
  const runtime = useRuntimeConfig();

  if (runtime.public.WEB_RTC_SIGNAL) {
    return runtime.public.WEB_RTC_SIGNAL;
  }

  return "ws://localhost:4444";
}
