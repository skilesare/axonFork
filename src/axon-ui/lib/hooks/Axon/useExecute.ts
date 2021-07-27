import { useMutation, useQueryClient } from "react-query";
import { useAxon } from "../../../components/Store/Store";
import { Result_2 } from "../../../declarations/Axon/Axon.did";
import { errorToString } from "../../utils";
import useAxonId from "../useAxonId";

export default function useExecute() {
  const axonId = useAxonId();
  const axon = useAxon();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id }: { id: bigint }) => {
      let result: Result_2;
      try {
        result = await axon.execute(BigInt(axonId), id);
      } catch (error) {
        if (/assertion failed/.test(error.message)) {
          // Already executing, refetch
          return null;
        } else {
          throw error.message;
        }
      }
      if ("ok" in result) {
        return result.ok;
      } else {
        throw errorToString(result.err);
      }
    },
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.refetchQueries(["activeProposals", axonId]);
        queryClient.refetchQueries(["allProposals", axonId]);
      },
    }
  );
}
