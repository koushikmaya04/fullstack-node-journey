class ConfigManager {
  constructor() {
    if (ConfigManager.instance) {
      return ConfigManager.instance;
    }

    this.config = new Map();
    ConfigManager.instance = this;
  }

  set(key, value) {
    this.config.set(key, value);
    return this;
  }

  get(key) {
    return this.config.get(key);
  }

  has(key) {
    return this.config.has(key);
  }

  getAll() {
    return Object.fromEntries(this.config);
  }
}

module.exports = new ConfigManager();
