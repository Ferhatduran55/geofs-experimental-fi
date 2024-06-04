class Storage {
  static _version: string;
  static _options = { prefix: "" };
  static get version() {
    return this._version;
  }
  static set version(value) {
    this._version = value;
  }
  static get options() {
    return this._options;
  }
  static set options(value) {
    this._options = value;
  }
  static config(version: string, options = { prefix: "" }) {
    this._version = version;
    this._options = options;
  }
  static read(key: string, defaultValue?: any) {
    const raw = GM.getValue(this._prefix(key), defaultValue);
    return this._parse(raw);
  }
  static write(key: string, value: any) {
    const raw = this._stringify(value);
    return GM.setValue(this._prefix(key), raw);
  }
  static delete(key: string) {
    return GM.deleteValue(this._prefix(key));
  }
  static readKeys() {
    return GM.listValues();
  }
  static set(key: string, value: any) {
    let savedVal = this.read(key);

    if (this._isUndefined(savedVal) || !savedVal) {
      return this.add(key, value);
    } else {
      this.write(key, value);
      return true;
    }
  }
  static add(key: string, value: any) {
    let savedVal = this.read(key, false);

    if (this._isUndefined(savedVal) || !savedVal) {
      this.write(key, value);
      return true;
    } else {
      if (this._is(Array, savedVal)) {
        let index = savedVal.indexOf(value);

        if (index !== -1) {
          return false;
        } else {
          savedVal.push(value);
          this.write(key, savedVal);
          return true;
        }
      } else if (this._is(Object, savedVal)) {
        let result,
          objToMerge = value;

        result = Object.assign(savedVal, objToMerge);
        this.write(key, result);
        return false;
      }
      return false;
    }
  }
  static replace(key: string, itemFind: any, itemReplacement: any) {
    let savedVal = this.read(key, false);

    if (this._isUndefined(savedVal) || !savedVal) {
      return false;
    } else {
      if (this._is(Array, savedVal)) {
        let index = savedVal.indexOf(itemFind);

        if (index !== -1) {
          savedVal[index] = itemReplacement;
          this.write(key, savedVal);
          return true;
        } else {
          return false;
        }
      } else if (this._is(Object, savedVal)) {
        savedVal[itemFind] = itemReplacement;
        this.write(key, savedVal);
        return true;
      }
      return false;
    }
  }
  static remove(key: string, value: any) {
    if (this._isUndefined(value)) {
      this.delete(key);
      return true;
    } else {
      let savedVal = this.read(key);

      if (this._isUndefined(savedVal) || !savedVal) {
        return true;
      } else {
        if (this._is(Array, savedVal)) {
          let index = savedVal.indexOf(value);

          if (index !== -1) {
            savedVal.splice(index, 1);
            this.write(key, savedVal);
            return true;
          } else {
            return false;
          }
        } else if (this._is(Object, savedVal)) {
          let property = value;

          delete savedVal[property];
          this.write(key, savedVal);
          return true;
        }
        return false;
      }
    }
  }
  static get(key: string, defaultValue?: any) {
    return this.read(key, defaultValue);
  }
  static getAll() {
    const keys: any = this._listKeys();
    let obj: any = {};

    for (let i = 0, len = keys.length; i < len; i++) {
      obj[keys[i]] = this.read(keys[i]);
    }
    return obj;
  }
  static getKeys() {
    return this._listKeys();
  }
  static getPrefix() {
    return this._options.prefix;
  }
  static empty() {
    const keys: any = this._listKeys();

    for (let i = 0, len = keys.lenght; i < len; i++) {
      this.delete(keys[i]);
    }
  }
  static has(key: string) {
    return this.get(key) !== null;
  }
  static forEach(callbackFunc: Function) {
    const allContent = this.getAll();

    for (let prop in allContent) {
      callbackFunc(prop, allContent[prop]);
    }
  }
  static _parse(value: any) {
    if (this._isJson(value)) {
      return JSON.parse(value);
    }
    return value;
  }
  static _stringify(value: any) {
    if (this._isJson(value)) {
      return value;
    }
    return JSON.stringify(value);
  }
  static _listKeys(usePrefix = false) {
    const prefixed: any = this.readKeys();
    let unprefixed = [];

    if (usePrefix) {
      return prefixed;
    } else {
      for (let i = 0, len = prefixed.length; i < len; i++) {
        unprefixed[i] = this._unprefix(prefixed[i]);
      }
      return unprefixed;
    }
  }
  static _prefix(key: string) {
    return this._options.prefix + key;
  }
  static _unprefix(key: string) {
    return key.substring(this._options.prefix.length);
  }
  static _isJson(value: any) {
    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    }
    return true;
  }
  static _isUndefined(a = undefined) {
    return a === undefined;
  }
  static _isNull(a = null) {
    return a === null;
  }
  static _is(object: any, type: any) {
    return !!object && object.constructor === type;
  }
}

export default Storage;
