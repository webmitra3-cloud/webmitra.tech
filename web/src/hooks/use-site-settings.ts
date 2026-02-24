import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { defaultSettings } from "@/lib/constants";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: publicApi.getSettings,
    select: (data) => ({
      ...defaultSettings,
      ...(data || {}),
      stats: {
        ...defaultSettings.stats,
        ...(data?.stats || {}),
      },
      contact: {
        ...defaultSettings.contact,
        ...(data?.contact || {}),
      },
      socials: {
        ...defaultSettings.socials,
        ...(data?.socials || {}),
      },
      header: {
        ...defaultSettings.header,
        ...(data?.header || {}),
        badges: data?.header?.badges || defaultSettings.header.badges,
      },
      footer: {
        ...defaultSettings.footer,
        ...(data?.footer || {}),
        capabilities: data?.footer?.capabilities || defaultSettings.footer.capabilities,
      },
      values: data?.values || defaultSettings.values,
    }),
  });
}
