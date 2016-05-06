export function forEach(obj, fn) {
  Object.keys(obj).forEach((key) => fn(obj[key], key, obj));
}

export function defineStatic(Class, name, value) {
  return Object.defineProperty(Class, name, {
    value,
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

let defineClassName;
if ((() => {
  const A = class {};
  try {
    defineStatic(A, 'name', 'B');
    return A.name === 'B';
  } catch (e) {
    return false;
  }
})()) {
  defineClassName = (Class, value) => defineStatic(Class, 'name', value);
} else {
  defineClassName = (Class, value) => {
    // Old Node versions require the following options to overwrite class name.
    return Object.defineProperty(Class, 'name', {
      value,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  };
}
export {defineClassName};

export function defineGetterSetter(Class, name, get, set) {
  return Object.defineProperty(Class, name, {
    get,
    set,
    enumerable: true,
    configurable: true,
  });
};

export function inheritPropertyFrom(objA, objB, key, asKey) {
  return Object.defineProperty(
    objA,
    asKey || key,
    Object.getOwnPropertyDescriptor(objB, key)
  );
}

export function inheritFrom(objA, objB, excludes) {
  const aKeys = Object.getOwnPropertyNames(objA);
  const bKeys = Object.getOwnPropertyNames(objB);

  let keys = bKeys.filter((key) => aKeys.indexOf(key) === -1);
  if (excludes) {
    keys = keys.filter((key) => excludes.indexOf(key) === -1);
  }

  keys.forEach((key) => inheritPropertyFrom(objA, objB, key));
  return objA;
}

export function inheritStatic(classA, classB) {
  inheritFrom(classA, classB, ['length', 'name', 'prototype']);
  return classA;
}

export function inheritPrototype(classA, classB) {
  inheritFrom(classA.prototype, classB.prototype, ['constructor']);
  return classA;
}

export function inheritClass(classA, classB) {
  inheritStatic(classA, classB);
  inheritPrototype(classA, classB);
  return classA;
}
