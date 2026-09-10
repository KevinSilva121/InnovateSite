export class Project {
  constructor({ id, slug, title, type, category = '', tagline = '', desc = '', url = null, icon = null, stores = {} }) {
    this.id = id;
    this.slug = slug;
    this.title = title;
    this.type = type; // 'app' | 'web'
    this.category = category;
    this.tagline = tagline;
    this.desc = desc;
    this.url = url;
    this.icon = icon;
    this.stores = { play: stores.play ?? null, appStore: stores.appStore ?? null };
  }

  get platforms() {
    const list = [];
    if (this.stores.play) list.push('Android');
    if (this.stores.appStore) list.push('iOS');
    return list;
  }
}
