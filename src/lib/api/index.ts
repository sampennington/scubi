import { shopApi, type ShopWithMembers } from "./shops"
import { memberApi } from "./members"
import { pageApi, type Page } from "./pages"
import { blockApi, type Block } from "./blocks"
import { templateApi } from "./templates"
import { siteSettingsApi } from "./site-settings"
import { subscriptionApi } from "./subscriptions"

export { shopApi, type Shop, type ShopWithMembers } from "./shops"
export { memberApi } from "./members"
export { pageApi, type Page } from "./pages"
export { blockApi, type Block } from "./blocks"
export { templateApi } from "./templates"
export { siteSettingsApi } from "./site-settings"
export { subscriptionApi } from "./subscriptions"

export type PageWithBlocks = Page & {
  blocks: Block[]
}

export const api = {
  shops: shopApi,
  members: memberApi,
  pages: pageApi,
  blocks: blockApi,
  templates: templateApi,
  siteSettings: siteSettingsApi,
  subscriptions: subscriptionApi,

  utils: {
    async getShopWithMembers(shopId: string): Promise<ShopWithMembers | null> {
      const shop = await shopApi.getById(shopId)
      if (!shop) return null

      const members = await memberApi.getByShopId(shopId)
      return { ...shop, members }
    },

    async getPageWithBlocks(pageId: string): Promise<PageWithBlocks | null> {
      const page = await pageApi.getById(pageId)
      if (!page) return null

      const blocks = await blockApi.getByPageId(pageId)
      return { ...page, blocks }
    }
  }
}
