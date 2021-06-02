import React from "react";
import { RouteComponentProps } from "react-router";
import Network from "../../provider/network/network";
import CRDT, { CRDTContext } from "../../provider/crdt/crdt";
import Edditor from "./editor";
import { getSession, SessionFull } from "../../service/Session";

interface EdditorProps {
  id: string;
}

const EditorPage: React.FunctionComponent<RouteComponentProps<EdditorProps>> =
  ({
    match: {
      params: { id },
    },
  }) => {
    const [session, setSession] = React.useState<SessionFull | undefined>();

    const fetchData = async () => {
      const session = await getSession(id);
      setSession(session);
    };

    React.useEffect(() => {
      fetchData();
    }, [id]);

    if (!session) {
      return <div>Loading</div>;
    }

    return (
      <Network id={id}>
        <CRDT session={session}>
          <Edditor session={session} />
        </CRDT>
      </Network>
    );
  };

export default EditorPage;
