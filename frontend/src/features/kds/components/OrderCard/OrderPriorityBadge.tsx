//Hiển thị nhãn mức độ ưu tiên (Urgent, High) và nhãn cảnh báo thời gian (Overdue, Near Deadline).
export const OrderPriorityBadge = ({
  priority,
  overdue,
  nearDeadline,
}: {
  priority: string;
  overdue: boolean;
  nearDeadline: boolean;
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        {priority === "urgent" && !overdue && (
          <span
            className="px-2 py-0.5 bg-red-500 text-white rounded"
            style={{ fontSize: "0.625rem", fontWeight: 700 }}
          >
            URGENT
          </span>
        )}
        {priority === "high" && !overdue && !nearDeadline && (
          <span
            className="px-2 py-0.5 bg-orange-500 text-white rounded"
            style={{ fontSize: "0.625rem", fontWeight: 700 }}
          >
            HIGH
          </span>
        )}
      </div>

      {overdue && (
        <div
          className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-center"
          style={{ fontSize: "0.75rem", fontWeight: 700 }}
        >
          ⚠️ OVERDUE - URGENT!
        </div>
      )}
      {nearDeadline && !overdue && (
        <div
          className="mt-2 px-2 py-1 bg-orange-500 text-white rounded text-center"
          style={{ fontSize: "0.75rem", fontWeight: 700 }}
        >
          ⏰ NEAR DEADLINE
        </div>
      )}
    </>
  );
};
