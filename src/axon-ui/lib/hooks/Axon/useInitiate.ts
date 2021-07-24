import { useMutation, useQueryClient } from "react-query";
import { useAxon } from "../../../components/Store/Store";
import { ActionType } from "../../../declarations/Axon/Axon.did";
import { ActionOptions } from "../../types";
import { errorToString } from "../../utils";

export default function useInitiate({
  timeStart,
  durationSeconds,
  execute,
}: ActionOptions) {
  const axon = useAxon();
  const queryClient = useQueryClient();

  return useMutation(
    async (action: ActionType) => {
      let result;
      try {
        result = await axon.initiate({
          timeStart: timeStart ? [timeStart] : [],
          durationSeconds: durationSeconds ? [durationSeconds] : [],
          action,
          execute: execute ? [true] : [],
        });
      } catch (error) {
        throw error.message;
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
        queryClient.refetchQueries(["pendingActions"]);
      },
    }
  );
}