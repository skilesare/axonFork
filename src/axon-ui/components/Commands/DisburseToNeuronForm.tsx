import { Principal } from "@dfinity/principal";
import React, { useEffect, useState } from "react";
import { Command, DisburseToNeuron } from "../../declarations/Axon/Axon.did";
import { NEURON_MIN_STAKE } from "../../lib/constants";
import useDebounce from "../../lib/hooks/useDebounce";
import DissolveDelayInput from "../Inputs/DissolveDelayInput";
import ErrorAlert from "../Labels/ErrorAlert";

export function DisburseToNeuronForm({
  stake,
  makeCommand,
}: {
  stake?: bigint;
  makeCommand: (cmd: Command | null) => void;
}) {
  const [kyc, setKyc] = useState(true);
  const [dissolveDelay, setDissolveDelay] = useState("");
  const [controller, setController] = useState("");
  const [amount, setAmount] = useState("");
  const [nonce, setNonce] = useState("");
  const [error, setError] = useState("");

  const debouncedController = useDebounce(controller);
  const debouncedNonce = useDebounce(nonce);

  useEffect(() => {
    setError("");
    let new_controller = [];
    if (controller) {
      try {
        new_controller = [Principal.fromText(controller)];
      } catch (err) {
        setError("Invalid principal: " + err.message);
        return makeCommand(null);
      }
    }

    if (!nonce || !dissolveDelay) {
      return makeCommand(null);
    }

    let nonce_bi: BigInt;
    try {
      nonce_bi = BigInt(nonce);
    } catch (err) {
      setError("Invalid nonce");
      return makeCommand(null);
    }

    makeCommand({
      DisburseToNeuron: {
        dissolve_delay_seconds: BigInt(dissolveDelay),
        kyc_verified: kyc,
        amount_e8s: BigInt(amount) * BigInt(1e8),
        new_controller,
        nonce: nonce_bi,
      } as DisburseToNeuron,
    });
  }, [debouncedController, debouncedNonce]);

  return (
    <>
      <div className="flex flex-col py-4 gap-2">
        <div>
          <label>Amount</label>
          <input
            type="number"
            placeholder="Amount"
            className="w-full mt-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={NEURON_MIN_STAKE}
            max={stake !== undefined ? Number(stake / BigInt(1e8)) : undefined}
            required
          />
        </div>

        <div>
          <label>Dissolve Delay</label>
          <DissolveDelayInput
            value={dissolveDelay}
            onChange={setDissolveDelay}
            required
          />
        </div>

        <div>
          <label>New Controller</label>
          <input
            type="text"
            placeholder="New Controller"
            className="w-full mt-1"
            value={controller}
            onChange={(e) => setController(e.target.value)}
            maxLength={64}
          />
        </div>

        <div>
          <label>Nonce</label>
          <input
            type="text"
            placeholder="Nonce"
            className="w-full mt-1"
            value={nonce}
            onChange={(e) => setNonce(e.target.value)}
            maxLength={64}
            required
          />
        </div>

        <div>
          <label className="cursor-pointer inline-flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={kyc}
              onChange={(e) => setKyc(e.target.checked)}
            />
            KYCed
          </label>
        </div>
      </div>

      {!!error && <ErrorAlert>{error}</ErrorAlert>}
    </>
  );
}