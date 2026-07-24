import { Stack, Text } from '@sanity/ui'
import type { StringInputProps, TextInputProps } from 'sanity'

// Set `options: { maxLength: N }` on the field to show a live count against a
// recommended (not enforced) length — pair with a `.warning()` validation rule.
export function CharCountInput(props: StringInputProps | TextInputProps) {
  const { value, schemaType } = props
  const max = (schemaType.options as { maxLength?: number })?.maxLength
  const length = value?.length ?? 0
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
