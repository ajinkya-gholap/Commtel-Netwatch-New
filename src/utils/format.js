/**
 * Builds a className string from a base class plus a map of modifier
 * classes that should only be included when their value is truthy.
 *
 *   classes('card', { 'card--selected': true, 'card--offline': false })
 *   // => "card card--selected"
 *
 * Works just as well with CSS Module class names, since the keys of
 * `modifiers` can be computed (e.g. [styles['card--selected']]: isSelected).
 */
export function classes(base, modifiers = {}) {
  const list = [base]

  for (const key in modifiers) {
    if (modifiers[key]) {
      list.push(key)
    }
  }

  return list.filter(Boolean).join(' ')
}
