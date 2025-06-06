import { MMKV } from 'react-native-mmkv';

// 创建存储实例
export const storage = new MMKV({
  id: 'app-storage',
  encryptionKey: 'app-storage-key'
});

// 存储工具类
export class Storage {
  // 存储字符串
  static setString(key: string, value: string): void {
    storage.set(key, value);
  }

  // 获取字符串
  static getString(key: string): string | undefined {
    return storage.getString(key);
  }

  // 存储数字
  static setNumber(key: string, value: number): void {
    storage.set(key, value);
  }

  // 获取数字
  static getNumber(key: string): number | undefined {
    return storage.getNumber(key);
  }

  // 存储布尔值
  static setBoolean(key: string, value: boolean): void {
    storage.set(key, value);
  }

  // 获取布尔值
  static getBoolean(key: string): boolean | undefined {
    return storage.getBoolean(key);
  }

  // 存储对象
  static setObject<T extends object>(key: string, value: T): void {
    storage.set(key, JSON.stringify(value));
  }

  // 获取对象
  static getObject<T extends object>(key: string): T | undefined {
    const value = storage.getString(key);
    if (!value) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }

  // 删除指定键
  static delete(key: string): void {
    storage.delete(key);
  }

  // 清除所有数据
  static clearAll(): void {
    storage.clearAll();
  }

  // 获取所有键
  static getAllKeys(): string[] {
    return storage.getAllKeys();
  }

  // 检查键是否存在
  static contains(key: string): boolean {
    return storage.contains(key);
  }

  // 获取存储大小（字节）
  static getSize(): number {
    return storage.size;
  }

  // 清理未使用的键和内存缓存
  static trim(): void {
    storage.trim();
  }
} 