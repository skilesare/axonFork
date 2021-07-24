import { Disclosure } from "@headlessui/react";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { FOUR_HOUR_SEC } from "../../lib/constants";
import { ActionOptions } from "../../lib/types";

export function ActionOptionsForm({
  onChangeOptions,
}: {
  onChangeOptions: (opts: ActionOptions) => void;
}) {
  const [timeStart, setTimeStart] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("");
  const [execute, setExecute] = useState(true);

  // Sync state with parent
  useEffect(() => {
    onChangeOptions({
      timeStart: timeStart ? BigInt(timeStart) : undefined,
      durationSeconds: durationSeconds ? BigInt(durationSeconds) : undefined,
      execute,
    });
  }, [timeStart, durationSeconds, execute]);

  return (
    <Disclosure as="div" className="py-4">
      {({ open }) => (
        <>
          <Disclosure.Button className="group leading-none inline-flex items-center cursor-pointer px-2 py-1">
            Options
            <FiChevronRight
              className={classNames(
                "transform transition-transform transition-100",
                {
                  "group-hover:translate-x-0.5": !open,
                  "rotate-90": open,
                }
              )}
            />
          </Disclosure.Button>

          <Disclosure.Panel as="div" className="flex flex-col gap-2 pt-2">
            <div>
              <label>Time Start</label>
              <input
                type="number"
                placeholder="Time Start"
                className="w-full mt-1"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                min={0}
              />
            </div>

            <div>
              <label>Duration (seconds)</label>
              <input
                type="number"
                placeholder="Duration (seconds)"
                className="w-full mt-1"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(e.target.value)}
                min={FOUR_HOUR_SEC}
              />
            </div>

            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={execute}
                  onChange={(e) => setExecute(e.target.checked)}
                />
                Execute immediately
              </label>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}