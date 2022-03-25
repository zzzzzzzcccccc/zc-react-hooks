import '@testing-library/jest-dom';

/**
 * mock localStorage
 */
class OverviewStorage implements Storage {
  [file: string]: any;

  length = 0;
  map = new Map<string, string>();

  clear() {
    this.map.clear();
    this.length = 0;
  }

  getItem(key: string) {
    return this.map.get(key) || null;
  }

  removeItem(key: string) {
    if (this.map.delete(key)) {
      this.length -= 1;
    }
  }

  setItem(key: string, value: string) {
    if (!this.map.has(key)) {
      this.length += 1;
    }
    this.map.set(key, value);
  }

  key(index: number) {
    if (index >= this.map.size) {
      return null;
    }
    return Array.from(this.map.keys())[index];
  }
}

(global as { localStorage: Storage }).localStorage = new OverviewStorage();
