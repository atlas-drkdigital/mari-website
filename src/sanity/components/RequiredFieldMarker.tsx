import type { FieldProps } from 'sanity'

// Global field component (wired in sanity.config.ts → form.components.field) that shows an
// upfront "*" marker on the label of every REQUIRED field, BEFORE the editor fills anything.
// Sanity 6.4.0 shows no such marker by default — a required field only turns red AFTER it's
// touched or on publish, which editors miss and read as "the backend is broken" (Adinda's
// repeated ask — see CLAUDE.md "Required fields must show an upfront marker"). Implemented once
// here rather than by hand-editing every field title, so it covers all current and future
// required fields automatically.
//
// Detection reads the compiled validation rules on the field's schema type. A Sanity `Rule`
// exposes both an `isRequired()` method and a raw `_rules` array of `{ flag, constraint }`
// specs (verified against @sanity/types in node_modules, 6.4.0). We try the method first and
// fall back to inspecting `_rules` for a `presence: required` spec, so this keeps working
// whether `validation` arrives as Rule instances (with methods) or plain rule specs.
type MaybeRule = {
  isRequired?: () => boolean
  _rules?: Array<{ flag?: string; constraint?: unknown }>
}

function isFieldRequired(schemaType: FieldProps['schemaType']): boolean {
  const validation = (schemaType as { validation?: unknown })?.validation
  if (!Array.isArray(validation)) return false
  return validation.some((rule: MaybeRule) => {
    if (typeof rule?.isRequired === 'function') {
      try {
        return rule.isRequired()
      } catch {
        // fall through to the raw-spec check below
      }
    }
    return (
      Array.isArray(rule?._rules) &&
      rule._rules.some((r) => r.flag === 'presence' && r.constraint === 'required')
    )
  })
}

export function RequiredFieldMarker(props: FieldProps) {
  // Only touch the label when the field is required and actually has a title to append to.
  // Everything else renders exactly as Studio would by default.
  if (!isFieldRequired(props.schemaType) || !props.title) {
    return props.renderDefault(props)
  }
  return props.renderDefault({ ...props, title: `${props.title} *` })
}
