import { Stack, Text } from '@sanity/ui'
import type { ArrayOfObjectsInputProps } from 'sanity'

// CharCountInput's sibling for PORTABLE TEXT fields (2026-07-22, Adinda: the boat card summary
// showed only the length warning, no live counter — CharCountInput can't attach to an array
// type). Totals the span text across blocks on every change. Same contract: set
// `options: { maxLength: N }` (cast, it's a custom option) and pair with a `.warning()` rule.
type Block = { children?: { text?: string }[] }

export function RichTextCharCountInput(props: ArrayOfObjectsInputProps) {
  const max = (props.schemaType.options as { maxLength?: number } | undefined)?.maxLength
  const length = ((props.value ?? []) as Block[]).reduce(
    (n, blk) => n + (blk.children ?? []).reduce((m, c) => m + (c.text?.length ?? 0), 0),
    0,
  )
  const overLimit = typeof max === 'number' && length > max

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      <Text size={1} muted={!overLimit} accent={overLimit}>
        {length}
        {typeof max === 'number' ? ` / ${max}` : ''} characters
      </Text>
    </Stack>
  )
}
