'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { parseDetailsBlock, type DetailsBlockParseResult } from '@/lib/details-block-parser'
import { COPY } from '@/lib/copy'

interface DetailsBlockPasteProps {
  onParsed: (result: DetailsBlockParseResult) => void
}

export function DetailsBlockPaste({ onParsed }: DetailsBlockPasteProps) {
  const [rawText, setRawText] = useState('')

  const handleBlur = () => {
    if (rawText.trim()) {
      const result = parseDetailsBlock(rawText)
      onParsed(result)
    }
  }

  return (
    <Textarea
      id="details-block"
      label={COPY.applications.pasteDetailsBlock}
      placeholder={COPY.applications.pasteDetailsBlockPlaceholder}
      value={rawText}
      onChange={e => setRawText(e.target.value)}
      onBlur={handleBlur}
      rows={6}
    />
  )
}
