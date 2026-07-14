import { useEffect } from 'react'
import { set, useFormValue } from 'sanity'
import type { SlugInputProps } from 'sanity'

// Auto-fills the slug from the document's title field once, without needing
// to click Sanity's default "Generate" button. Only fires while the slug is
// empty — still fully editable/overridable afterward.
export function AutoSlugInput(props: SlugInputProps) {
  const { schemaType, value, onChange } = props
  const sourceField = (schemaType.options as { source?: string })?.source ?? 'title'
  const title = useFormValue([sourceField]) as string | undefined

  useEffect(() => {
    if (!value?.current && title) {
      const slugified = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      if (slugified) onChange(set({ _type: 'slug', current: slugified }))
    }
  }, [title, value, onChange])

  return props.renderDefault(props)
}
