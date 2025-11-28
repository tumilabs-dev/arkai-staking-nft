import { appConfig } from "@/constants/appConfig";

export function resolveAsset(asset: string) {
  if (asset.startsWith("http")) {
    return asset;
  }
  return `${appConfig.api.assetsUrl}${asset}`;
}
