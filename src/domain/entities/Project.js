export class Project {
  constructor({ id, slug, title, type, category = '', tagline = '', desc = '', url = null, icon = null, stores = {}, appCategory = 'BusinessApplication' }) {
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
    // Categoria do schema.org (SoftwareApplication.applicationCategory): jogos são GameApplication.
    this.appCategory = appCategory;
  }

  get platforms() {
    const list = [];
    if (this.stores.play) list.push('Android');
    if (this.stores.appStore) list.push('iOS');
    return list;
  }
}
