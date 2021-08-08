import { Principal } from "@dfinity/principal";
import React, { useEffect, useState } from "react";
import { AxonCommandRequest } from "../../declarations/Axon/Axon.did";
import { useAxonById } from "../../lib/hooks/Axon/useAxonById";
import useAxonId from "../../lib/hooks/useAxonId";
import useDebounce from "../../lib/hooks/useDebounce";
import { formatNumber } from "../../lib/utils";
import ErrorAlert from "../Labels/ErrorAlert";

export function MintForm({
  makeCommand,
  defaults,
}: {
  makeCommand: (cmd: AxonCommandRequest | null) => void;
  defaults?: Extract<AxonCommandRequest, { Mint: {} }>["Mint"];
}) {
  const axonId = useAxonId();
  const { data } = useAxonById();
  const [amount, setAmount] = useState(defaults?.amount.toString() || "");
  const [recipient, setRecipient] = useState(
    defaults?.recipient[0] ? defaults?.recipient[0].toText() : ""
  );
  const [error, setError] = useState("");
  const debouncedRecipient = useDebounce(recipient);
  const debouncedAmount = useDebounce(amount);

  useEffect(() => {
    if (!debouncedAmount) return makeCommand(null);

    setError("");
    let maybeRecipient: [] | [Principal] = [];
    if (recipient) {
      try {
        maybeRecipient = [Principal.fromText(recipient)];
      } catch (err) {
        setError("Invalid principal");
        return makeCommand(null);
      }
    }

    let command: AxonCommandRequest;
    try {
      command = {
        Mint: {
          recipient: maybeRecipient,
          amount: BigInt(debouncedAmount),
        },
      };
    } catch (error) {
      setError(error.message);
      return makeCommand(null);
    }
    makeCommand(command);
  }, [debouncedAmount, debouncedRecipient]);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm leading-tight">
        Mint new <strong>AXON_{axonId}</strong> tokens.
      </p>
      <p className="text-sm leading-tight">
        If recipient is not specified, tokens will remain in the Axon treasury
        and can be transferred later.
      </p>

      <label className="block">
        <div className="flex justify-between">
          <span>Recipient</span>
          <span className="text-gray-400">Optional</span>
        </div>
        <input
          type="text"
          placeholder="Recipient"
          className="w-full mt-1"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          maxLength={64}
        />
      </label>

      <label className="block">
        <div className="flex justify-between">
          <span>Amount</span>
          <span className="text-gray-400">
            Current Supply: {formatNumber(data.supply)}
          </span>
        </div>
        <input
          type="number"
          placeholder="Amount"
          className="w-full mt-1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={0}
          required
        />
      </label>

      {!!error && <ErrorAlert>{error}</ErrorAlert>}
    </div>
  );
}
