import { DateRangeFilterProps } from "@/types";


export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}: DateRangeFilterProps) {
  return (
    <div className="mt-4 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-400">
          Data início
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-400">
          Data fim
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
      </div>

      <button
        onClick={onApply}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Aplicar
      </button>
    </div>
  );
}
