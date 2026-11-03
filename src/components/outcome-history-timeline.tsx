import { type OutcomeHistoryRow } from '@/lib/db/outcome-history'
import { COPY } from '@/lib/copy'

interface OutcomeHistoryTimelineProps {
  history: OutcomeHistoryRow[]
}

export function OutcomeHistoryTimeline({ history }: OutcomeHistoryTimelineProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">{COPY.applications.outcomeHistory}</h3>
      {history.length === 0 ? (
        <p className="text-sm text-gray-500">No outcome changes recorded.</p>
      ) : (
        <ol className="space-y-3">
          {history.map(entry => (
            <li key={entry.id} className="flex items-start gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-900">
                  {entry.previous_outcome
                    ? `${entry.previous_outcome} → ${entry.new_outcome}`
                    : `Set to ${entry.new_outcome}`}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(entry.changed_at).toLocaleDateString()}
                </p>
                {entry.note && <p className="text-xs text-gray-600 mt-1">{entry.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
