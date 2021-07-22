import React from "react";
import { BiListUl } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { ProposalInfo } from "../declarations/Governance/Governance.did.d";
import { Action, Topic } from "../lib/governance";
import { useNnsPendingProposals } from "../lib/hooks/useNnsPendingProposals";
import IdentifierLabelWithButtons from "./Buttons/IdentifierLabelWithButtons";

const NnsProposal = ({ proposal }: { proposal: ProposalInfo }) => {
  const id = proposal.id[0].id;
  const actionKey = Object.keys(proposal.proposal[0].action[0])[0];
  return (
    <div className="flex flex-col sm:flex-row p-2">
      <div className="w-36">
        <IdentifierLabelWithButtons type="Proposal" id={id}>
          #{id.toString()}
        </IdentifierLabelWithButtons>
      </div>
      <div className="flex-1">
        <div>{Topic[proposal.topic]}</div>
        <div>{Action[actionKey]}</div>
        <div className="text-xs">{proposal.proposal[0].summary}</div>
      </div>
    </div>
  );
};

export default function NnsProposals() {
  const { data, error, isFetching } = useNnsPendingProposals();

  return (
    <section className="p-4 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex gap-2 items-center mb-2">
        <h2 className="text-xl font-bold">Open NNS Proposals</h2>
        {isFetching && <CgSpinner className="inline-block animate-spin" />}
      </div>
      <div>
        {error}
        {data && data.length > 0 ? (
          <ul className="divide-y divide-gray-300">
            {data.map((p) => (
              <li key={p.id[0].id.toString()}>
                <NnsProposal proposal={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center">
            <BiListUl size={48} className="" />
            <p className="py-2">No open NNS proposals</p>
          </div>
        )}
      </div>
    </section>
  );
}