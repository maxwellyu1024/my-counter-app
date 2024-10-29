// src/utils/localStorageUtils.ts

/**
 * 从本地存储获取数据
 * @param key 存储的键
 * @returns 返回对应的值，如果未找到则返回 null
 */
export const getFromLocalStorage = (key: string): any => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
};

/**
 * 将数据保存到本地存储
 * @param key 存储的键
 * @param value 要存储的值
 */
export const saveToLocalStorage = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
};

/**
 * 从本地存储中删除数据
 * @param key 存储的键
 */
export const removeFromLocalStorage = (key: string): void => {
    localStorage.removeItem(key);
};

/**
 * 清空本地存储
 */
export const clearLocalStorage = (): void => {
    localStorage.clear();
};
