import classNames from "classnames";
import React from "react";
import { StatusKey } from "../../lib/types";

const colorOf = (status: StatusKey, hasExecutionError) => {
  switch (status) {
    case "Created":
      return "bg-gray-300 text-gray-700";
    case "Active":
    case "Accepted":
      return "bg-green-300 text-green-700";
    case "Executed":
      if (hasExecutionError) {
        return "bg-yellow-300 text-yellow-700";
      } else {
        return "bg-green-300 text-green-700";
      }
    case "Executing":
      return "bg-blue-200 text-blue-700";
    case "Rejected":
      return "bg-red-300 text-red-700";
    case "Expired":
      return "bg-gray-300 text-gray-700";
  }
};

export default function StatusLabel({
  status,
  hasExecutionError,
}: {
  status: StatusKey;
  hasExecutionError?: boolean;
}) {
  return (
    <label
      className={classNames(
        "block w-20 text-center py-0.5 rounded text-xs uppercase",
        colorOf(status, hasExecutionError)
      )}
      title={hasExecutionError ? "Executed with errors" : undefined}
    >
      {status === "Created" ? "Pending" : status}
      {hasExecutionError && "*"}
    </label>
  );
}
