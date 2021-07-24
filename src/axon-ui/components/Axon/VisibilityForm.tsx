import React, { useEffect, useState } from "react";
import {
  AxonCommandRequest,
  Visibility,
} from "../../declarations/Axon/Axon.did";

export function VisibilityForm({
  makeCommand,
}: {
  makeCommand: (cmd: AxonCommandRequest | null) => void;
}) {
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    makeCommand({
      UpdateVisibility: {
        [isPublic ? "Public" : "Private"]: null,
      } as Visibility,
    });
  }, [isPublic]);

  return (
    <div className="flex flex-col py-4 gap-2 leading-tight">
      <label className="flex">
        <div className="w-6">
          <input
            type="radio"
            onChange={(e) => setIsPublic(true)}
            checked={isPublic}
          />
        </div>
        <div>
          <strong>Public</strong>
          <p className="text-gray-500">Neuron data can be viewed by anyone</p>
        </div>
      </label>

      <label className="flex">
        <div className="w-6">
          <input
            type="radio"
            onChange={(e) => setIsPublic(false)}
            checked={!isPublic}
          />
        </div>
        <div>
          <strong>Private</strong>
          <p className="text-gray-500">Only owners can view neuron data</p>
        </div>
      </label>
    </div>
  );
}