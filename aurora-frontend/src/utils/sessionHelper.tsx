import type { SessionMetaRequest } from "@/types/user";
import { Globe, Monitor, Smartphone, Tablet } from "lucide-react";
import { UAParser } from "ua-parser-js";

export function getSessionMeta(): SessionMetaRequest {
  const parser = new UAParser();
  const result = parser.getResult();

  let deviceName = "";
  if (result.device.vendor && result.device.model)
    deviceName = `${result.device.vendor} ${result.device.model}`;
  else
    deviceName = `${result.browser.name || "Browser"} on ${result.os.name || "Unknown OS"}`;

  const deviceType = result.device.type || "desktop";

  const userAgent = navigator.userAgent;

  return {
    deviceName,
    deviceType,
    userAgent,
  };
}

export const getBrowserInfo = (userAgent?: string | null) => {
  if (!userAgent) return "Unknown Browser";
  switch (true) {
    case /Chrome/.test(userAgent):
      return "Chrome";
    case /Firefox/.test(userAgent):
      return "Firefox";
    case /Safari/.test(userAgent):
      return "Safari";
    case /Edge/.test(userAgent):
      return "Edge";
    case /Opera/.test(userAgent):
      return "Opera";
    default:
      return "Other Browser";
  }
};

export const getLocationInfo = (userAgent?: string | null) => {
  if (!userAgent) return "Unknown";
  switch (true) {
    case /Windows/.test(userAgent):
      return "Windows";
    case /Mac/.test(userAgent):
      return "macOS";
    case /Linux/.test(userAgent):
      return "Linux";
    case /Android/.test(userAgent):
      return "Android";
    case /iOS/.test(userAgent):
      return "iOS";
    default:
      return "Unknown";
  }
};

export const getDeviceIcon = (deviceType?: string | null) => {
  if (!deviceType) return <Globe className="h-5 w-5 text-orange-500" />;

  switch (deviceType.toLowerCase()) {
    case "mobile":
    case "smartphone":
      return <Smartphone className="h-5 w-5 text-orange-500" />;
    case "tablet":
      return <Tablet className="h-5 w-5 text-orange-500" />;
    case "desktop":
    case "computer":
      return <Monitor className="h-5 w-5 text-orange-500" />;
    default:
      return <Globe className="h-5 w-5 text-orange-500" />;
  }
};
