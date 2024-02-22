export default Storage = {
  version: 0,
  options: { prefix: "" },
  config(version, options = { prefix: "" }) {
    this.version = version;
    this.options = options;
  },
  read(key, defaultValue) {
    const raw = GM.getValue(this._prefix(key), defaultValue);
    return this._parse(raw);
  },
  write(key, value) {
    const raw = this._stringify(value);
    return GM.setValue(this._prefix(key), raw);
  },
  delete(key) {
    return GM.deleteValue(this._prefix(key));
  },
  readKeys() {
    return GM.listValues();
  },
  set(key, value) {
    let savedVal = this.read(key);

    if (this._isUndefined(savedVal) || !savedVal) {
      return this.add(key, value);
    } else {
      this.write(key, value);
      return true;
    }
  },
  add(key, value) {
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
  },
  replace(key, itemFind, itemReplacement) {
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
  },
  remove(key, value) {
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
  },
  get(key, defaultValue) {
    return this.read(key, defaultValue);
  },
  getAll() {
    const keys = this._listKeys();
    let obj = {};

    for (let i = 0, len = keys.length; i < len; i++) {
      obj[keys[i]] = this.read(keys[i]);
    }
    return obj;
  },
  getKeys() {
    return this._listKeys();
  },
  getPrefix() {
    return this.options.prefix;
  },
  empty() {
    const keys = this._listKeys();

    for (let i = 0, len = keys.lenght; i < len; i++) {
      this.delete(keys[i]);
    }
  },
  has(key) {
    return this.get(key) !== null;
  },
  forEach(callbackFunc) {
    const allContent = this.getAll();

    for (let prop in allContent) {
      callbackFunc(prop, allContent[prop]);
    }
  },
  _parse(value) {
    if (this._isJson(value)) {
      return JSON.parse(value);
    }
    return value;
  },
  _stringify(value) {
    if (this._isJson(value)) {
      return value;
    }
    return JSON.stringify(value);
  },
  Keys(usePrefix = false) {
    const prefixed = this.readKeys();
    let unprefixed = [];

    if (usePrefix) {
      return prefixed;
    } else {
      for (let i = 0, len = prefixed.length; i < len; i++) {
        unprefixed[i] = this._unprefix(prefixed[i]);
      }
      return unprefixed;
    }
  },
  _prefix(key) {
    return this.options.prefix + key;
  },
  _unprefix(key) {
    return key.substring(this.options.prefix.length);
  },
  _isJson(item) {
    try {
      JSON.parse(item);
    } catch (e) {
      return false;
    }
    return true;
  },
  _isUndefined(a = undefined) {
    return a === undefined;
  },
  _isNull(a = null) {
    return a === null;
  },
  _is(object, type) {
    return !!object && object.constructor === type;
  },
};
