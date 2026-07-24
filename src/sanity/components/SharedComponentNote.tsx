import { InfoOutlineIcon } from '@sanity/icons'
import { Card, Flex, Text } from '@sanity/ui'
import type { StringInputProps, StringOptions } from 'sanity'
import { defineField } from 'sanity'

// A read-only "signpost" shown in a document form where a whole section's content actually lives
// in a SHARED component/singleton, not on this page. Without it, an editor opens the page form,
// expects to type (say) the CTA copy here, finds no such field, and thinks the backend is broken
// (Adinda's ask 2026-07-16 — see CLAUDE.md homepage-slice notes). The note tells them exactly
// where to go instead. It stores no value; the message comes from the field's `options.message`.
type NoteOptions = { message?: string }

export function SharedComponentNote(props: StringInputProps) {
  const message = (props.schemaType.options as NoteOptions | undefined)?.message ?? ''
  return (
    <Card padding={3} radius={2} tone="primary" border>
      <Flex align="flex-start" gap={3}>
        <Text size={2} muted>
          <InfoOutlineIcon />
        </Text>
        <Text size={1}>{message}</Text>
      </Flex>
    </Card>
  )
}

// Helper to declare a signpost field in one line. Renders the note (via the input component above)
// under a normal field label, stores nothing, and stays out of the editor's way as read-only.
// `name` still has to be unique within the document, but the value is never used.
export function sharedComponentNote(config: {
  name: string
  title: string
  message: string
  group?: string
  fieldset?: string
}) {
  return defineField({
    name: config.name,
    title: config.title,
    type: 'string',
    readOnly: true,
    group: config.group,
    fieldset: config.fieldset,
    components: { input: SharedComponentNote },
    options: { message: config.message } as StringOptions & NoteOptions,
  })
}
