import { Node, EResourceKind } from "@pojntfx/webnetes";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

function HomePage() {
  const [node, setNode] = useState<Node>();

  useEffect(() => {
    setNode(
      new Node(
        async (resource) => {
          console.log("Created resource", resource);
        },
        async (resource) => {
          console.log("Deleted resource", resource);

          if (resource.kind === EResourceKind.WORKLOAD) {
            window.location.reload();
          }
        },
        async (frame) => {
          console.log("Rejected resource", frame);
        },
        async (id) => {
          console.log("Management node acknowledged", id);
        },
        async (id) => {
          console.log("Management node joined", id);
        },
        async (id) => {
          console.log("Management node left", id);
        },
        async (metadata, spec, id) => {
          console.log("Resource node acknowledged", metadata, spec, id);
        },
        async (metadata, spec, id) => {
          console.log("Resource node joined", metadata, spec, id);
        },
        async (metadata, spec, id) => {
          console.log("Resource node left", metadata, spec, id);
        },
        async (onStdin: (key: string) => Promise<void>, id) => {
          console.log("Creating terminal (STDOUT only)", id);
        },
        async (id, msg) => {
          console.log("Writing to terminal (STDOUT only)", id, msg);
        },
        async (id) => {
          console.log("Deleting terminal", id);
        },
        (id) => {
          console.error("STDIN is not supported on this node");

          return null;
        }
      )
    );
  }, []);

  useEffect(() => {
    if (node) {
      node.open(`apiVersion: webnetes.felicitas.pojtinger.com/v1alpha1
kind: Signaler
metadata:
  name: Public unisockets Signaling Server
  label: unisockets_public
spec:
  urls:
    - wss://unisockets.herokuapp.com
  retryAfter: 1000
---
apiVersion: webnetes.felicitas.pojtinger.com/v1alpha1
kind: StunServer
metadata:
  name: Google STUN Server
  label: google
spec:
  urls:
    - stun:stun.l.google.com:19302
---
apiVersion: webnetes.felicitas.pojtinger.com/v1alpha1
kind: StunServer
metadata:
  name: Twillio STUN Server
  label: twillio
spec:
  urls:
    - stun:global.stun.twilio.com:3478?transport=udp
---
apiVersion: webnetes.felicitas.pojtinger.com/v1alpha1
kind: TurnServer
metadata:
  name: Twillio TURN Server (UDP)
  label: twillio_udp
spec:
  urls:
    - turn:global.turn.twilio.com:3478?transport=tcp
  username: f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d
  credential: w1uxM55V9yVoqyVFjt+mxDBV0F87AUCemaYVQGxsPLw=
---
apiVersion: webnetes.felicitas.pojtinger.com/v1alpha1
kind: TurnServer
metadata:
  name: Twillio TURN Server (TCP)
  label: twillio_tcp
spec:
  urls:
    - turn:global.turn.twilio.com:3478?transport=tcp
  username: f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d
  credential: w1uxM55V9yVoqyVFjt+mxDBV0F87AUCemaYVQGxsPLw=
---
apiVersion: webnetes.felicitas.pojtinger.com/v1alpha1
kind: TurnServer
metadata:
  name: Twillio TURN Server Fallback (TCP)
  label: twillio_tcp_fallback
spec:
  urls:
    - turn:global.turn.twilio.com:443?transport=tcp
  username: f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d
  credential: w1uxM55V9yVoqyVFjt+mxDBV0F87AUCemaYVQGxsPLw=
---
apiVersion: webnetes.felicitas.pojtinger.com/v1alpha1
kind: NetworkInterface
metadata:
  name: Management Network
  label: management_network
spec:
  network: ""
  prefix: 127.0.0`);
    }
  }, [node]);

  return (
    <>
      <h1>Webnetesctl Playground</h1>

      <Editor
        height="90vh"
        language="yaml"
        options={{ cursorSmoothCaretAnimation: true }}
      />
    </>
  );
}

export default HomePage;
