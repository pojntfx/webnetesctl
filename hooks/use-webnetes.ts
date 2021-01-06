import { feature } from "@ideditor/country-coder";
import { EResourceKind, Node } from "@pojntfx/webnetes";
import * as Nominatim from "nominatim-browser";
import getPublicIp from "public-ip";
import { useCallback, useEffect, useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import clusterConnectionsData from "../data/network-connections.json";
import nodeConfigData, { nodeId as nodeIdData } from "../data/node-config";
import statsComputeData from "../data/stats-compute.json";
import statsNetworkingData from "../data/stats-networking.json";

export const NODE_GID = 0;

export interface IConnections {
  management: number[][][];
  application: number[][][];
}

export interface IGraph {
  nodes: { id: string; group: number }[];
  links: {
    source: string;
    target: string;
    value: number;
  }[];
}

export interface IClusterNode {
  privateIP: string;
  publicIP: string;
  location: string;
  latitude: number;
  longitude: number;
  size: number;
}

export interface IClusterResource {
  kind: string;
  name: string;
  label: string;
  node: string;
  src: string;
}

export interface INodeScore {
  ip: string;
  score: number;
}

export const useWebnetes = ({
  onResourceRejection,
}: {
  onResourceRejection: (diagnostics: any) => Promise<void>;
}) => {
  // Hooks
  const { t } = useTranslation();

  // State
  const [clusterGraph, setClusterGraph] = useState<IGraph>();
  const [localGraph, setLocalGraph] = useState<IGraph>();
  const [networkGraph, setNetworkGraph] = useState<IGraph>();
  const [
    networkGraphForLocalGraph,
    setNetworkGraphForLocalGraph,
  ] = useState<IGraph>();
  const [resourceGraph, setResourceGraph] = useState<IGraph>();

  const [computeStats, setComputeStats] = useState<INodeScore[]>();
  const [networkingStats, setNetworkingStats] = useState<INodeScore[]>();

  const [clusterConnections, setClusterConnections] = useState<IConnections>();
  const [clusterNodes, setClusterNodes] = useState<IClusterNode[]>([]);
  const [clusterResources, setClusterResources] = useState<IClusterResource[]>(
    []
  );

  const [nodeConfig, setNodeConfig] = useState<string>();
  const [nodeId, setNodeId] = useState<string>();
  const nodeIdRef = useRef<string>();

  const [nodePublicIPv6, setNodePublicIPv6] = useState<string>();

  const [nodeCoordinates, setNodeCoordinates] = useState<number[]>([0, 0]);
  const [nodeCoordinatesLoading, setNodeCoordinatesLoading] = useState(false);
  const [nodeAddress, setNodeAddress] = useState<string>();
  const [nodeFlag, setNodeFlag] = useState<string>();

  const [log, setLog] = useState<string[]>([]);

  const [node, setNode] = useState<Node>();
  const [nodeOpened, setNodeOpened] = useState(false);

  // Callbacks
  const getResourceGraphForNode = useCallback(
    (nodeIdFilter: string) => {
      // Parse serialized resources
      const resources = clusterResources!
        .filter((resource) => resource.node === nodeIdFilter)
        .map((resource) => JSON.parse(JSON.parse(resource.src)));

      // Group by kinds
      const kinds = new Map<string, { gid: number; items: string[] }>();
      kinds.set("Node", { gid: NODE_GID, items: [nodeIdFilter] });
      resources.forEach((resource) => {
        !kinds.has(resource.kind) &&
          kinds.set(resource.kind, { gid: kinds.size, items: [] });

        kinds.get(resource.kind)!.items.push(resource.metadata.label); // We set abolve
      });

      // Collect to nodes
      const nodes: any[] = [];
      kinds.forEach((res, kind) =>
        res.items.forEach((label) =>
          nodes.push({ group: res.gid, id: `${kind}/${label}` })
        )
      );

      // Connect everything but the root node itself to the root node
      const links: any[] = [];
      nodes.forEach(
        (node) =>
          node.group !== NODE_GID && // Don't connect nodes to each other
          nodes
            .filter((candidate) => candidate.group === NODE_GID)
            .forEach((nodeResource) =>
              links.push({
                source: nodeResource.id,
                target: node.id,
                value: 1,
              })
            )
      );

      return { nodes, links };
    },
    [clusterResources]
  );

  const mergeResourceAndNetworkGraphs = useCallback(
    (resourceGraphs: IGraph[], networkGraph: IGraph) => {
      // Merge nodes
      let nodes: any[] = [];
      resourceGraphs.forEach((resourceGraph) => {
        nodes = [...nodes, ...resourceGraph.nodes];
      });

      // Remove duplicates
      nodes = [...nodes, ...networkGraph.nodes].reduce(
        (all, curr) =>
          all.find((candidate: IGraph["nodes"][0]) => candidate.id === curr.id)
            ? all
            : [...all, curr],
        []
      );

      // Merge links
      let links: any[] = [];
      resourceGraphs.forEach((resourceGraph) => {
        links = [...links, ...resourceGraph.links];
      });

      return {
        nodes,
        links: [...links, ...networkGraph.links].map((link) => ({
          source: link.source,
          target: link.target,
          value: link.value,
        })),
      };
    },
    []
  );

  const appendToLog = useCallback(
    // Add to the end of the visual log
    (msg) => {
      setLog((oldLog) => [
        ...oldLog,
        `${new Date().toLocaleTimeString()}: ${msg}`,
      ]);
    },
    [log]
  );

  const refreshNodeLocation = useCallback(() => {
    // Get a user's coordinates and set them
    setNodeCoordinatesLoading(true);
    appendToLog(t("requestedLocation"));

    typeof window !== "undefined" &&
      navigator.geolocation.getCurrentPosition(
        (position) => {
          unstable_batchedUpdates(() => {
            setNodeCoordinates([
              position.coords.latitude,
              position.coords.longitude,
            ]);
            setNodeCoordinatesLoading(false);
            appendToLog(t("resolvedLocation"));
          });
        },
        (e) => {
          console.error(
            "could not get user location, falling back to [0, 0]",
            e
          );

          setNodeCoordinates([0, 0]);
          setNodeCoordinatesLoading(false);
          appendToLog(t("deniedLocationAccess"));
        }
      );
  }, []);

  // Effects
  useEffect(() => {
    // Set initial state
    unstable_batchedUpdates(() => {
      setComputeStats(statsComputeData);
      setNetworkingStats(statsNetworkingData);

      setClusterConnections(clusterConnectionsData);

      setNodeConfig(nodeConfigData);
      setNodeId(nodeIdData);
    });
  }, []);

  useEffect(() => {
    // Create the resource graph
    if (clusterResources && nodeId) {
      setResourceGraph(getResourceGraphForNode(nodeId));
    }
  }, [clusterResources, nodeId]);

  useEffect(() => {
    // Create the network graph
    if (clusterNodes) {
      // Transform into graph-internal node format
      const nodes = clusterNodes.map((node) => ({
        id: `Node/${node.privateIP}`,
        group: NODE_GID,
      }));

      // Connect every node to every other node except for itself
      const links: any[] = [];
      nodes.forEach((node) =>
        nodes
          .filter((candidate) => candidate.id !== node.id)
          .forEach((peer) =>
            links.push({
              source: node.id,
              target: peer.id,
              value: 1,
            })
          )
      );

      // Three.js modifies the graphs below. We have to store & copy them seperately like so.
      setNetworkGraph({
        nodes: nodes.map((node) => ({
          id: node.id,
          group: node.group,
        })),
        links: links.map((link) => ({
          source: link.source,
          target: link.target,
          value: link.value,
        })),
      });

      setNetworkGraphForLocalGraph({
        nodes: nodes.map((node) => ({
          id: node.id,
          group: node.group,
        })),
        links: links.map((link) => ({
          source: link.source,
          target: link.target,
          value: link.value,
        })),
      });
    }
  }, [clusterNodes]);

  useEffect(() => {
    // Create node-local/"peer-resources" graph
    if (nodeId && networkGraphForLocalGraph) {
      // Get resource graph for nodeId
      const resourceGraph = getResourceGraphForNode(nodeId);

      // Merge resource graph and network graph
      const mergedGraph = mergeResourceAndNetworkGraphs(
        [resourceGraph],
        networkGraphForLocalGraph
      );

      setLocalGraph(mergedGraph);
    }
  }, [nodeId, networkGraphForLocalGraph]);

  useEffect(() => {
    // Create cluster-wide resource graph
    if (clusterNodes && networkGraph) {
      // Get resource graph for each node
      const resourceGraphs = clusterNodes.map((node) =>
        getResourceGraphForNode(node.privateIP)
      );

      // Merge resource graphs and network graph
      const mergedGraph = mergeResourceAndNetworkGraphs(
        resourceGraphs,
        networkGraph
      );

      setClusterGraph(mergedGraph);
    }
  }, [clusterNodes, networkGraph]);

  useEffect(() => {
    // Get the public IPv6 address
    getPublicIp
      .v6()
      .then((ip) => setNodePublicIPv6(ip))
      .catch((e) => console.log("could not get public IPv6", e));
  }, []);

  useEffect(() => {
    // Map coordinates to an address
    Nominatim.reverseGeocode({
      lat: nodeCoordinates[0].toString(),
      lon: nodeCoordinates[1].toString(),
      addressdetails: true,
    }).then((res: any) => {
      if (res.address?.country_code) {
        const feat = feature(res.address?.country_code as string);

        if (feat) {
          unstable_batchedUpdates(() => {
            setNodeAddress(res.display_name);
            setNodeFlag(feat.properties.emojiFlag!);
          });
        }
      }
    });
  }, [nodeCoordinates]);

  useEffect(() => {
    setNode(
      new Node(
        async (resource) => {
          appendToLog(`Created resource: ${resource}`);

          if (nodeIdRef.current) {
            setClusterResources((oldClusterResources) => [
              ...oldClusterResources,
              {
                kind: resource.kind,
                name: resource.metadata.name || resource.metadata.label,
                label: resource.metadata.label,
                node: nodeIdRef.current!, // We check above
                src: JSON.stringify(JSON.stringify(resource)),
              },
            ]);
          }
        },
        async (resource) => {
          appendToLog(`Deleted resource: ${resource}`);

          setClusterResources((oldClusterResources) =>
            oldClusterResources.filter(
              (candidate) =>
                !(
                  candidate.kind === resource.kind &&
                  candidate.label === resource.metadata.label
                )
            )
          );

          if (resource.kind === EResourceKind.WORKLOAD) {
            window.location.reload();
          }
        },
        async (frame) => {
          appendToLog(`Rejected resource: ${frame}`);

          await onResourceRejection(frame);
        },
        async (id) => {
          appendToLog(`Management node acknowledged: ${id}`);

          setNodeId(id);
          nodeIdRef.current = id;
          setClusterNodes((oldClusterNodes) => [
            ...oldClusterNodes,
            {
              privateIP: id,
              publicIP: "NOT_IMPLEMENTED",
              location: "NOT_IMPLEMENTED",
              latitude: 0,
              longitude: 0,
              size: 10000000,
            },
          ]);
        },
        async (id) => {
          appendToLog(`Management node joined: ${id}`);

          setClusterNodes((oldClusterNodes) => [
            ...oldClusterNodes,
            {
              privateIP: id,
              publicIP: "NOT_IMPLEMENTED",
              location: "NOT_IMPLEMENTED",
              latitude: 0,
              longitude: 0,
              size: 10000000,
            },
          ]);
        },
        async (id) => {
          appendToLog(`Management node left: ${id}`);

          setClusterNodes((oldClusterNodes) =>
            oldClusterNodes.filter((candidate) => candidate.privateIP !== id)
          );
        },
        async (metadata, spec, id) => {
          appendToLog(
            `Resource node acknowledged: ${metadata}, ${spec}, ${id}`
          );

          setClusterNodes((oldClusterNodes) => [
            ...oldClusterNodes,
            {
              privateIP: id,
              publicIP: "NOT_IMPLEMENTED",
              location: "NOT_IMPLEMENTED",
              latitude: 0,
              longitude: 0,
              size: 10000000,
            },
          ]);
        },
        async (metadata, spec, id) => {
          appendToLog(`Resource node joined: ${metadata}, ${spec}, ${id}`);

          setClusterNodes((oldClusterNodes) => [
            ...oldClusterNodes,
            {
              privateIP: id,
              publicIP: "NOT_IMPLEMENTED",
              location: "NOT_IMPLEMENTED",
              latitude: 0,
              longitude: 0,
              size: 10000000,
            },
          ]);
        },
        async (metadata, spec, id) => {
          appendToLog(`Resource node left: ${metadata}, ${spec}, ${id}`);

          setClusterNodes((oldClusterNodes) =>
            oldClusterNodes.filter((candidate) => candidate.privateIP !== id)
          );
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

  return {
    graphs: {
      cluster: clusterGraph,
      network: networkGraph,
      resources: resourceGraph,
      local: localGraph,
    },
    stats: {
      compute: computeStats,
      networking: networkingStats,
    },
    cluster: {
      connections: clusterConnections,
      nodes: clusterNodes,
      resources: clusterResources,
    },
    local: {
      nodeConfig,
      setNodeConfig,
      nodeId,
      nodePublicIPv6,

      location: {
        refreshLocation: refreshNodeLocation,
        loading: nodeCoordinatesLoading,
        latitude: nodeCoordinates[0],
        longitude: nodeCoordinates[1],
        address: nodeAddress,
        flag: nodeFlag,
      },
    },
    log,
    node: {
      open: async (config: string) => {
        await node?.open(config);

        setNodeOpened(true);
      },
      close: async () => await node?.close(),
      opened: nodeOpened,
    },
  };
};
